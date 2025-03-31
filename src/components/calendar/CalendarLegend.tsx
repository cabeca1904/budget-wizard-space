
import { getEventColor } from "@/lib/calendarUtils";

export function CalendarLegend() {
  const legendItems = [
    { type: "income", label: "Receitas" },
    { type: "expense", label: "Despesas" },
    { type: "invoice", label: "Faturas" },
    { type: "other", label: "Outros" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {legendItems.map((item) => (
        <div key={item.type} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: getEventColor(item.type) }}
          />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
