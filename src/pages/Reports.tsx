
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { initializeData, FinanceData, getTotalsByCategory } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Reports = () => {
  const { toast } = useToast();
  const [data, setData] = useState<FinanceData | null>(null);
  const [activeTab, setActiveTab] = useState("monthly");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  useEffect(() => {
    const financeData = initializeData();
    setData(financeData);
  }, []);

  const handleDownloadReport = (format: string) => {
    toast({
      title: "Relatório sendo gerado",
      description: `Seu relatório em formato ${format.toUpperCase()} será baixado em breve.`,
    });
    
    // This would be the actual download implementation in a real app
    setTimeout(() => {
      toast({
        title: "Relatório pronto",
        description: "Seu relatório foi gerado com sucesso.",
      });
    }, 1500);
  };

  const handleSendReport = () => {
    toast({
      title: "Relatório sendo enviado",
      description: "Enviando relatório para miglourenco19@gmail.com",
    });
    
    // This would be the actual email sending implementation in a real app
    setTimeout(() => {
      toast({
        title: "Relatório enviado",
        description: "Seu relatório foi enviado com sucesso para seu email.",
      });
    }, 2000);
  };

  // Generate some mock data for reports based on the selected date range
  const generateReportData = () => {
    if (!data) return null;
    
    // This would fetch actual data based on date ranges in a real app
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentMonth = new Date().getMonth();
    
    const incomeData = months.slice(0, 6).map((month, index) => ({
      name: month,
      Receitas: 2000 + Math.random() * 3000,
      Despesas: 1500 + Math.random() * 1500,
    })).reverse();
    
    const categoryData = getTotalsByCategory(data, data.transactions, "expense")
      .map(cat => ({
        name: cat.name,
        value: cat.value,
        color: cat.color,
      }));
    
    return {
      income: incomeData,
      categories: categoryData,
    };
  };

  const reportData = generateReportData();

  if (!data || !reportData) {
    return <div>Carregando...</div>;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start w-full sm:w-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  {/* This is a placeholder - in a real app you'd use a calendar component */}
                  <div className="p-4">
                    <p className="text-center mb-2">Seletor de datas</p>
                    <Button onClick={() => setDateRange({ 
                      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                      to: new Date()
                    })}>Este mês</Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => handleDownloadReport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => handleDownloadReport("xlsx")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-initial" onClick={handleSendReport}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-3 h-10">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="category">Categorias</TabsTrigger>
              <TabsTrigger value="trend">Tendências</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo Mensal</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <BarChart 
                      data={reportData.income}
                      index="name"
                      categories={["Receitas", "Despesas"]}
                      colors={["#4ade80", "#f87171"]}
                      valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      className="w-full h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Despesas por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <PieChart 
                      data={reportData.categories}
                      index="name"
                      category="value"
                      valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      className="w-full h-full"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhamento por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.categories.map((cat, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color || `hsl(${index * 40}, 70%, 50%)` }}
                            />
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-medium">
                            R$ {cat.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="trend" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendência de Gastos e Receitas</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <LineChart 
                      data={reportData.income}
                      index="name"
                      categories={["Receitas", "Despesas"]}
                      colors={["#4ade80", "#f87171"]}
                      valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      className="w-full h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Reports;
