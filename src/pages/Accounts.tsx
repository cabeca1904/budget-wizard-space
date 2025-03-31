
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initializeData, FinanceData } from "@/lib/storage";

const Accounts = () => {
  const [data, setData] = useState<FinanceData | null>(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountBalance, setNewAccountBalance] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const financeData = initializeData();
    setData(financeData);
  }, []);

  const handleAddAccount = () => {
    if (!data || !newAccountName || !newAccountBalance) return;
    
    // This is a simplified implementation - in a real app you'd use a proper ID generation method
    const newAccount = {
      id: `account-${Date.now()}`,
      name: newAccountName,
      balance: parseFloat(newAccountBalance) || 0,
      type: "checking",
    };
    
    // Add new account (this is just UI simulation, not actually storing in localStorage)
    setData({
      ...data,
      accounts: [...data.accounts, newAccount],
    });
    
    // Reset form
    setNewAccountName("");
    setNewAccountBalance("");
    setDialogOpen(false);
  };

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Contas</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Nova Conta</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Conta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Conta</Label>
                    <Input
                      id="name"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      placeholder="Ex: Nubank, Conta Corrente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Saldo Inicial</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={newAccountBalance}
                      onChange={(e) => setNewAccountBalance(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddAccount}>
                    Adicionar Conta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {account.type === "checking" ? "Conta Corrente" : 
                     account.type === "savings" ? "Conta Poupança" : 
                     account.type === "investment" ? "Investimento" : "Outra"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Accounts;
