
import { FinanceData } from "./storage";
import { CalendarEvent } from "@/types/calendar";
import { format, isSameDay, isSameMonth, addMonths, addWeeks, addYears } from "date-fns";

// Inicializa eventos do calendário a partir de transações
export function initializeCalendarEvents(data: FinanceData): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  // Converter transações existentes em eventos de calendário
  data.transactions.forEach(transaction => {
    const type = transaction.type === "income" ? "income" : "expense";
    
    events.push({
      id: `event-${transaction.id}`,
      title: transaction.description,
      date: transaction.date,
      type,
      amount: transaction.amount,
      description: transaction.notes || "",
      categoryId: transaction.categoryId,
      accountId: transaction.accountId,
      recurrence: transaction.isRecurring ? "monthly" : "once",
      completed: true, // Transações passadas são consideradas completadas
    });
  });
  
  return events;
}

// Obter eventos para um mês específico
export function getEventsForMonth(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return isSameMonth(eventDate, date);
  });
}

// Obter eventos para um dia específico
export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return isSameDay(eventDate, date);
  });
}

// Adicionar evento ao calendário
export function addEvent(events: CalendarEvent[], event: CalendarEvent): CalendarEvent[] {
  return [...events, event];
}

// Atualizar evento do calendário
export function updateEvent(events: CalendarEvent[], updatedEvent: CalendarEvent): CalendarEvent[] {
  return events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
}

// Remover evento do calendário
export function removeEvent(events: CalendarEvent[], eventId: string): CalendarEvent[] {
  return events.filter(event => event.id !== eventId);
}

// Gerar próximas ocorrências de eventos recorrentes
export function generateRecurringEvents(events: CalendarEvent[], 
                                        startDate: Date, 
                                        endDate: Date): CalendarEvent[] {
  const generatedEvents: CalendarEvent[] = [];
  
  events.forEach(event => {
    if (!event.recurrence || event.recurrence === "once") {
      return;
    }
    
    const eventDate = new Date(event.date);
    let currentDate = new Date(eventDate);
    
    while (currentDate <= endDate) {
      if (currentDate >= startDate) {
        generatedEvents.push({
          ...event,
          id: `${event.id}-${format(currentDate, 'yyyy-MM-dd')}`,
          date: format(currentDate, 'yyyy-MM-dd'),
          completed: false
        });
      }
      
      // Avançar para a próxima ocorrência com base na recorrência
      switch (event.recurrence) {
        case "weekly":
          currentDate = addWeeks(currentDate, 1);
          break;
        case "monthly":
          currentDate = addMonths(currentDate, 1);
          break;
        case "yearly":
          currentDate = addYears(currentDate, 1);
          break;
        default:
          currentDate = new Date(endDate.getTime() + 1);
      }
    }
  });
  
  return generatedEvents;
}

// Filtrar eventos por texto de busca
export function filterEventsByText(events: CalendarEvent[], searchText: string): CalendarEvent[] {
  if (!searchText.trim()) {
    return events;
  }
  
  const searchLower = searchText.toLowerCase();
  
  return events.filter(event => 
    event.title.toLowerCase().includes(searchLower) ||
    (event.description && event.description.toLowerCase().includes(searchLower)) ||
    event.amount.toString().includes(searchLower) ||
    event.type.toLowerCase().includes(searchLower)
  );
}

// Obter cor com base no tipo de evento
export function getEventColor(type: CalendarEvent['type']): string {
  switch (type) {
    case "income":
      return "#10b981"; // verde
    case "expense":
      return "#f43f5e"; // vermelho
    case "invoice":
      return "#8b5cf6"; // roxo
    case "other":
      return "#8E9196"; // cinza
    default:
      return "#64748b"; // cinza azulado
  }
}
