import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react"; // Import icons
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast"; // Import toast utility
const api_base_url = import.meta.env.VITE_API_BASE_URL;

const data = [
  { goal: 400 },
  { goal: 300 },
  { goal: 200 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 239 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 349 },
];

interface GoalDrawerProps {
  onGoalSet: (goal: string) => void;  // Call this to update the parent
  username: string | null;  // Pass the username for fetching goal
}

export const GoalDrawer: React.FC<GoalDrawerProps> = ({ onGoalSet, username }) => {
  const [goal, setGoal] = useState<number>(10); // Starting goal
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state
  const { toast } = useToast(); // Initialize toast

  // Fetch the current goal before opening the drawer
  const fetchGoal = async () => {
    if (!username) return;

    try {
      const response = await fetch(`http://${api_base_url}/transactions/dashboard-data?username=${username}`, {
        method: 'GET',
        credentials: 'include', // Include credentials to send session cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoal(data.goal ?? 10);  // Use existing goal or default to 10
      } else {
        console.error("Failed to fetch goal");
      }
    } catch (error) {
      console.error("Failed to fetch goal", error);
    }
  };

  const adjustGoal = (adjustment: number) => {
    setGoal(Math.max(2, Math.min(1500, goal + adjustment))); // Constrain goal between 2 and 1500
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Fetch userID from localStorage
    const userID = localStorage.getItem('userID'); // Assuming userID is stored in localStorage

    if (!userID) {
      console.error('No userID found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://${api_base_url}/user/update-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userID, // Using the userID from localStorage
          newGoal: goal,  // The new goal value
        }),
        credentials: 'include', // This ensures that credentials such as cookies are sent along with the request
      });

      if (response.ok) {
        toast({
          title: "Goal Updated Successfully",
          description: "Your transaction goal has been updated.",
          variant: "default"
        });
        setIsDrawerOpen(false); // Close the drawer on successful submit
        onGoalSet(goal.toString()); // Call parent method to update goal
      } else {
        toast({
          title: "Failed to Update Goal",
          description: "There was an issue updating your goal.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the goal.",
        variant: "destructive",
      });
      console.error('Error updating goal:', error);
    }
  };

  const handleDrawerOpen = () => {
    fetchGoal();  // Fetch goal when opening the drawer
    setIsDrawerOpen(true);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className="text-base ml-auto gap-1" onClick={handleDrawerOpen}>
          Set Goal
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Set Goal</DrawerTitle>
            <div className="text-muted-foreground">Set your monthly transaction goal.</div>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              {/* Decrease Goal Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => adjustGoal(-10)}
                disabled={goal <= 2}
              >
                <Minus className="h-4 w-4" />
              </Button>

              {/* Goal Display */}
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Transactions
                </div>
              </div>

              {/* Increase Goal Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => adjustGoal(10)}
                disabled={goal >= 1500}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Bar Chart */}
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={{
                      fill: "hsl(var(--foreground))",
                      opacity: 0.9,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Drawer Footer */}
          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
