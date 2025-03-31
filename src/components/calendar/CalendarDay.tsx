
import { CalendarEvent } from "@/types/calendar";
import { getEventColor } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

export function CalendarDay({ date, isCurrentMonth, isToday, events, onClick }: CalendarDayProps) {
  // Ordenar eventos por tipo
  const sortedEvents = [...events].sort((a, b) => {
    const typeOrder = { income: 0, invoice: 1, expense: 2, other: 3 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  return (
    <div 
      className={cn(
        "h-full min-h-[100px] border border-border p-1 hover:bg-accent/50 transition-colors cursor-pointer",
        !isCurrentMonth && "bg-muted/50 text-muted-foreground",
        isToday && "ring-2 ring-primary ring-inset"
      )}
      onClick={onClick}
    >
      <div className="flex justify-end">
        <span className={cn(
          "text-sm font-medium",
          isToday && "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
        )}>
          {date.getDate()}
        </span>
      </div>
      
      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="text-xs px-1 py-0.5 rounded truncate"
            style={{ backgroundColor: `${getEventColor(event.type)}20`, borderLeft: `3px solid ${getEventColor(event.type)}` }}
            title={`${event.title} - ${event.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
