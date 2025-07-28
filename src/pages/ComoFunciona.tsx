import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, RefreshCw } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Escolha o Equipamento",
    description: "Navegue pelos equipamentos disponíveis e selecione o que precisa",
    icon: <FileText className="h-8 w-8 text-primary" />,
    details: ["Visualize todos os equipamentos", "Verifique disponibilidade", "Leia as especificações"]
  },
  {
    id: 2,
    title: "Faça sua Solicitação",
    description: "Preencha o formulário de empréstimo com seus dados",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    details: ["Documento de identificação", "Dados de contato", "Tempo de uso estimado"]
  },
  {
    id: 3,
    title: "Retire o Equipamento",
    description: "Dirija-se ao balcão de atendimento para retirar",
    icon: <Clock className="h-8 w-8 text-primary" />,
    details: ["Apresente documento", "Confirme os dados", "Receba o equipamento"]
  },
  {
    id: 4,
    title: "Devolva no Prazo",
    description: "Retorne o equipamento no prazo combinado",
    icon: <RefreshCw className="h-8 w-8 text-primary" />,
    details: ["Respeite o horário", "Equipamento em bom estado", "Confirme a devolução"]
  }
];

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Como Funciona
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Processo simples e rápido para empréstimo de equipamentos no shopping
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={step.id} className="relative text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <Badge variant="outline" className="absolute top-4 right-4">
                  Passo {step.id}
                </Badge>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Regras Importantes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Documentação Necessária</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Documento de identificação com foto</li>
                <li>• Comprovante de contato (telefone ou email)</li>
                <li>• Maior de 18 anos ou acompanhado de responsável</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Condições de Uso</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Uso exclusivo dentro do shopping</li>
                <li>• Responsabilidade por danos ou perda</li>
                <li>• Devolução obrigatória no prazo</li>
                <li>• Equipamento deve estar em bom estado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;