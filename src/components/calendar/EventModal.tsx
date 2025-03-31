
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({ isOpen, onClose, selectedDate, event, onSave, onDelete }: EventModalProps) {
  const { toast } = useToast();
  const isNewEvent = !event;
  const [date, setDate] = useState<Date | undefined>(
    selectedDate || (event ? new Date(event.date) : new Date())
  );
  const [title, setTitle] = useState(event?.title || "");
  const [amount, setAmount] = useState(event?.amount.toString() || "");
  const [type, setType] = useState<CalendarEvent["type"]>(event?.type || "expense");
  const [description, setDescription] = useState(event?.description || "");
  const [recurrence, setRecurrence] = useState<CalendarEvent["recurrence"]>(event?.recurrence || "once");

  useEffect(() => {
    if (isOpen) {
      setDate(selectedDate || (event ? new Date(event.date) : new Date()));
      setTitle(event?.title || "");
      setAmount(event?.amount.toString() || "");
      setType(event?.type || "expense");
      setDescription(event?.description || "");
      setRecurrence(event?.recurrence || "once");
    }
  }, [isOpen, event, selectedDate]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe um título para o evento",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive",
      });
      return;
    }

    const newEvent: CalendarEvent = {
      id: event?.id || `event-${Date.now()}`,
      title,
      date: format(date, 'yyyy-MM-dd'),
      type,
      amount: Number(amount),
      description,
      recurrence,
      categoryId: event?.categoryId,
      accountId: event?.accountId,
      completed: event?.completed || false,
    };

    onSave(newEvent);
    onClose();
    
    toast({
      title: isNewEvent ? "Evento criado" : "Evento atualizado",
      description: `${title} foi ${isNewEvent ? "adicionado" : "atualizado"} com sucesso.`,
    });
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
      
      toast({
        title: "Evento excluído",
        description: `${title} foi removido com sucesso.`,
      });
    }
  };

  const getTypeLabel = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "income":
        return "Receita";
      case "expense":
        return "Despesa";
      case "invoice":
        return "Fatura";
      case "other":
        return "Outro";
      default:
        return "Selecione";
    }
  };

  const getRecurrenceLabel = (recurrence: CalendarEvent["recurrence"]) => {
    switch (recurrence) {
      case "once":
        return "Único";
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensal";
      case "yearly":
        return "Anual";
      default:
        return "Selecione";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNewEvent ? "Adicionar Evento" : "Editar Evento"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Data</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Valor</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as CalendarEvent["type"])}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="invoice">Fatura</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurrence" className="text-right">Recorrência</Label>
            <Select value={recurrence || "once"} onValueChange={(value) => setRecurrence(value as CalendarEvent["recurrence"])}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a recorrência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Único</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right align-top pt-2">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {!isNewEvent && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
