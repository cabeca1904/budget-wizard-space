import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  CreditCard as CreditCardIcon, 
  PlusCircle, 
  Edit, 
  Trash2,
  CreditCard as CardIcon,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { CreditCard, FinanceData, initializeData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sidebar } from "@/components/Sidebar";
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

// Esquema de validação para o cartão de crédito
const creditCardSchema = z.object({
  bankName: z.string().min(2, "Nome do banco é obrigatório"),
  cardBrand: z.enum(["visa", "mastercard", "elo", "american-express", "other"], {
    required_error: "Selecione uma bandeira de cartão",
  }),
  closingDate: z.coerce.number().min(1).max(31, "Dia inválido"),
  dueDate: z.coerce.number().min(1).max(31, "Dia inválido"),
  limit: z.coerce.number().min(0, "Limite deve ser positivo"),
  currentBill: z.coerce.number().default(0),
  color: z.string().default("#6366f1"),
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

export default function CreditCards() {
  const [data, setData] = useState<FinanceData>({
    accounts: [],
    categories: [],
    transactions: [],
    goals: [],
    creditCards: [],
    lastUpdated: new Date().toISOString()
  });
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [isNewCard, setIsNewCard] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadedData = initializeData();
    setData(loadedData);
  }, []);

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      bankName: "",
      cardBrand: "visa",
      closingDate: 1,
      dueDate: 10,
      limit: 1000,
      currentBill: 0,
      color: "#6366f1",
    },
  });

  const onSubmit = (values: CreditCardFormValues) => {
    const updatedData = { ...data };
    
    if (isNewCard) {
      const newCard: CreditCard = {
        id: uuidv4(),
        bankName: values.bankName,
        cardBrand: values.cardBrand,
        closingDate: values.closingDate,
        dueDate: values.dueDate,
        limit: values.limit,
        currentBill: values.currentBill,
        color: values.color,
      };
      updatedData.creditCards.push(newCard);
      toast({
        title: "Cartão adicionado",
        description: `Cartão ${newCard.bankName} foi adicionado com sucesso.`,
      });
    } else if (selectedCard) {
      const index = updatedData.creditCards.findIndex(card => card.id === selectedCard.id);
      if (index !== -1) {
        updatedData.creditCards[index] = {
          ...selectedCard,
          ...values,
        };
        toast({
          title: "Cartão atualizado",
          description: `Cartão ${values.bankName} foi atualizado com sucesso.`,
        });
      }
    }
    
    saveData(updatedData);
    setData(updatedData);
    setIsFormDialogOpen(false);
  };

  const handleUpdateBill = (card: CreditCard, newValue: number) => {
    const updatedData = { ...data };
    const index = updatedData.creditCards.findIndex(c => c.id === card.id);
    
    if (index !== -1) {
      updatedData.creditCards[index] = {
        ...card,
        currentBill: newValue,
      };
      
      saveData(updatedData);
      setData(updatedData);
      
      toast({
        title: "Fatura atualizada",
        description: `Fatura do cartão ${card.bankName} foi atualizada para R$ ${newValue.toFixed(2)}.`,
      });
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      const updatedData = { ...data };
      updatedData.creditCards = updatedData.creditCards.filter(
        (card) => card.id !== selectedCard.id
      );
      
      saveData(updatedData);
      setData(updatedData);
      
      toast({
        title: "Cartão excluído",
        description: `Cartão ${selectedCard.bankName} foi excluído com sucesso.`,
      });
      
      setIsDeleteDialogOpen(false);
    }
  };

  const openNewCardDialog = () => {
    form.reset({
      bankName: "",
      cardBrand: "visa",
      closingDate: 1,
      dueDate: 10,
      limit: 1000,
      currentBill: 0,
      color: "#6366f1",
    });
    setSelectedCard(null);
    setIsNewCard(true);
    setIsFormDialogOpen(true);
  };

  const openEditCardDialog = (card: CreditCard) => {
    form.reset({
      bankName: card.bankName,
      cardBrand: card.cardBrand,
      closingDate: card.closingDate,
      dueDate: card.dueDate,
      limit: card.limit,
      currentBill: card.currentBill,
      color: card.color || "#6366f1",
    });
    setSelectedCard(card);
    setIsNewCard(false);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (card: CreditCard) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  const getBrandIcon = (brand: CreditCard["cardBrand"]) => {
    // Use CardIcon for all card brands since we don't have specific icons
    return <CardIcon className="h-6 w-6" />;
  };

  const formatDay = (day: number) => {
    return day < 10 ? `0${day}` : `${day}`;
  };

  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Cartões de Crédito</h1>
          <Button onClick={openNewCardDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        </div>

        {data.creditCards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Nenhum cartão cadastrado</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione seu primeiro cartão de crédito para começar a gerenciar suas faturas.
            </p>
            <Button className="mt-4" onClick={openNewCardDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar cartão
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.creditCards.map((card) => {
              const isClosingSoon = currentDay >= card.closingDate - 3 && currentDay < card.closingDate;
              const isDueSoon = currentDay >= card.dueDate - 3 && currentDay < card.dueDate;
              
              return (
                <Card key={card.id} className="overflow-hidden shadow-md border-t-4" style={{ borderTopColor: card.color || "#6366f1" }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-8 w-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: card.color || "#6366f1" }}
                        >
                          {getBrandIcon(card.cardBrand)}
                        </div>
                        <CardTitle>{card.bankName}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditCardDialog(card)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(card)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {card.cardBrand.charAt(0).toUpperCase() + card.cardBrand.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fatura atual:</span>
                        <span className="font-semibold text-lg">
                          R$ {card.currentBill.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Fechamento:</span>
                          <span className={`text-sm font-medium ${isClosingSoon ? "text-red-500" : ""}`}>
                            Dia {formatDay(card.closingDate)}
                          </span>
                          {isClosingSoon && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Vencimento:</span>
                          <span className={`text-sm font-medium ${isDueSoon ? "text-red-500" : ""}`}>
                            Dia {formatDay(card.dueDate)}
                          </span>
                          {isDueSoon && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Limite: R$ {card.limit.toFixed(2)}</span>
                        <div className="w-full max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${card.currentBill / card.limit > 0.8 ? "bg-red-500" : "bg-green-500"}`} 
                            style={{ width: `${Math.min(100, (card.currentBill / card.limit * 100))}%` }}
                          />
                        </div>
                        <span className="text-xs ml-2">
                          {Math.round((card.currentBill / card.limit) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="w-full">
                      <Label htmlFor={`update-bill-${card.id}`} className="text-xs mb-1 block">
                        Atualizar valor da fatura
                      </Label>
                      <div className="flex gap-2">
                        <Input 
                          id={`update-bill-${card.id}`}
                          type="number" 
                          placeholder="Novo valor" 
                          defaultValue={card.currentBill}
                          className="text-sm"
                        />
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            const input = document.getElementById(`update-bill-${card.id}`) as HTMLInputElement;
                            const value = parseFloat(input.value);
                            if (!isNaN(value)) {
                              handleUpdateBill(card, value);
                            }
                          }}
                        >
                          Atualizar
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNewCard ? "Adicionar novo cartão" : "Editar cartão"}</DialogTitle>
            <DialogDescription>
              {isNewCard 
                ? "Preencha os detalhes do novo cartão de crédito." 
                : "Atualize os detalhes do cartão de crédito."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do banco</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Nubank, Itaú, Santander..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bandeira</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="elo">Elo</option>
                        <option value="american-express">American Express</option>
                        <option value="other">Outra</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de fechamento</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Dia do mês em que a fatura fecha
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia de vencimento</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Dia do mês para pagamento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentBill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fatura atual</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do cartão</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          {...field} 
                          className="w-10 h-10 border rounded p-1"
                        />
                        <Input {...field} className="flex-1" />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Cor para identificação rápida do cartão
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isNewCard ? "Adicionar" : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir cartão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cartão {selectedCard?.bankName}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCard}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
