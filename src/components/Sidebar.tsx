
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  BarChart4,
  Target,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // If on mobile, always collapse the sidebar
  const isCollapsed = isMobile || collapsed;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Visão Geral",
      href: "#",
      active: true,
    },
    {
      icon: Wallet,
      label: "Contas",
      href: "#accounts",
    },
    {
      icon: CreditCard,
      label: "Transações",
      href: "#transactions",
    },
    {
      icon: BarChart4,
      label: "Categorias",
      href: "#categories",
    },
    {
      icon: Target,
      label: "Metas",
      href: "#goals",
    },
    {
      icon: FileText,
      label: "Relatórios",
      href: "#reports",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "#settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex-shrink-0 bg-sidebar text-sidebar-foreground border-r h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[250px]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b">
        {!isCollapsed && (
          <div className="font-bold text-lg text-sidebar-primary">FinançasPRO</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  item.active
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground"
                )}
              />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        {!isCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="flex w-full items-center justify-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nova Transação</span>
          </Button>
        )}
        {isCollapsed && (
          <Button variant="outline" size="icon" className="w-full">
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <ThemeToggle />
        {!isCollapsed && (
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
