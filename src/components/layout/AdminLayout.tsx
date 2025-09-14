// src/components/layout/AdminLayout.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Box,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: <ShoppingCart className="mr-2 h-4 w-4" />,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <Box className="mr-2 h-4 w-4" />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("You have been logged out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white shadow-md flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-4 text-2xl font-bold text-[#004d66] border-b border-black/10">
          Smart Lan
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`flex font-medium items-center p-2 rounded-lg hover:bg-[#004d66]/10 text-black/80 transition-colors ${
                pathname === link.href
                  ? "bg-[#004d66] text-white hover:bg-[#004d66]"
                  : ""
              }`}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-black/10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-black/80"
              >
                <User className="mr-2" size={20} />
                <span>Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              aria-describedby="user-profile"
            >
              <div className="p-4 text-center">
                <DialogTitle className="mb-2 text-2xl font-bold">
                  <span className="sr-only">User Profile</span>
                </DialogTitle>
                <p className="font-semibold text-lg">Do you want to log out?</p>
                <p className="text-sm text-gray-500">Admin</p>
                <Button
                  onClick={handleLogout}
                  className="mt-4 w-full cursor-pointer"
                  variant="destructive"
                >
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[250px] p-4 bg-white border-black/10"
            >
              <div className="text-2xl font-bold text-[#004d66] mb-4">
                Smart Lan
              </div>
              <nav className="flex-1 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`flex font-medium items-center p-2 rounded-lg hover:bg-[#004d66]/10 text-black/80 transition-colors ${
                      pathname === link.href
                        ? "bg-[#004d66] text-white hover:bg-[#004d66] "
                        : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                ))}
              </nav>
                <div className="mt-8 border-t border-black/10 pt-4">
                <Button onClick={handleLogout} className="w-full justify-start" variant="ghost">
                  <LogOut className="mr-2" size={20} />
                  <span>Logout</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="text-2xl font-bold text-right text-[#004d66]">
            Smart Lan
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
