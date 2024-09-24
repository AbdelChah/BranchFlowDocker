import { useEffect, useState } from "react";
import { DollarSign, Coins, HandPlatter } from "lucide-react";
import { HeaderNav } from "../components/headerNav";
import { StatCard } from "@/components/StatCard";
import { PieChartComponent } from "@/components/PieChartComponent";
import { TransactionTable } from "@/components/TransactionTable";
const api_base_url = import.meta.env.VITE_API_BASE_URL;

export function Dashboard() {
  const [username, setUsername] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    usdTotal: 0,
    lbpTotal: 0,
    totalTransactions: 0,
    pieChartData: [],
    goal: 0
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `http://${api_base_url}/transactions/dashboard-data?username=${storedUsername}`,
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
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const formatAmount = (amount: string, currency: string) => {
    const formattedAmount = parseFloat(amount).toLocaleString("en-US");
    return currency === "USD" ? `$${formattedAmount}` : `${formattedAmount} LBP`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderNav onSearch={() => { }} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-3xl font-bold">Welcome, {username}</h1>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatCard
            title="TurnOver (USD)"
            value={`$${dashboardData.usdTotal.toLocaleString("en-US")}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            change="+20.1%"
          />
          <StatCard
            title="TurnOver (LBP)"
            value={`${dashboardData.lbpTotal.toLocaleString("en-US")} LBP`}
            icon={<Coins className="h-4 w-4 text-muted-foreground" />}
            change="+10.5%"
          />
          <StatCard
            title="Transactions Made"
            value={dashboardData.totalTransactions.toLocaleString("en-US") + "/" +dashboardData.goal.toLocaleString("en-US") }
            icon={<HandPlatter className="h-4 w-4 text-muted-foreground" />}
            change="+15%"
          />
          <StatCard
            title="Transactions Made"
            value={dashboardData.totalTransactions.toLocaleString("en-US")}
            icon={<HandPlatter className="h-4 w-4 text-muted-foreground" />}
            change="+15%"
          />
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">

            <TransactionTable
              username={username}
              formatAmount={formatAmount}
            />
          </div>
          <PieChartComponent />
        </div>
      </main>
    </div>
  );
}
