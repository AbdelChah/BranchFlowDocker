const api_base_url = import.meta.env.VITE_API_BASE_URL;
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaginationComponent } from "@/components/PaginationComponent";
import { GoalDrawer } from "@/components/GoalDrawer";

interface TransactionTableProps {
  username: string | null;
  formatAmount: (amount: string, currency: string) => string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ username, formatAmount }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 3;
  const [goal, setGoal] = useState(""); // Track the goal input

  useEffect(() => {
    if (!username) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://${api_base_url}/transactions/recenttransactions?username=${username}`,
          {
            method: 'GET',
            credentials: 'include', // Include credentials to send session cookie
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error("Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, [username]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const handleSetGoal = (newGoal: string) => {
    setGoal(newGoal);
    console.log("Goal set:", newGoal);
  };

  return (
    <Card className="xl:col-span-2 shadow-lg">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle className="flex flex-row items-left">Recents</CardTitle>
          <CardDescription>Recent transactions you made.</CardDescription>
        </div>
        {/* Set Goal Button */}
        <GoalDrawer onGoalSet={handleSetGoal} username={username} />
      </CardHeader>
      <CardContent className="h-[300px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800">
            <TableRow>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="hidden xl:table-cell text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.ReferenceNumber}>
                <TableCell>
                  <div className="font-medium">
                    {transaction.FirstName} {transaction.LastName}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{transaction.ServiceName}</div>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-center">
                  <Badge className="text-xs" variant="outline">Approved</Badge>
                </TableCell>
                <TableCell className="text-center">{new Date(transaction.CreationDate).toLocaleString()}</TableCell>
                <TableCell className="text-right">{formatAmount(transaction.TotalAmount, transaction.Currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
};
