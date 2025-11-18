import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Layers, RefreshCw, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/custom", label: "Custom Selection", icon: Settings },
  { path: "/paging", label: "Paging", icon: Layers },
  { path: "/page-replacement", label: "Page Replacement", icon: RefreshCw },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-card"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4">
            {/* Logo and Title */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-elegant">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Memory Management Comparison Simulator
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Interactive simulation of memory allocation and paging algorithms
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 transition-all whitespace-nowrap ${
                        isActive
                          ? "shadow-elegant"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border-t bg-card mt-auto"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 Memory Management Comparison | Built with React + Tailwind
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
