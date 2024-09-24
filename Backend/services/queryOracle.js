const oracledb = require('oracledb');

// Oracle DB connection settings
const config = {
  user: 'suitedba',
  password: 'suitedba',
  connectString: '10.11.150.200:1521/BoBF60DB'
};

async function runQuery() {
  let connection;

  try {
    // Establish the connection to the Oracle database
    connection = await oracledb.getConnection(config);

    console.log('Connected to Oracle database');

    // Oracle SQL query
    const query = `
    WITH TBL AS 
    (SELECT (SELECT MBU.BSN_GROUP_ID 
               FROM MDM_BUSINESS_UNIT MBU 
              WHERE MBU.ENT_CODE = RSS.STO_ID 
                AND MBU.BSN_UNIT_TYPE_CODE = 3) BSNGP 
       FROM REF_STO_STORE RSS 
      WHERE RSS.CBF_ID = (SELECT OC.CBF_ID 
                            FROM REF_OSE_CBF OC 
                           WHERE OC.CBF_INTERNAL_CODE =  1
                             AND OC.CBF_P_ID IS NOT NULL) 
        AND RSS.STO_INTERNAL_CODE = '01'
     ) 
   SELECT FT.BSN_GROUP_ID, 
          FT.DST_BSN_GROUP_ID, 
          DECODE(FT.VEN_ID, 6, FT.TRANSACTION_INTERNAL_CODE, 
          SUBSTR(FT.TRANSACTION_INTERNAL_CODE, 5, 
          LENGTH(FT.TRANSACTION_INTERNAL_CODE))) TRANSFERNUMBER, 
          FT.TRANSACTION_ID, 
          DECODE(FT.Ven_Id, 6,
                  (CASE 
                    WHEN FTD.STATUS_CODE = 7 THEN 
                     'PAY' 
                    WHEN FTD.STATUS_CODE = 20 THEN 
                     'RECV' 
                  END), 'RECV') CATEGORY,               
         (DECODE(FT.CUR_ID,1,100,1) *  
                (SELECT NVL(CI.CHARGE_AMNT,0) + NVL(CI.E_VIGNETTE_DELIV_CHARGE_AMNT,0)
                   FROM FIN_TRANSACTION_CHARGE_INFO CI 
                  WHERE CI.TRANSACTION_ID = FT.TRANSACTION_ID)) FEES,    
         (DECODE(FT.CUR_ID,1,100,1) *  NVL(FT.PSYCHO_RULE_VALUE,0)) ROUDING,
         (DECODE(FT.CUR_ID,1,100,1) * 
                (FT.TRANSACTION_AMNT - 
                  (NVL(FT.PSYCHO_RULE_VALUE,0) + 
                  (SELECT CI.CHARGE_AMNT + NVL(CI.E_VIGNETTE_DELIV_CHARGE_AMNT,0)
                      FROM FIN_TRANSACTION_CHARGE_INFO CI 
                     WHERE CI.TRANSACTION_ID = FT.TRANSACTION_ID)))) AMOUNT,
         (SELECT RCC.ISO_CUR_CODE 
             FROM REF_COM_CURRENCY RCC 
            WHERE RCC.CUR_ID = FT.CUR_ID) CURRENCY, 
          NVL((CASE 
              WHEN EXISTS (SELECT 1 
                      FROM REF_CUSTOMER RC, HR_PERSON HP 
                     WHERE HP.PARTY_ID = RC.PARTY_ID 
                       AND RC.CUSTOMER_ID = FT.SRC_CUSTOMER_ID) THEN 
               (SELECT SUBSTR(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME, 0, LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)-2)||
                         REGEXP_REPLACE(SUBSTR(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME, LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)-1, 
                          LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)), '[]~!@#$''%^&*()_+=\{}[:”;’<,>./?]+', '')
                  FROM HR_PERSON HP, REF_CUSTOMER RC 
                 WHERE HP.PARTY_ID = RC.PARTY_ID 
                   AND RC.CUSTOMER_ID = FT.SRC_CUSTOMER_ID) 
              ELSE 
               (SELECT SUBSTR(ROC.SOC_NAME, 0, LENGTH(ROC.SOC_NAME)-2)||REGEXP_REPLACE(SUBSTR(ROC.SOC_NAME, LENGTH(ROC.SOC_NAME)-1, 
                        LENGTH(ROC.SOC_NAME)), '[]~!@#$''%^&*()_+=\{}[:”;’<,>./?]+', '')
                  FROM REF_CUSTOMER RC, REF_OSE_COMPANY ROC 
                 WHERE ROC.PARTY_ID = RC.PARTY_ID 
                   AND RC.CUSTOMER_ID = FT.SRC_CUSTOMER_ID) 
            END), 'N/A') SENDERNAME, 
          DECODE(FT.VEN_ID, 6,
                (CASE 
                  WHEN EXISTS (SELECT 1 
                          FROM REF_CUSTOMER RC, HR_PERSON HP 
                         WHERE HP.PARTY_ID = RC.PARTY_ID 
                           AND RC.CUSTOMER_ID = FT.DST_CUSTOMER_ID) THEN 
                   (SELECT SUBSTR(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME, 0, LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)-2)||
                             REGEXP_REPLACE(SUBSTR(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME, LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)-1, 
                              LENGTH(HP.PERSON_FNAME || ' ' || HP.PERSON_LNAME)), '[]~!@#$''%^&*()_+=\{}[:”;’<,>./?]+', '')
                      FROM HR_PERSON HP, REF_CUSTOMER RC 
                     WHERE HP.PARTY_ID = RC.PARTY_ID 
                       AND RC.CUSTOMER_ID = FT.DST_CUSTOMER_ID) 
                  ELSE 
                   (SELECT SUBSTR(ROC.SOC_NAME, 0, LENGTH(ROC.SOC_NAME)-2)||REGEXP_REPLACE(SUBSTR(ROC.SOC_NAME, LENGTH(ROC.SOC_NAME)-1, 
                            LENGTH(ROC.SOC_NAME)), '[]~!@#$''%^&*()_+=\{}[:”;’<,>./?]+', '')
                      FROM REF_CUSTOMER RC, REF_OSE_COMPANY ROC 
                     WHERE ROC.PARTY_ID = RC.PARTY_ID 
                       AND RC.CUSTOMER_ID = FT.DST_CUSTOMER_ID) 
                END), (SELECT v.ven_name FROM ref_ven_vendor v WHERE v.ven_id = FT.Ven_Id)) RECEIVERNAME, 
          TO_CHAR(FT.STATUS_BDATE, 'YYYYMMDD') SENDDATE, 
          ftd.status_code,
          FT.ITM_ID SERVICE_ID,
          FT.VEN_ID SERVICE_PROVIDER_ID,
          (SELECT V.VEN_NAME FROM REF_VEN_VENDOR V WHERE V.VEN_ID = FT.VEN_ID) SERVICE_PROVIDER_NAME,
          DECODE(FT.VEN_ID,6,'TRUE','FALSE') IsIntra,
          FT.VIGNETTE_DELIVERY_PLACE_CODE Product
     FROM FIN_TRANSACTION FT, FIN_TRANSACTION_DSTAT FTD 
    WHERE FT.TRANSACTION_ID = FTD.TRANSACTION_ID 
      AND TRUNC(FTD.STATUS_BDATE) = TRUNC(SYSDATE) 
      AND FTD.STATUS_CODE IN (SELECT 7 FROM dual WHERE FT.Ven_Id = 6 UNION SELECT 20 FROM dual WHERE FT.Ven_Id = 6 UNION SELECT 7 FROM dual WHERE FT.Ven_Id IN (12,19,20,21,24)) 
      AND FT.Ven_Id IN (6,12,19,20,21,24)      
      AND FT.Itm_Id IN (SELECT I.ITM_ID FROM REF_ITEM I WHERE I.ITM_NAME IN ('MONEY TRANSFER','UNION','MINISTRY OF FINANCE','BILL COLLECTION') AND I.KTY_CODE = 200) 
      AND FTD.CREATED_BY IN (SELECT EMP_ID 
                               FROM USM_USER_BSN_GRP_INCL GI 
                              WHERE GI.BSN_GROUP_ID = (SELECT BSNGP FROM TBL)) 
     ORDER BY FT.VEN_ID, FT.CUR_ID DESC
    `;

    // Execute the query
    const result = await connection.execute(query);
    console.log("Query Results:", result.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    if (connection) {
      try {
        // Close the connection
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Run the query
runQuery();
