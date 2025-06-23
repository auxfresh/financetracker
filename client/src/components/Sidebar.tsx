import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center px-6 py-4 border-b">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="ml-3 text-xl font-medium">Finance Manager</h1>
      </div>
      
      <nav className="mt-6 flex-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <button
              key={item.name}
              onClick={() => {
                setLocation(item.href);
                setMobileOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-6 py-3 text-left transition-colors",
                isActive
                  ? "text-primary bg-primary/10 border-r-3 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t">
        <div className="flex items-center mb-4">
          <Avatar>
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden bg-background shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-lg font-medium">Finance Manager</h1>
        <div className="w-10"></div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-background shadow-lg">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-background shadow-lg z-50 lg:hidden">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </div>
        </>
      )}
    </>
  );
}
