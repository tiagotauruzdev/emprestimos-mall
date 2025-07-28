import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Disponível 24/7",
      description: "Equipamentos disponíveis durante todo o funcionamento do shopping"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Seguro e Confiável",
      description: "Todos os equipamentos são higienizados e mantidos em perfeito estado"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Fácil de Usar",
      description: "Processo simples de solicitação e retirada, sem burocracia"
    }
  ];

  const popularEquipments = [
    { name: "Cadeira de Rodas", icon: "🦽", available: 5 },
    { name: "Carrinho de Bebê", icon: "🍼", available: 8 },
    { name: "Carrinho Grande", icon: "🛒", available: 12 },
    { name: "Guarda-Volumes", icon: "🔒", available: 3 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              ShopLend
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Facilitamos sua experiência de compras com equipamentos disponíveis para empréstimo gratuito. 
              Cadeiras de rodas, carrinhos de bebê e muito mais!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/equipamentos">
                  Ver Equipamentos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/como-funciona">Como Funciona</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Por que escolher o ShopLend?
            </h2>
            <p className="text-lg text-muted-foreground">
              Oferecemos a melhor experiência em empréstimo de equipamentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-background/50">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Equipment Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Equipamentos Mais Solicitados
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja o que está disponível agora
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularEquipments.map((equipment, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2">{equipment.icon}</div>
                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-2">
                    {equipment.available} disponíveis
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/equipamentos">
                Ver Todos os Equipamentos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Facilite suas compras hoje mesmo. O empréstimo é gratuito e sem complicações!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/equipamentos">Escolher Equipamento</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link to="/contato">Falar Conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
