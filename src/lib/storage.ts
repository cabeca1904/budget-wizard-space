
// Types for our finance data
export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit" | "investment" | "wallet";
  balance: number;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon?: string;
  budget?: number;
}

export interface Transaction {
  id: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  isRecurring?: boolean;
  isFixed?: boolean;
  notes?: string;
  attachmentUrl?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

// Shape of our entire financial data
export interface FinanceData {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  goals: Goal[];
  lastUpdated: string;
}

// Initial default data
const defaultData: FinanceData = {
  accounts: [
    {
      id: "acc1",
      name: "Conta Corrente",
      type: "checking",
      balance: 5230.45,
      color: "#6366f1"
    },
    {
      id: "acc2",
      name: "Poupança",
      type: "savings",
      balance: 12450.82,
      color: "#8b5cf6"
    },
    {
      id: "acc3",
      name: "Cartão de Crédito",
      type: "credit",
      balance: -1540.30,
      color: "#f43f5e"
    },
    {
      id: "acc4",
      name: "Carteira",
      type: "wallet",
      balance: 250.00,
      color: "#10b981"
    }
  ],
  categories: [
    { id: "cat1", name: "Salário", type: "income", color: "#10b981" },
    { id: "cat2", name: "Investimentos", type: "income", color: "#8b5cf6" },
    { id: "cat3", name: "Alimentação", type: "expense", color: "#f43f5e", budget: 800 },
    { id: "cat4", name: "Transporte", type: "expense", color: "#fb923c", budget: 400 },
    { id: "cat5", name: "Moradia", type: "expense", color: "#6366f1", budget: 1200 },
    { id: "cat6", name: "Lazer", type: "expense", color: "#ec4899", budget: 500 },
    { id: "cat7", name: "Saúde", type: "expense", color: "#14b8a6", budget: 300 },
    { id: "cat8", name: "Educação", type: "expense", color: "#f59e0b", budget: 700 }
  ],
  transactions: [
    {
      id: "t1",
      date: "2023-07-05",
      accountId: "acc1",
      categoryId: "cat1",
      description: "Salário Julho",
      amount: 5000,
      type: "income"
    },
    {
      id: "t2",
      date: "2023-07-10",
      accountId: "acc3",
      categoryId: "cat3",
      description: "Supermercado",
      amount: 350.45,
      type: "expense"
    },
    {
      id: "t3",
      date: "2023-07-12",
      accountId: "acc3",
      categoryId: "cat6",
      description: "Cinema",
      amount: 80.90,
      type: "expense"
    },
    {
      id: "t4",
      date: "2023-07-15",
      accountId: "acc1",
      categoryId: "cat5",
      description: "Aluguel",
      amount: 1200,
      type: "expense"
    },
    {
      id: "t5",
      date: "2023-07-20",
      accountId: "acc1",
      categoryId: "cat2",
      description: "Dividendos",
      amount: 120.50,
      type: "income"
    },
    {
      id: "t6",
      date: "2023-07-22",
      accountId: "acc3",
      categoryId: "cat4",
      description: "Combustível",
      amount: 200.30,
      type: "expense"
    },
    {
      id: "t7",
      date: "2023-07-25",
      accountId: "acc3",
      categoryId: "cat7",
      description: "Farmácia",
      amount: 85.75,
      type: "expense"
    },
    {
      id: "t8",
      date: "2023-07-27",
      accountId: "acc1",
      categoryId: "cat8",
      description: "Curso Online",
      amount: 450,
      type: "expense"
    }
  ],
  goals: [
    {
      id: "g1",
      name: "Viagem para a Europa",
      targetAmount: 15000,
      currentAmount: 5600,
      deadline: "2024-07-01",
      color: "#6366f1"
    },
    {
      id: "g2",
      name: "Comprar um Carro",
      targetAmount: 30000,
      currentAmount: 12000,
      deadline: "2024-12-01",
      color: "#8b5cf6"
    },
    {
      id: "g3",
      name: "Fundo de Emergência",
      targetAmount: 20000,
      currentAmount: 7500,
      deadline: "2023-12-31",
      color: "#10b981"
    }
  ],
  lastUpdated: new Date().toISOString()
};

const STORAGE_KEY = "finance-personal-data";

// Function to initialize data (load from localStorage or use default)
export function initializeData(): FinanceData {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // No data found, save and return default data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  } catch (error) {
    console.error("Error initializing data:", error);
    return defaultData;
  }
}

// Function to save data to localStorage
export function saveData(data: FinanceData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Helper functions to work with specific data types
export function getTransactionsForDateRange(
  data: FinanceData,
  startDate: Date,
  endDate: Date
): Transaction[] {
  return data.transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

export function getTotalsByCategory(
  data: FinanceData,
  transactions: Transaction[],
  type: "income" | "expense"
): { id: string; name: string; value: number; color: string }[] {
  const filteredTransactions = transactions.filter((t) => t.type === type);
  
  const totals: Record<string, number> = {};
  
  // Calculate totals by category
  filteredTransactions.forEach((t) => {
    if (!totals[t.categoryId]) {
      totals[t.categoryId] = 0;
    }
    totals[t.categoryId] += t.amount;
  });
  
  // Map to the required format
  return Object.entries(totals).map(([categoryId, value]) => {
    const category = data.categories.find((c) => c.id === categoryId);
    return {
      id: categoryId,
      name: category?.name || "Unknown",
      value,
      color: category?.color || "#888888"
    };
  });
}

export function getAccountById(data: FinanceData, id: string): Account | undefined {
  return data.accounts.find((a) => a.id === id);
}

export function getCategoryById(data: FinanceData, id: string): Category | undefined {
  return data.categories.find((c) => c.id === id);
}

// Calculate total balance across all accounts
export function getTotalBalance(data: FinanceData): number {
  return data.accounts.reduce((sum, account) => sum + account.balance, 0);
}

// Calculate total income for a date range
export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate total expenses for a date range
export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Function to export data as JSON
export function exportData(): string {
  const data = localStorage.getItem(STORAGE_KEY) || "{}";
  return data;
}

// Function to import data from JSON
export function importData(jsonData: string): boolean {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Basic validation that it's our data format
    if (!parsedData.accounts || !parsedData.categories || !parsedData.transactions) {
      throw new Error("Invalid data format");
    }
    
    localStorage.setItem(STORAGE_KEY, jsonData);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}
