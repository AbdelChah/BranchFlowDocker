const db = require('../config/db');

// Create transaction
exports.createTransaction = async (req, res) => {
  const { ReferenceNumber, ServiceName, Amount, Currency, UserID, FirstName, LastName } = req.body;

  try {
    // Fetch ServiceID based on ServiceName
    const [serviceResult] = await db.promise().query('SELECT id FROM services WHERE title = ?', [ServiceName]);
    if (serviceResult.length === 0) {
      return res.status(400).json({ error: 'Service not found' });
    }
    const ServiceID = serviceResult[0].id;

    // Calculate Commission (2% of the Amount)
    const Commission = (Amount * 0.02).toFixed(2);

    // Calculate Rounding
    const TotalAmount = (parseFloat(Amount) + parseFloat(Commission)).toFixed(2);
    const Rounding = (Math.ceil(TotalAmount) - TotalAmount).toFixed(2);

    // Handle optional LastName
    const lastNameValue = LastName ? LastName : null;

    // Insert the transaction into the transactions table (without TransactionID, CreationDate, ModificationDate)
    const sql = `
      INSERT INTO transactions 
      (ReferenceNumber, CreationDate, ServiceID, Amount, Commission, Rounding, TotalAmount, Currency, TillID, FirstName, LastName, IsCancelled, OriginalTransID)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL)
    `;

    await db.promise().query(sql, [
      ReferenceNumber,
      ServiceID,
      Amount,
      Commission,
      Rounding,
      TotalAmount,
      Currency,
      UserID,  // Assuming TillID is the same as UserID here
      FirstName,
      lastNameValue,
    ]);

    // Update the transaction count for the user
    await db.promise().query('UPDATE user SET transaction_count = transaction_count + 1 WHERE UserID = ?', [UserID]);

    // Fetch the updated transaction_count and goal for the user
    const [userGoalResult] = await db.promise().query('SELECT transaction_count, goal FROM user WHERE UserID = ?', [UserID]);

    if (userGoalResult.length > 0) {
      const { transaction_count, goal } = userGoalResult[0];

      if (transaction_count === goal) {
        // If the goal is met, respond with a "Congrats!" message
        return res.json({ message: 'Transaction created successfully', congrats: true });
      }
    }

    res.json({ message: 'Transaction created successfully' });
  } catch (error) {
    console.error('Error processing transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res) => {
  const { username } = req.query;

  try {
    const [userResult] = await db.promise().query('SELECT UserID FROM user WHERE Username = ?', [username]);
    if (userResult.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const UserID = userResult[0].UserID;

    const sql = `
      SELECT t.ReferenceNumber, t.CreationDate, t.ServiceID, t.Amount, t.TotalAmount, t.Currency, t.FirstName, t.LastName, s.title as ServiceName
      FROM transactions t
      JOIN services s ON t.ServiceID = s.id
      WHERE t.TillID = ?
      ORDER BY t.CreationDate DESC
    `;

    const [transactions] = await db.promise().query(sql, [UserID]);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get dashboard data
exports.getDashboardData = async (req, res) => {
  const { username } = req.query;

  try {
    const [userResult] = await db.promise().query('SELECT UserID, goal FROM user WHERE Username = ?', [username]);
    if (userResult.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const { UserID, goal } = userResult[0];

    // Total USD amount
    const [usdResult] = await db.promise().query('SELECT SUM(Amount) as usdTotal FROM transactions WHERE Currency = "USD" AND TillID = ?', [UserID]);
    const usdTotal = usdResult[0].usdTotal || 0;

    // Total LBP amount
    const [lbpResult] = await db.promise().query('SELECT SUM(Amount) as lbpTotal FROM transactions WHERE Currency = "LBP" AND TillID = ?', [UserID]);
    const lbpTotal = lbpResult[0].lbpTotal || 0;

    // Total number of transactions
    const [transactionCountResult] = await db.promise().query('SELECT COUNT(*) as totalTransactions FROM transactions WHERE TillID = ?', [UserID]);
    const totalTransactions = transactionCountResult[0].totalTransactions || 0;

    // Breakdown for pie chart data
    const [breakdownResult] = await db.promise().query(`
      SELECT s.title as serviceName, COUNT(*) as count
      FROM transactions t
      JOIN services s ON t.ServiceID = s.id
      WHERE t.TillID = ?
      GROUP BY s.title
    `, [UserID]);

    const pieChartData = breakdownResult.map(row => ({
      service: row.serviceName,
      count: row.count
    }));

    // Send back the dashboard data along with the user's goal
    res.json({ usdTotal, lbpTotal, totalTransactions, pieChartData, goal });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};


exports.startOfDay = async (req, res) => {
  const { userID, usd_sod_total, lbp_sod_total } = req.body;

  if (!userID || !usd_sod_total || !lbp_sod_total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the user has already submitted Start of Day for the current date
    const checkSODQuery = `
      SELECT * FROM cash_tracking 
      WHERE teller_id = ? AND DATE(sod_time) = CURDATE() AND status = 'SOD'
    `;
    const [existingSOD] = await db.promise().query(checkSODQuery, [userID]);

    if (existingSOD.length > 0) {
      return res.status(401).json({ error: 'Start of Day already submitted for today' });
    }

    // Calculate totals from USD and LBP denominations
    const usdTotal = Object.keys(usd_sod_total).reduce((acc, denomination) => {
      return acc + parseInt(denomination) * usd_sod_total[denomination];
    }, 0);

    const lbpTotal = Object.keys(lbp_sod_total).reduce((acc, denomination) => {
      return acc + parseInt(denomination) * lbp_sod_total[denomination];
    }, 0);

    // Insert Start of Day record into the database
    const sql = `
      INSERT INTO cash_tracking (
        teller_id, 
        TillID, 
        sod_time, 
        usd_sod_denominations, 
        lbp_sod_denominations, 
        usd_sod_total,
        lbp_sod_total,
        usd_running_total, 
        lbp_running_total, 
        status
      )
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, 'SOD')
    `;

    const TillID = userID; // Assuming TillID is the same as userID for now

    await db.promise().query(sql, [
      userID, 
      TillID, 
      JSON.stringify(usd_sod_total), 
      JSON.stringify(lbp_sod_total), 
      usdTotal, 
      lbpTotal, 
      usdTotal, // Initially same as usd_sod_total
      lbpTotal  // Initially same as lbp_sod_total
    ]);

    res.json({ message: 'Start of Day recorded successfully' });
  } catch (error) {
    console.error('Error recording Start of Day:', error);
    res.status(500).json({ error: 'Failed to record Start of Day' });
  }
};
