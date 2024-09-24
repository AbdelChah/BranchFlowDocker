import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";  // Add the switch for toggling between USD and LBP
import { toast } from '@/components/ui/use-toast';
const api_base_url = import.meta.env.VITE_API_BASE_URL;
interface MTCTouchFormProps {
  onClose: () => void;
  serviceName: string; 
}

const MTCTouchForm: React.FC<MTCTouchFormProps> = ({ onClose, serviceName }) => {
  const [transactionNumber, setTransactionNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(''); // LBP amount for now
  const [currency, setCurrency] = useState('');
  const [denominations, setDenominations] = useState({
    '100,000': 0,
    '50,000': 0,
    '20,000': 0,
    '10,000': 0,
    '5,000': 0,
    '1,000': 0,
  });
  const [usdDenominations, setUsdDenominations] = useState({
    '100': 0,
    '50': 0,
    '20': 0,
    '10': 0,
    '5': 0,
    '1': 0,
  });
  const [outValues, setOutValues] = useState({
    '100,000': 0,
    '50,000': 0,
    '20,000': 0,
    '10,000': 0,
    '5,000': 0,
    '1,000': 0,
    '100': 0,
    '50': 0,
    '20': 0,
    '10': 0,
    '5': 0,
    '1': 0,
  });
  const [step, setStep] = useState(1);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUSD, setIsUSD] = useState(false);  // State for toggling between USD and LBP

  const handleValidate = () => {
    if (transactionNumber === '12345') {
      setFirstName('John');
      setLastName('Doe');
      setPhoneNumber('123-456-7890');
      setAmount('541000'); // For now, we'll assume a hardcoded amount of 541,000 LBP
      setValidated(true);
    } else {
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setAmount('');
      setValidated(false);
    }
  };

  const handleDenominationChange = (denomination: string, value: number, type: 'denomination' | 'out') => {
    if (type === 'denomination') {
      if (isUSD) {
        setUsdDenominations(prev => ({
          ...prev,
          [denomination]: value
        }));
      } else {
        setDenominations(prev => ({
          ...prev,
          [denomination]: value
        }));
      }
    } else if (type === 'out') {
      setOutValues(prev => ({
        ...prev,
        [denomination]: value
      }));
    }
  };

  const calculateTotalDenominations = () => {
    let totalIn = 0;
    let totalOut = 0;

    // Use the correct denominations based on the toggle (USD or LBP)
    const denominationsToUse = isUSD ? usdDenominations : denominations;

    // Convert string keys to numbers for calculation and sum up the total
    for (const [denomination, inCount] of Object.entries(denominationsToUse)) {
      const denomValue = parseInt(denomination.replace(/,/g, '')); // Remove commas, convert to number
      const outCount = outValues[denomination as keyof typeof outValues];
      totalIn += denomValue * inCount;
      totalOut += denomValue * outCount;
    }

    return totalIn - totalOut;
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Calculate the total denomination amount
    const totalDenomination = calculateTotalDenominations();

    // Validate the total denomination matches the amount
    if (totalDenomination !== parseInt(amount)) {
      toast({
        title: 'Error',
        description: `Denominations total (${totalDenomination} ${isUSD ? 'USD' : 'LBP'}) does not match the transaction amount (${amount} ${isUSD ? 'USD' : 'LBP'}).`,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        ReferenceNumber: transactionNumber,
        ServiceName: serviceName,
        Amount: amount,
        Currency: isUSD ? 'USD' : 'LBP',
        UserID: localStorage.getItem('userID'),
        FirstName: firstName,
        LastName: lastName
      };

      const response = await fetch(`http://${api_base_url}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials to send session cookie
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const data = await response.json(); // Parse the response to get the JSON data

        if (data.congrats) {
          // Show a "Congrats!" toast if the transaction goal has been reached
          toast({
            title: 'Congrats!',
            description: 'You have reached your transaction goal!',
            variant: 'default', // You can use 'success' to show a different variant for the congrats
          });
        } else {
          // Show the default success message if the goal wasn't reached
          toast({
            title: 'Success',
            description: 'Transaction created successfully',
            variant: 'default',
          });
        }
      
        // Perform any other actions, such as closing the modal
        onClose(); // Close the modal or take other action
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to create transaction',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {step === 1 ? (
        <form className="space-y-4">
          {/* Transaction form (first step) */}
          <div>
            <label htmlFor="transactionNumber" className="block text-sm font-medium text-gray-700">
              Transaction Number
            </label>
            <input
              type="text"
              name="transactionNumber"
              id="transactionNumber"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
            />
          </div>
          {/* Display other fields (read-only) */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              id="amount"
              value={amount}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 bg-gray-100"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleValidate} variant="outline">
              Validate
            </Button>
            {validated && (
              <Button type="button" onClick={() => setStep(2)}>
                Next
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div>
          {/* Toggle between USD and LBP */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">LBP</span>
            <Switch checked={isUSD} onCheckedChange={() => setIsUSD(!isUSD)} />
            <span className="text-sm font-medium text-gray-700">USD</span>
          </div>
          
          {/* Denomination Table (Step 2) */}
          <Table className="max-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center py-1">Denomination</TableHead>
                <TableHead className="text-center py-1">IN</TableHead>
                <TableHead className="text-center py-1">OUT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isUSD ? Object.entries(usdDenominations) : Object.entries(denominations))
                .sort((a, b) => parseInt(b[0].replace(/[^0-9]/g, '')) - parseInt(a[0].replace(/[^0-9]/g, '')))
                .map(([denomination, count]) => (
                  <TableRow key={denomination} className="h-6">
                    <TableCell className="text-center py-1">{denomination}</TableCell>
                    <TableCell className="text-center py-1">
                      <input
                        type="number"
                        value={count}
                        onChange={(e) => handleDenominationChange(denomination, parseInt(e.target.value), 'denomination')}
                        className="w-20 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 text-center"
                      />
                    </TableCell>
                    <TableCell className="text-center py-1">
                      <input
                        type="number"
                        value={outValues[denomination as keyof typeof outValues]}
                        onChange={(e) => handleDenominationChange(denomination, parseInt(e.target.value), 'out')}
                        className="w-20 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 text-center"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="flex justify-between space-x-2 mt-2">
            <Button type="button" onClick={() => setStep(1)} variant="outline">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MTCTouchForm;
