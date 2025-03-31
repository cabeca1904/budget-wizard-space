
import { DownloadCloud, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { BalanceLineChart } from "@/components/dashboard/BalanceLineChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  exportData,
  importData,
  initializeData,
  FinanceData,
  getTotalsByCategory,
  getTransactionsForDateRange,
  getTotalIncome,
  getTotalExpenses,
  getTotalBalance,
  getAccountById,
  getCategoryById
} from "@/lib/storage";

export function Dashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<FinanceData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<any[]>([]);

  // Initialize data when component mounts
  useEffect(() => {
    const financeData = initializeData();
    setData(financeData);

    // Get transactions from the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const transactions = getTransactionsForDateRange(financeData, startDate, endDate);
    
    // Transform transactions for the RecentTransactions component
    const transformedTransactions = transactions
      .slice(0, 5) // Get only the last 5 transactions
      .map((t) => {
        const account = getAccountById(financeData, t.accountId);
        const category = getCategoryById(financeData, t.categoryId);
        return {
          id: t.id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          date: t.date,
          category: category?.name || "Unknown",
          account: account?.name || "Unknown"
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setRecentTransactions(transformedTransactions);
    
    // Get expense categories
    const expenseTotals = getTotalsByCategory(financeData, transactions, "expense");
    setExpenseCategories(expenseTotals);
    
    // Create balance history data (simplified - in a real app, we'd aggregate by month)
    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    
    const balanceData = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = new Date().getMonth() - i;
      const adjustedMonthIndex = monthIndex < 0 
        ? 12 + monthIndex  // Handle wrapping around to previous year
        : monthIndex;
      
      const month = monthNames[adjustedMonthIndex];
      
      // Generate some sample data - in a real app, we'd calculate from actual transactions
      const income = 3000 + Math.random() * 2000;
      const expenses = 2000 + Math.random() * 1500;
      
      return {
        month,
        income,
        expenses,
        balance: income - expenses
      };
    }).reverse();
    
    setBalanceHistory(balanceData);
    
    // Set budget progress - we're using the categories with budgets
    const budgetData = financeData.categories
      .filter(cat => cat.type === "expense" && cat.budget)
      .map(cat => {
        // Get total spent in this category in the current month
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);
        
        const currentMonthTransactions = getTransactionsForDateRange(
          financeData,
          currentMonthStart,
          new Date()
        );
        
        const spent = currentMonthTransactions
          .filter(t => t.categoryId === cat.id)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          id: cat.id,
          name: cat.name,
          budgeted: cat.budget || 0,
          spent,
          color: cat.color
        };
      });
    
    setBudgetCategories(budgetData);
  }, []);

  const handleExportData = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `financa-pessoal-backup-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dados exportados com sucesso",
        description: "Seu backup foi feito e salvo localmente."
      });
    } catch (error) {
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível exportar seus dados.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const content = event.target?.result as string;
          
          try {
            const success = importData(content);
            
            if (success) {
              setData(initializeData());
              toast({
                title: "Dados importados com sucesso",
                description: "Seus dados foram restaurados."
              });
            } else {
              toast({
                title: "Erro ao importar dados",
                description: "O arquivo não contém dados válidos.",
                variant: "destructive"
              });
            }
          } catch (error) {
            toast({
              title: "Erro ao importar dados",
              description: "Não foi possível processar o arquivo.",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  if (!data) {
    return <div>Carregando...</div>;
  }

  // Fetch balance data from accounts
  const totalBalance = getTotalBalance(data);
  
  // For the last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  const last30DaysTransactions = getTransactionsForDateRange(data, startDate, endDate);
  const totalIncome = getTotalIncome(last30DaysTransactions);
  const totalExpenses = getTotalExpenses(last30DaysTransactions);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-bold">Visão Geral</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleImportData}
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleExportData}
          >
            <DownloadCloud className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCard
          title="Saldo Total"
          amount={totalBalance}
          className="md:col-span-1"
          type="balance"
        />
        <BalanceCard
          title="Receitas (30 dias)"
          amount={totalIncome}
          changePercent={5.2}
          className="md:col-span-1"
          type="income"
        />
        <BalanceCard
          title="Despesas (30 dias)"
          amount={totalExpenses}
          changePercent={-2.5}
          className="md:col-span-1"
          type="expense"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceLineChart data={balanceHistory} />
        <ExpensePieChart data={expenseCategories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTransactions transactions={recentTransactions} />
        <BudgetProgress categories={budgetCategories} />
      </div>
    </div>
  );
}
