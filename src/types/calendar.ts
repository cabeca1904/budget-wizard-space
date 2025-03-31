
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO format YYYY-MM-DD
  type: "income" | "expense" | "invoice" | "other";
  amount: number;
  description?: string;
  recurrence?: "once" | "weekly" | "monthly" | "yearly";
  categoryId?: string;
  accountId?: string;
  completed?: boolean;
}
