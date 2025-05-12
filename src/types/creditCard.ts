
export interface CreditCard {
  id: string;
  bankName: string;
  cardBrand: "visa" | "mastercard" | "elo" | "american-express" | "other";
  closingDate: number; // Day of month
  dueDate: number; // Day of month
  limit: number;
  currentBill: number;
  color?: string;
}
