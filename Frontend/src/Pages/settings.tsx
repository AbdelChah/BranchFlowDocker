import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HeaderNav } from "../components/headerNav";
const api_base_url = import.meta.env.VITE_API_BASE_URL;

// Define the User type based on your database schema
interface User {
  UserID: number;
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  CreationDate: string;
  ModificationDate: string;
  RoleID: number;
  Lastlogin: string | null;
  Lastlogout: string | null;
}

export function Settings() {
  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`http://${api_base_url}/user/settings`, {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });
  
        if (response.ok) {
          const data: User = await response.json();
          setUserData(data);
          setUsername(data.Username); // Set username in the form
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
  
    fetchUserData();
  }, []);
  

  const handleSave = async () => {
    try {
      const response = await fetch('http://${api_base_url}/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      if (response.ok) {
        alert('Settings updated successfully');
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col">
      <HeaderNav onSearch={() => {}} />
      <main className="flex-1 p-6 lg:p-8">
        <div className="container mx-auto space-y-6">
          <h1 className="text-4xl font-semibold">Settings</h1>

          <Card className="border rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Read-only information about your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <Label htmlFor="firstName" className="mb-2">First Name</Label>
                <Input 
                  id="firstName" 
                  value={userData?.FirstName || ""} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="lastName" className="mb-2">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={userData?.LastName || ""} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="userID" className="mb-2">User ID</Label>
                <Input 
                  id="userID" 
                  value={userData?.UserID || ""} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="role" className="mb-2">Role ID</Label>
                <Input 
                  id="role" 
                  value={userData?.RoleID || ""} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>Update your username.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <form className="w-full">
                  <Label htmlFor="username" className="mb-2">Username</Label>
                  <Input
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-center mb-4"
                  />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-center">
                <Button onClick={handleSave}>Save</Button>
              </CardFooter>
            </Card>

            <Card className="border rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <form className="w-full">
                  <Label htmlFor="password" className="mb-2">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-center mb-4"
                  />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 flex justify-center">
                <Button onClick={handleSave}>Save</Button>
              </CardFooter>
            </Card>
          </div>

          <Separator />

          <Card className="border rounded-lg shadow-lg">
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>Review your recent login activities.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <Label htmlFor="lastLogin" className="mb-2">Last Login</Label>
                <Input 
                  id="lastLogin" 
                  value={userData?.Lastlogin ? new Date(userData.Lastlogin).toLocaleString() : ''} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor="lastLogout" className="mb-2">Last Logout</Label>
                <Input 
                  id="lastLogout" 
                  value={userData?.Lastlogout ? new Date(userData.Lastlogout).toLocaleString() : ''} 
                  readOnly 
                  className="text-center mb-4" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Settings;
