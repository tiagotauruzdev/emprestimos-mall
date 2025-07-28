import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft, Package, RotateCcw } from "lucide-react";
import { useState } from "react";

const availableEquipment = [
  {
    id: 1,
    name: "Carrinho de Bebê",
    description: "Carrinho para facilitar compras com crianças",
    image: "🍼",
    maxDuration: "3 horas",
    quantity: 5
  },
  {
    id: 2,
    name: "Carrinho de Pet",
    description: "Carrinho especial para transporte de pets pequenos",
    image: "🐕",
    maxDuration: "2 horas",
    quantity: 3
  },
  {
    id: 3,
    name: "Cadeira de Rodas",
    description: "Cadeira de rodas manual para maior mobilidade",
    image: "🦽",
    maxDuration: "4 horas",
    quantity: 4
  }
];

const borrowedEquipment = [
  {
    id: 101,
    name: "Carrinho de Bebê",
    tag: "CB-001",
    borrowedBy: "Maria Silva",
    borrowedAt: "14:30",
    image: "🍼"
  },
  {
    id: 102,
    name: "Cadeira de Rodas",
    tag: "CR-003",
    borrowedBy: "João Santos",
    borrowedAt: "15:15",
    image: "🦽"
  },
  {
    id: 103,
    name: "Carrinho de Pet",
    tag: "CP-002",
    borrowedBy: "Ana Costa",
    borrowedAt: "16:00",
    image: "🐕"
  }
];

const Equipamentos = () => {
  const [selectedAction, setSelectedAction] = useState<'borrow' | 'return' | null>(null);

  const resetView = () => {
    setSelectedAction(null);
  };

  if (selectedAction === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-foreground mb-8">
            Totem de Equipamentos
          </h1>
          <p className="text-2xl text-muted-foreground mb-16">
            Selecione uma opção para continuar
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Button
              size="lg"
              className="h-80 text-4xl font-bold bg-primary hover:bg-primary/90 flex flex-col items-center justify-center space-y-6"
              onClick={() => setSelectedAction('borrow')}
            >
              <Package className="h-20 w-20" />
              <span>EMPRESTAR</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-80 text-4xl font-bold border-2 hover:bg-muted flex flex-col items-center justify-center space-y-6"
              onClick={() => setSelectedAction('return')}
            >
              <RotateCcw className="h-20 w-20" />
              <span>DEVOLVER</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAction === 'borrow') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="lg" onClick={resetView} className="mr-4">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Voltar
            </Button>
            <h1 className="text-4xl font-bold text-foreground">
              Equipamentos para Empréstimo
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableEquipment.map((equipment) => (
              <Card key={equipment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4">{equipment.image}</div>
                  <Badge variant="default" className="mb-2">
                    {equipment.quantity} disponíveis
                  </Badge>
                  <CardTitle className="text-2xl">{equipment.name}</CardTitle>
                  <CardDescription className="text-lg">{equipment.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="flex items-center justify-center text-muted-foreground mb-6">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="text-lg">Duração máxima: {equipment.maxDuration}</span>
                  </div>
                  
                  <Button size="lg" className="w-full text-xl py-6">
                    Selecionar Este Equipamento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedAction === 'return') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="lg" onClick={resetView} className="mr-4">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Voltar
            </Button>
            <h1 className="text-4xl font-bold text-foreground">
              Equipamentos para Devolução
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {borrowedEquipment.map((equipment) => (
              <Card key={equipment.id} className="hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4">{equipment.image}</div>
                  <Badge variant="destructive" className="mb-2">
                    Emprestado
                  </Badge>
                  <CardTitle className="text-2xl">{equipment.name}</CardTitle>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Tag:</strong> {equipment.tag}</p>
                    <p><strong>Cliente:</strong> {equipment.borrowedBy}</p>
                    <p><strong>Retirado às:</strong> {equipment.borrowedAt}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center">
                  <Button size="lg" variant="outline" className="w-full text-xl py-6">
                    Devolver Este Equipamento
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Equipamentos;