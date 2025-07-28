import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Wrench } from "lucide-react";

const equipmentData = [
  {
    id: 1,
    name: "Cadeira de Rodas",
    description: "Cadeira de rodas manual para maior mobilidade",
    category: "Mobilidade",
    available: true,
    image: "🦽",
    maxDuration: "4 horas"
  },
  {
    id: 2,
    name: "Carrinho de Bebê",
    description: "Carrinho para facilitar compras com crianças",
    category: "Família",
    available: true,
    image: "🍼",
    maxDuration: "3 horas"
  },
  {
    id: 3,
    name: "Carrinho de Compras Grande",
    description: "Carrinho extra grande para compras maiores",
    category: "Compras",
    available: false,
    image: "🛒",
    maxDuration: "2 horas"
  },
  {
    id: 4,
    name: "Guarda-Volumes Móvel",
    description: "Cofre móvel para guardar pertences durante as compras",
    category: "Segurança",
    available: true,
    image: "🔒",
    maxDuration: "6 horas"
  }
];

const Equipamentos = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Equipamentos Disponíveis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Equipamentos disponíveis para empréstimo no shopping. Facilite sua experiência de compras!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentData.map((equipment) => (
            <Card key={equipment.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="text-4xl mb-2">{equipment.image}</div>
                  <Badge variant={equipment.available ? "default" : "secondary"}>
                    {equipment.available ? "Disponível" : "Emprestado"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{equipment.name}</CardTitle>
                <CardDescription>{equipment.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Wrench className="h-4 w-4 mr-2" />
                    <span>Categoria: {equipment.category}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Duração máxima: {equipment.maxDuration}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={!equipment.available}
                    variant={equipment.available ? "default" : "secondary"}
                  >
                    {equipment.available ? "Solicitar Empréstimo" : "Indisponível"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Equipamentos;