
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
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 h-10">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Settings;
