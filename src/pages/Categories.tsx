
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { initializeData, FinanceData } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Categories = () => {
  const [data, setData] = useState<FinanceData | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("expense");
  const [newCategoryBudget, setNewCategoryBudget] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6b7280");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Para edição de categoria
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryType, setEditCategoryType] = useState<"expense" | "income">("expense");
  const [editCategoryBudget, setEditCategoryBudget] = useState("");
  const [editCategoryColor, setEditCategoryColor] = useState("");

  useEffect(() => {
    const financeData = initializeData();
    setData(financeData);
  }, []);

  const handleAddCategory = () => {
    if (!data || !newCategoryName) return;
    
    const newCategory = {
      id: `category-${Date.now()}`,
      name: newCategoryName,
      type: newCategoryType as "income" | "expense",
      budget: newCategoryBudget ? parseFloat(newCategoryBudget) : undefined,
      color: newCategoryColor,
    };
    
    // Add new category (UI simulation)
    setData({
      ...data,
      categories: [...data.categories, newCategory],
    });
    
    // Reset form
    setNewCategoryName("");
    setNewCategoryType("expense");
    setNewCategoryBudget("");
    setNewCategoryColor("#6b7280");
    setDialogOpen(false);
  };
  
  const handleEditClick = (category: any) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryType(category.type);
    setEditCategoryBudget(category.budget ? category.budget.toString() : "");
    setEditCategoryColor(category.color);
    setEditDialogOpen(true);
  };
  
  const handleUpdateCategory = () => {
    if (!data || !editingCategory || !editCategoryName) return;
    
    const updatedCategory = {
      ...editingCategory,
      name: editCategoryName,
      type: editCategoryType,
      budget: editCategoryBudget ? parseFloat(editCategoryBudget) : undefined,
      color: editCategoryColor,
    };
    
    // Update category in the data
    const updatedCategories = data.categories.map(cat => 
      cat.id === editingCategory.id ? updatedCategory : cat
    );
    
    setData({
      ...data,
      categories: updatedCategories,
    });
    
    // Reset form and close dialog
    setEditingCategory(null);
    setEditDialogOpen(false);
  };

  const filteredCategories = (type: string) => {
    if (!data) return [];
    
    if (type === "all") {
      return data.categories;
    }
    
    return data.categories.filter(cat => cat.type === type);
  };

  if (!data) {
    return <div>Carregando...</div>;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Categorias</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Nova Categoria</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ex: Alimentação, Transporte"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newCategoryType}
                      onValueChange={setNewCategoryType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Despesa</SelectItem>
                        <SelectItem value="income">Receita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newCategoryType === "expense" && (
                    <div className="space-y-2">
                      <Label htmlFor="budget">Orçamento Mensal (opcional)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newCategoryBudget}
                        onChange={(e) => setNewCategoryBudget(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="w-10 h-10 p-1 rounded-full cursor-pointer"
                      />
                      <Input
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddCategory}>
                    Adicionar Categoria
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dialog para edição de categoria */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Categoria</Label>
                  <Input
                    id="edit-name"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="Ex: Alimentação, Transporte"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={editCategoryType}
                    onValueChange={(value) => setEditCategoryType(value as "expense" | "income")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editCategoryType === "expense" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-budget">Orçamento Mensal (opcional)</Label>
                    <Input
                      id="edit-budget"
                      type="number"
                      value={editCategoryBudget}
                      onChange={(e) => setEditCategoryBudget(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Cor</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-color"
                      type="color"
                      value={editCategoryColor}
                      onChange={(e) => setEditCategoryColor(e.target.value)}
                      className="w-10 h-10 p-1 rounded-full cursor-pointer"
                    />
                    <Input
                      value={editCategoryColor}
                      onChange={(e) => setEditCategoryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button className="w-full" onClick={handleUpdateCategory}>
                  Atualizar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 h-10">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories("all").map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onEdit={handleEditClick} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="expense" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories("expense").map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onEdit={handleEditClick} 
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories("income").map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onEdit={handleEditClick} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

// Helper component for category cards
const CategoryCard = ({ category, onEdit }: { category: any, onEdit: (category: any) => void }) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: category.color }}
          />
          <CardTitle className="text-lg">{category.name}</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {category.type === "expense" ? "Despesa" : "Receita"}
          </span>
          {category.budget && (
            <span className="text-sm font-medium">
              Orçamento: R$ {category.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Categories;
