
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BalanceData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface BalanceLineChartProps {
  data: BalanceData[];
}

export function BalanceLineChart({ data }: BalanceLineChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-muted-foreground"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>Evolução Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              name="Receitas"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              name="Despesas"
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              name="Saldo"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
