
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { EventModal } from "@/components/calendar/EventModal";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { CalendarEvent } from "@/types/calendar";
import { 
  initializeCalendarEvents, 
  getEventsForMonth, 
  getEventsForDay,
  addEvent,
  updateEvent,
  removeEvent,
  filterEventsByText,
  generateRecurringEvents
} from "@/lib/calendarUtils";
import { initializeData, saveData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Inicializar eventos
  useEffect(() => {
    const financeData = initializeData();
    const calendarEvents = initializeCalendarEvents(financeData);
    
    // Recuperar eventos salvos anteriormente
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error("Erro ao carregar eventos do calendário:", e);
        setEvents(calendarEvents);
      }
    } else {
      setEvents(calendarEvents);
    }
  }, []);
  
  // Filtrar eventos
  useEffect(() => {
    // Eventos para o mês atual
    const monthEvents = getEventsForMonth(events, currentDate);
    
    // Gerar eventos recorrentes
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const recurringEvents = generateRecurringEvents(events, startDate, endDate);
    
    // Combinar eventos únicos e recorrentes
    const allEvents = [...monthEvents, ...recurringEvents];
    
    // Aplicar filtro de busca
    const filtered = filterEventsByText(allEvents, searchText);
    setFilteredEvents(filtered);
  }, [events, currentDate, searchText]);
  
  // Salvar eventos
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);
  
  // Funções de navegação
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  // Funções de gerenciamento de eventos
  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = (event: CalendarEvent) => {
    if (selectedEvent) {
      // Atualizar evento existente
      setEvents(updateEvent(events, event));
    } else {
      // Adicionar novo evento
      setEvents(addEvent(events, event));
    }
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(removeEvent(events, eventId));
  };
  
  // Preparar dias do calendário
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { locale: ptBR });
  const endDate = endOfWeek(monthEnd, { locale: ptBR });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Dias da semana
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h1 className="text-3xl font-bold">Calendário Financeiro</h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar eventos..."
                  className="w-full rounded-md pl-8 md:w-[300px]"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              
              <Button onClick={handleAddEvent}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <CalendarHeader
                currentDate={currentDate}
                onPreviousMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
                onToday={goToToday}
              />
              
              <div className="grid grid-cols-7 gap-px">
                {/* Dias da semana */}
                {weekDays.map((day) => (
                  <div key={day} className="text-center p-2 font-semibold text-sm">
                    {day}
                  </div>
                ))}
                
                {/* Dias do mês */}
                {days.map((day) => {
                  const dayEvents = getEventsForDay(filteredEvents, day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <CalendarDay
                      key={day.toString()}
                      date={day}
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday}
                      events={dayEvents}
                      onClick={() => handleDayClick(day)}
                    />
                  );
                })}
              </div>
              
              <CalendarLegend />
            </CardContent>
          </Card>
          
          {/* Modal de evento */}
          <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedDate={selectedDate}
            event={selectedEvent}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Calendar;
