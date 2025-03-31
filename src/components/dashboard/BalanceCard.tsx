
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface BalanceCardProps {
  title: string;
  amount: number;
  changePercent?: number;
  className?: string;
  type?: "balance" | "income" | "expense";
}

export function BalanceCard({
  title,
  amount,
  changePercent,
  className,
  type = "balance",
}: BalanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const isPositive = changePercent && changePercent > 0;
  const isNegative = changePercent && changePercent < 0;

  const icons = {
    balance: DollarSign,
    income: TrendingUp,
    expense: TrendingDown,
  };

  const Icon = icons[type];

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={cn(
            "h-4 w-4",
            type === "income" && "text-finance-positive",
            type === "expense" && "text-finance-negative"
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(amount)}
        </div>
        {changePercent !== undefined && (
          <p
            className={cn(
              "text-xs text-muted-foreground flex items-center gap-1 mt-1",
              isPositive && "text-finance-positive",
              isNegative && "text-finance-negative"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            <span>
              {isPositive && "+"}
              {changePercent.toFixed(1)}% desde o mês passado
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
