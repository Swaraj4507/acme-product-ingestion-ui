import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Package, Webhook, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/products", label: "Products", icon: Package },
    { path: "/webhooks", label: "Webhooks", icon: Webhook },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="hidden sm:inline">ACME Product Ingestion</span>
                  <span className="sm:hidden">ACME</span>
                </h1>
              </div>
            </Link>
            <div className="flex gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-9 px-2 sm:px-4",
                        isActive && "bg-primary text-primary-foreground shadow-sm"
                      )}
                    >
                      <Icon className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
};

