import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Phone, Mail, CreditCard, CheckCircle } from "lucide-react";
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
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
                {/* Decorative corners */}
                <span className="absolute -left-px -top-px block size-3 border-l-2 border-t-2 border-green-500 rounded-tl-2xl"></span>
                <span className="absolute -right-px -top-px block size-3 border-r-2 border-t-2 border-emerald-500 rounded-tr-2xl"></span>
                <span className="absolute -bottom-px -left-px block size-3 border-b-2 border-l-2 border-emerald-500 rounded-bl-2xl"></span>
                <span className="absolute -bottom-px -right-px block size-3 border-b-2 border-r-2 border-green-500 rounded-br-2xl"></span>
                
                <CardHeader className="text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-t-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">
                      {getEquipmentIcon(equipmentType)}
                    </div>
                    {reservedEquipmentId && (
                      <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold">
                        ✅ Selecionado
                      </Badge>
                    )}
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Equipamento Selecionado
                    </CardTitle>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-2">
                      {getEquipmentName(equipmentType)}
                    </p>
                    {availabilityInfo && (
                      <div className="mt-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg py-2 px-4">
                        <p className="text-sm text-muted-foreground">
                          {availabilityInfo.availableCount} de {availabilityInfo.totalCount} disponíveis
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Formulário de cadastro */}
          <div className="lg:col-span-2">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
                {/* Decorative corners */}
                <span className="absolute -left-px -top-px block size-3 border-l-2 border-t-2 border-blue-500 rounded-tl-2xl"></span>
                <span className="absolute -right-px -top-px block size-3 border-r-2 border-t-2 border-purple-500 rounded-tr-2xl"></span>
                <span className="absolute -bottom-px -left-px block size-3 border-b-2 border-l-2 border-purple-500 rounded-bl-2xl"></span>
                <span className="absolute -bottom-px -right-px block size-3 border-b-2 border-r-2 border-blue-500 rounded-br-2xl"></span>
                
                <CardHeader className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-2xl"></div>
                  <CardTitle className="text-2xl flex items-center relative z-10 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <User className="h-6 w-6 mr-2 text-blue-600" />
                    Dados do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Nome Completo *
                      </Label>
                      <div className="relative">
                        <Input
                          id="nome"
                          type="text"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className={`text-lg py-4 pl-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:scale-105 ${
                            errors.nome 
                              ? 'border-red-400 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20' 
                              : 'border-gray-200 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 hover:border-blue-300'
                          }`}
                          placeholder="Digite o nome completo"
                        />
                        <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.nome && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {errors.nome}
                        </p>
                      )}
                    </div>

                    {/* CPF */}
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                        CPF *
                      </Label>
                      <div className="relative">
                        <Input
                          id="cpf"
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className={`text-lg py-4 pl-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:scale-105 font-mono ${
                            errors.cpf 
                              ? 'border-red-400 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20' 
                              : 'border-gray-200 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 hover:border-blue-300'
                          }`}
                          placeholder="000.000.000-00"
                          maxLength={14}
                        />
                        <CreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.cpf && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {errors.cpf}
                        </p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        Telefone *
                      </Label>
                      <div className="relative">
                        <Input
                          id="telefone"
                          type="text"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          className={`text-lg py-4 pl-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:scale-105 font-mono ${
                            errors.telefone 
                              ? 'border-red-400 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20' 
                              : 'border-gray-200 focus:border-green-500 bg-white/50 dark:bg-gray-800/50 hover:border-green-300'
                          }`}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
                        <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.telefone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {errors.telefone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-purple-500" />
                        Email (opcional)
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`text-lg py-4 pl-4 pr-12 rounded-xl border-2 transition-all duration-300 focus:scale-105 ${
                            errors.email 
                              ? 'border-red-400 focus:border-red-500 bg-red-50/50 dark:bg-red-950/20' 
                              : 'border-gray-200 focus:border-purple-500 bg-white/50 dark:bg-gray-800/50 hover:border-purple-300'
                          }`}
                          placeholder="email@exemplo.com"
                        />
                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Categoria do Cliente */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Categoria do Cliente
                      </Label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['gestante', 'idoso', 'outros'] as const).map((category) => (
                          <div key={category} className="group relative">
                            <div className={`absolute -inset-1 rounded-xl blur opacity-25 transition duration-300 ${
                              formData.categoria === category 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-75' 
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 group-hover:opacity-50'
                            }`}></div>
                            <Button
                              type="button"
                              className={`relative h-20 w-full rounded-xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 transform hover:scale-105 ${
                                formData.categoria === category
                                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                                  : 'bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, categoria: category }))}
                            >
                              <span className="text-2xl">{getCategoryIcon(category)}</span>
                              <span className="text-sm font-semibold">{getCategoryLabel(category)}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-4 pt-8">
                      <div className="group relative flex-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                        <Button
                          type="button"
                          size="lg"
                          className="relative w-full text-lg py-6 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300 transform hover:scale-105"
                          onClick={handleCancel}
                        >
                          <ArrowLeft className="h-5 w-5 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                      
                      <div className="group relative flex-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                        <Button
                          type="submit"
                          size="lg"
                          className="relative w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Continuar
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastrarCliente;