import React, { useState } from "react";
import { HeaderNav } from "../components/headerNav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";

// User roles (example roles)
const roles = ["Site Admin", "Accounting", "Head Teller", "Teller"];

const UserManagementPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users] = useState<any[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Teller", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Head Teller", status: "Inactive" },
    // Add more mock users here...
  ]);

  const transactionsPerPage = 10;
  const totalPages = Math.ceil(users.length / transactionsPerPage);

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentUsers = users.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="min-h-screen p-4">
      <HeaderNav onSearch={() => {}} />
      <h1 className="text-4xl font-semibold py-4">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <Button>Add New User</Button>
        <Input type="search" placeholder="Search users..." className="w-1/3" />
      </div>

      <Table className="min-w-full text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">User Info</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id} onClick={() => handleUserClick(user)} className="cursor-pointer hover:bg-gray-100">
              <TableCell className="text-center">
                {user.name}
                <br />
                <small>{user.email}</small>
              </TableCell>
              <TableCell className="text-center">
                <Select value={user.role} onValueChange={(value) => console.log(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={user.role} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">{user.status}</TableCell>
              <TableCell className="text-center">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive" className="ml-2">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div>{`Page ${currentPage} of ${totalPages}`}</div>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {selectedUser && (
        <Drawer>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit User</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Close</Button>
              </DrawerClose>
            </DrawerHeader>
            <div className="p-4">
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
              </div>
              <div className="mb-4">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedUser.role} onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="default">Save Changes</Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default UserManagementPage;
