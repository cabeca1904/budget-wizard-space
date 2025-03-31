
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface BudgetProgressProps {
  categories: BudgetCategory[];
}

export function BudgetProgress({ categories }: BudgetProgressProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage < 70) return "bg-finance-positive";
    if (percentage < 90) return "bg-amber-500";
    return "bg-finance-negative";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçamento Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const percentage = Math.min(
              Math.round((category.spent / category.budgeted) * 100),
              100
            );
            return (
              <div key={category.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span>
                    {formatCurrency(category.spent)} de{" "}
                    {formatCurrency(category.budgeted)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={cn(
                    getProgressColor(category.spent, category.budgeted)
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage}% usado</span>
                  <span>
                    {category.spent <= category.budgeted
                      ? `Restam ${formatCurrency(
                          category.budgeted - category.spent
                        )}`
                      : `Excedido em ${formatCurrency(
                          category.spent - category.budgeted
                        )}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
