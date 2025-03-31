
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth, 
  onToday 
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToday}
        >
          Hoje
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
