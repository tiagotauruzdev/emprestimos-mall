import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEquipmentAvailability } from "@/hooks/useEquipmentAvailability";

// Helper functions for equipment display
const getEquipmentIcon = (tipo: string) => {
  switch (tipo) {
    case 'carrinho_bebe':
      return '🍼';
    case 'carrinho_pet':
      return '🐕';
    case 'cadeira_rodas':
      return '🦽';
    default:
      return '📦';
  }
};

const getEquipmentName = (tipo: string) => {
  switch (tipo) {
    case 'carrinho_bebe':
      return 'Carrinho de Bebê';
    case 'carrinho_pet':
      return 'Carrinho de Pet';
    case 'cadeira_rodas':
      return 'Cadeira de Rodas';
    default:
      return tipo;
  }
};

const CadastrarCliente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { equipmentType } = useParams<{ equipmentType: string }>();
  const { releaseReservation } = useEquipmentAvailability();
  
  // Dados passados da página anterior
  const reservedEquipmentId = location.state?.reservedEquipmentId;
  const availabilityInfo = location.state?.availabilityInfo;
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    categoria: 'outros' as 'gestante' | 'idoso' | 'outros'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Liberar reserva se o usuário sair da página sem completar
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (reservedEquipmentId) {
        releaseReservation(reservedEquipmentId);
      }
    };

    const handlePopState = () => {
      if (reservedEquipmentId) {
        releaseReservation(reservedEquipmentId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [reservedEquipmentId, releaseReservation]);

  const validateCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  };

  const validateEmail = (email: string) => {
    if (!email) return true; // Email é opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Navegar para confirmação do empréstimo
      navigate(`/confirmar-emprestimo?equipmentType=${equipmentType}`, {
        state: { 
          clientData: formData,
          reservedEquipmentId,
          availabilityInfo
        }
      });
    }
  };

  const handleCancel = async () => {
    // Liberar reserva antes de cancelar
    if (reservedEquipmentId) {
      await releaseReservation(reservedEquipmentId);
    }
    navigate('/selecionar-equipamento');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gestante':
        return '🤱';
      case 'idoso':
        return '👴';
      default:
        return '👤';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'gestante':
        return 'Gestante';
      case 'idoso':
        return 'Idoso';
      default:
        return 'Outros';
    }
  };

  if (!equipmentType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Erro: Tipo de equipamento não especificado
          </h2>
          <Button onClick={() => navigate('/selecionar-equipamento')} variant="outline">
            Voltar para Seleção
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="lg" onClick={() => navigate('/selecionar-equipamento')} className="mr-4">
            <ArrowLeft className="h-6 w-6 mr-2" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-foreground">
            Cadastrar Cliente
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do equipamento selecionado */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">
                  {getEquipmentIcon(equipmentType)}
                </div>
                {reservedEquipmentId && (
                  <Badge variant="default" className="mb-2">
                    ✅ Selecionado
                  </Badge>
                )}
                <CardTitle className="text-xl">
                  Equipamento Selecionado
                </CardTitle>
                <p className="text-lg font-semibold text-primary">
                  {getEquipmentName(equipmentType)}
                </p>
                {availabilityInfo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {availabilityInfo.availableCount} de {availabilityInfo.totalCount} disponíveis
                  </p>
                )}
              </CardHeader>
            </Card>
          </div>

          {/* Formulário de cadastro */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="nome" className="text-lg">Nome Completo *</Label>
                    <Input
                      id="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className={`text-lg py-3 ${errors.nome ? 'border-destructive' : ''}`}
                      placeholder="Digite o nome completo"
                    />
                    {errors.nome && (
                      <p className="text-destructive text-sm mt-1">{errors.nome}</p>
                    )}
                  </div>

                  {/* CPF */}
                  <div>
                    <Label htmlFor="cpf" className="text-lg flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      CPF *
                    </Label>
                    <Input
                      id="cpf"
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className={`text-lg py-3 ${errors.cpf ? 'border-destructive' : ''}`}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    {errors.cpf && (
                      <p className="text-destructive text-sm mt-1">{errors.cpf}</p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="telefone" className="text-lg flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className={`text-lg py-3 ${errors.telefone ? 'border-destructive' : ''}`}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                    {errors.telefone && (
                      <p className="text-destructive text-sm mt-1">{errors.telefone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-lg flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email (opcional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`text-lg py-3 ${errors.email ? 'border-destructive' : ''}`}
                      placeholder="email@exemplo.com"
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Categoria do Cliente */}
                  <div>
                    <Label className="text-lg">Categoria do Cliente</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {(['gestante', 'idoso', 'outros'] as const).map((category) => (
                        <Button
                          key={category}
                          type="button"
                          variant={formData.categoria === category ? "default" : "outline"}
                          className="h-20 flex flex-col items-center justify-center space-y-2"
                          onClick={() => setFormData(prev => ({ ...prev, categoria: category }))}
                        >
                          <span className="text-2xl">{getCategoryIcon(category)}</span>
                          <span className="text-sm">{getCategoryLabel(category)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1 text-lg py-6"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 text-lg py-6"
                    >
                      Continuar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarCliente;