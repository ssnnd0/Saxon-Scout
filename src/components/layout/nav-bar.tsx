// src/components/layout/nav-bar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface NavBarProps {
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={cn("border-b", className)}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Saxon Scout
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/teams" className="hover:text-primary">
                Teams
              </Link>
              <Link to="/events" className="hover:text-primary">
                Events
              </Link>
              {isAuthenticated && (
                <Link to="/scouting" className="hover:text-primary">
                  Scouting
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Admin
                  </Button>
                )}
                <Button variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};