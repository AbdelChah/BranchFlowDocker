import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeaderNav } from "../components/headerNav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertCircle } from "lucide-react"; // Import icons for success and error
const api_base_url = import.meta.env.VITE_API_BASE_URL;

// Define the exact types for the denominations
type UsdDenomination = 1 | 5 | 10 | 20 | 50 | 100;
type LbpDenomination = 1000 | 5000 | 10000 | 20000 | 50000 | 100000;

export function StartOfDay() {
  const [usdAmounts, setUsdAmounts] = useState<Record<UsdDenomination, number>>({
    1: 0,
    5: 0,
    10: 0,
    20: 0,
    50: 0,
    100: 0,
  });

  const [lbpAmounts, setLbpAmounts] = useState<Record<LbpDenomination, number>>({
    1000: 0,
    5000: 0,
    10000: 0,
    20000: 0,
    50000: 0,
    100000: 0,
  });

  const [isAlertOpen, setIsAlertOpen] = useState(false); // State to handle AlertDialog visibility
  const [alertMessage, setAlertMessage] = useState(""); // State to handle the dynamic message
  const [isSuccess, setIsSuccess] = useState(true); // State to track if the request was successful or failed

  // Load success and error sounds
  const successSound = new Audio('/sounds/success.mp3'); // Path to success sound
  const errorSound = new Audio('/sounds/error.mp3'); // Path to error sound

  const handleUsdChange = (denomination: UsdDenomination, value: number) => {
    setUsdAmounts((prev) => ({
      ...prev,
      [denomination]: value,
    }));
  };

  const handleLbpChange = (denomination: LbpDenomination, value: number) => {
    setLbpAmounts((prev) => ({
      ...prev,
      [denomination]: value,
    }));
  };

  const handleSubmit = async () => {
    // Retrieve the UserID from localStorage
    const userID = localStorage.getItem('userID');

    if (!userID) {
      alert("UserID not found in localStorage. Please log in.");
      return;
    }

    // Construct the request body
    const requestBody = {
      userID, // Include the UserID fetched from localStorage
      usd_sod_total: usdAmounts, // Keep USD denominations as is
      lbp_sod_total: lbpAmounts, // Keep LBP denominations as is
    };

    try {
      // Make the POST request to your backend
      const response = await fetch(`http://${api_base_url}/transactions/startofday`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials to send session cookie
        body: JSON.stringify(requestBody),
      });
      

      const data = await response.json();
      if (response.ok) {
        // If successful, set the success message, play success sound
        setAlertMessage('Start of Day submitted successfully!');
        setIsSuccess(true);
        successSound.play(); // Play success sound
        setIsAlertOpen(true); // Open the AlertDialog with the success message
      } else if (response.status === 401) {
        // If 401, show the error message, play error sound
        setAlertMessage('Start of Day already submitted for today.');
        setIsSuccess(false);
        errorSound.play(); // Play error sound
        setIsAlertOpen(true); // Open the AlertDialog with the error message
      }
    } catch (error) {
      console.error('Error submitting Start of Day:', error);
      alert('Error submitting Start of Day');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderNav onSearch={() => {}} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-4xl font-semibold">Start of Day</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {/* USD Table */}
          <Card className="bg-white dark:bg-black text-black dark:text-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">USD Denominations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="bg-white dark:bg-black text-black dark:text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center bg-white dark:bg-black text-black dark:text-white">Denomination</TableHead>
                    <TableHead className="text-center bg-white dark:bg-black text-black dark:text-white">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(usdAmounts).map((denomination) => (
                    <TableRow key={denomination}>
                      <TableCell className="text-center bg-white dark:bg-black text-black dark:text-white">${denomination}</TableCell>
                      <TableCell className="text-center bg-white dark:bg-black text-black dark:text-white">
                        <input
                          type="number"
                          value={usdAmounts[denomination as unknown as UsdDenomination]}
                          onChange={(e) =>
                            handleUsdChange(
                              denomination as unknown as UsdDenomination,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-300 focus:ring-indigo-500 dark:focus:ring-indigo-300 text-black dark:text-white sm:text-sm text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* LBP Table */}
          <Card className="bg-white dark:bg-black text-black dark:text-white">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">LBP Denominations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="bg-white dark:bg-black text-black dark:text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center bg-white dark:bg-black text-black dark:text-white">Denomination</TableHead>
                    <TableHead className="text-center bg-white dark:bg-black text-black dark:text-white">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(lbpAmounts).map((denomination) => (
                    <TableRow key={denomination}>
                      <TableCell className="text-center bg-white dark:bg-black text-black dark:text-white">{denomination} LBP</TableCell>
                      <TableCell className="text-center bg-white dark:bg-black text-black dark:text-white">
                        <input
                          type="number"
                          value={lbpAmounts[denomination as unknown as LbpDenomination]}
                          onChange={(e) =>
                            handleLbpChange(
                              denomination as unknown as LbpDenomination,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-300 focus:ring-indigo-500 dark:focus:ring-indigo-300 text-black dark:text-white sm:text-sm text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            Submit Start of Day
          </Button>
        </div>

        {/* AlertDialog for both success and error messages */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {isSuccess ? (
                  <>
                    Success <CheckCircle className="mr-1 text-green-500" />
                  </>
                ) : (
                  <>
                    Error <AlertCircle className="mr-1 text-red-500" />
                  </>
                )}
              </AlertDialogTitle>

              <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Okay</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
