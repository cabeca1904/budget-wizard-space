
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
  account: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    transaction.type === "income"
                      ? "bg-finance-positive/10 text-finance-positive"
                      : "bg-finance-negative/10 text-finance-negative"
                  )}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpCircle className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{formatDate(transaction.date)}</span> •{" "}
                    <span>{transaction.account}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "font-medium",
                    transaction.type === "income"
                      ? "text-finance-positive"
                      : "text-finance-negative"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
