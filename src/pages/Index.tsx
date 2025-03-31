
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
