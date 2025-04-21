// src/components/layout/mobile-nav.tsx
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <header className={cn("border-b", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Saxon Scout
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/teams"
                  className="text-lg hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Teams
                </Link>
                <Link
                  to="/events"
                  className="text-lg hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Events
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/scouting"
                    className="text-lg hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    Scouting
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user?.name}
                    </span>
                    {user?.role === "admin" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/admin");
                          setOpen(false);
                        }}
                      >
                        Admin
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate("/login");
                        setOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate("/register");
                        setOpen(false);
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};