import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../Helpers/mode-toggle";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
const api_base_url = import.meta.env.VITE_API_BASE_URL;

const handleLogout = async () => {
  try {
    const response = await fetch(`http://${api_base_url}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      localStorage.removeItem('username');
      window.location.href = '/login';
    } else {
      console.error('Failed to log out');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


interface HeaderNavProps {
  onSearch: (searchTerm: string) => void;
}

export function HeaderNav({ onSearch }: HeaderNavProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      localStorage.setItem("searchTerm", searchTerm);
      navigate("/services");
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a
          href="/dashboard"
          className={`flex items-center gap-2 text-lg font-semibold md:text-base ${location.pathname === "/" && "text-primary font-bold"}`}
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">BranchFlow</span>
        </a>
        <a
          href="/dashboard"
          className={`text-foreground transition-colors hover:text-foreground ${location.pathname === "/dashboard" && "text-primary font-bold"}`}
        >
          Dashboard
        </a>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className={`${location.pathname === "/services" || location.pathname === "/addService" ? "text-primary font-bold" : ""}`}>Services</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <a href="/services" className="block w-full">All Services</a>
              </MenubarItem>
              <MenubarItem>
                <a href="/addService" className="block w-full">Add a Service</a>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <a
          href="/startofday"
          className={`text-muted-foreground transition-colors hover:text-foreground ${location.pathname === "/ofday" && "text-primary font-bold"}`}
        >
          SOF
        </a>
        <a
          href="/eof"
          className={`text-muted-foreground transition-colors hover:text-foreground ${location.pathname === "/eof" && "text-primary font-bold"}`}
        >
          EOF
        </a>
        <a
          href="#"
          className={`text-muted-foreground transition-colors hover:text-foreground ${location.pathname === "/reports" && "text-primary font-bold"}`}
        >
          Reports
        </a>
        <a
          href="/settings"
          className={`text-muted-foreground transition-colors hover:text-foreground ${location.pathname === "/settings" && "text-primary font-bold"}`}
        >
          Settings
        </a>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <a
              href="/dashboard"
              className={`flex items-center gap-2 text-lg font-semibold ${location.pathname === "/" && "text-primary font-bold"}`}
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </a>
            <a href="/dashboard" className={`hover:text-foreground ${location.pathname === "/dashboard" && "text-primary font-bold"}`}>
              Dashboard
            </a>
            <a
              href="services"
              className={`text-muted-foreground hover:text-foreground ${location.pathname === "/services" && "text-primary font-bold"}`}
            >
              Services
            </a>
            <a
              href="products"
              className={`text-muted-foreground hover:text-foreground ${location.pathname === "/products" && "text-primary font-bold"}`}
            >
              SOF
            </a>
            <a
              href="#"
              className={`text-muted-foreground hover:text-foreground ${location.pathname === "/reports" && "text-primary font-bold"}`}
            >
              EOD
            </a>
            <a
              href="accounting"
              className={`text-muted-foreground hover:text-foreground ${location.pathname === "/accounting" && "text-primary font-bold"}`}
            >
              Reports
            </a>
            <a
              href="/Settings"
              className={`text-muted-foreground hover:text-foreground ${location.pathname === "/accounting" && "text-primary font-bold"}`}
            >
              Settings
            </a>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <a href="/settings"><DropdownMenuItem>Settings</DropdownMenuItem></a>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <a href="/login"><DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem></a>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </header>
  );
}
