
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  Line,
  Pie,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartProps {
  data: any[];
  index: string;
  className?: string;
  valueFormatter?: (value: number) => string;
}

interface BarLineChartProps extends ChartProps {
  categories: string[];
  colors?: string[];
}

interface PieChartProps extends ChartProps {
  category: string;
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ['#4ade80', '#f87171', '#60a5fa', '#c084fc', '#fbbf24'],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarLineChartProps) => {
  return (
    <ChartContainer className={cn('w-full h-full', className)} config={{}}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={(value) => valueFormatter(value)} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-right text-sm"></div>
                    {payload.map((entry, index) => (
                      <React.Fragment key={`item-${index}`}>
                        <div className="flex items-center gap-1">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {entry.name}
                          </span>
                        </div>
                        <div className="text-right font-medium text-sm">
                          {valueFormatter(entry.value as number)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const LineChart = ({
  data,
  index,
  categories,
  colors = ['#4ade80', '#f87171', '#60a5fa', '#c084fc', '#fbbf24'],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarLineChartProps) => {
  return (
    <ChartContainer className={cn('w-full h-full', className)} config={{}}>
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={(value) => valueFormatter(value)} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-right text-sm"></div>
                    {payload.map((entry, index) => (
                      <React.Fragment key={`item-${index}`}>
                        <div className="flex items-center gap-1">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {entry.name}
                          </span>
                        </div>
                        <div className="text-right font-medium text-sm">
                          {valueFormatter(entry.value as number)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export const PieChart = ({
  data,
  index,
  category,
  valueFormatter = (value: number) => `${value}`,
  className,
}: PieChartProps) => {
  return (
    <ChartContainer className={cn('w-full h-full', className)} config={{}}>
      <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <Pie
          dataKey={category}
          nameKey={index}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 40}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0];
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold text-sm">{data.name}</div>
                    <div className="text-right font-medium text-sm">
                      {valueFormatter(data.value as number)}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ChartContainer>
  );
};
