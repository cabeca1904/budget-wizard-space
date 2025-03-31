
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("miglourenco19@gmail.com");
  const [autoReport, setAutoReport] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  const handleExportData = () => {
    setExportLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setExportLoading(false);
      toast({
        title: "Dados exportados com sucesso",
        description: "Seu backup foi realizado com sucesso."
      });
    }, 1000);
  };
  
  const handleImportData = () => {
    // Trigger file input click
    const fileInput = document.getElementById("import-file");
    if (fileInput) {
      fileInput.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setImportLoading(true);
    
    // Simulate import process
    setTimeout(() => {
      setImportLoading(false);
      toast({
        title: "Dados importados com sucesso",
        description: "Seus dados foram restaurados com sucesso."
      });
    }, 1500);
  };
  
  const handleSaveEmail = () => {
    toast({
      title: "Email salvo",
      description: "Seus relatórios serão enviados para " + email
    });
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Configurações</h1>
          
          <Tabs defaultValue="general">
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-3 h-10">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="data">Dados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Aparência</CardTitle>
                    <CardDescription>Personalize a aparência do aplicativo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="theme">Tema Escuro</Label>
                        <p className="text-sm text-muted-foreground">
                          Alterne entre o tema claro e escuro
                        </p>
                      </div>
                      <Switch 
                        id="theme" 
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="grid gap-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Envio de Relatórios</CardTitle>
                    <CardDescription>Configure o envio automático de relatórios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-report">Relatórios Automáticos</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar relatório mensal automaticamente
                        </p>
                      </div>
                      <Switch 
                        id="auto-report" 
                        checked={autoReport}
                        onCheckedChange={setAutoReport}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email para Relatórios</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="flex-1"
                        />
                        <Button onClick={handleSaveEmail}>Salvar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="data">
              <div className="grid gap-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup e Sincronização</CardTitle>
                    <CardDescription>Exporte e importe seus dados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        onClick={handleExportData}
                        disabled={exportLoading}
                        className="w-full"
                      >
                        {exportLoading ? "Exportando..." : "Exportar Dados"}
                      </Button>
                      
                      <Button 
                        onClick={handleImportData}
                        disabled={importLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {importLoading ? "Importando..." : "Importar Dados"}
                      </Button>
                      <Input 
                        id="import-file" 
                        type="file" 
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Os dados são armazenados localmente em seu navegador.</p>
                      <p className="mt-1">
                        Exporte regularmente para evitar perda de dados ao limpar o cache do navegador.
                      </p>
                    </div>
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

export default Settings;
