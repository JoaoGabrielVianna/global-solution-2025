import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import {
  Shield,
  AlertTriangle,
  Phone,
  Users,
  Home,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  FileText,
  Zap,
  Heart,
  X,
  Info,
} from 'lucide-react-native';
import { COLORS } from '@/app/constants/colors';

interface MitigationAction {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baixa';
  category: 'preparacao' | 'evacuacao' | 'emergencia' | 'pos-evento';
  timeframe: string;
  icon: any;
  steps: string[];
  resources?: string[];
  contacts?: { name: string; phone: string }[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
  icon: any;
}

export default function MitigationScreen() {
  const [currentRiskLevel, setCurrentRiskLevel] = useState<string>('moderado');
  const [selectedAction, setSelectedAction] = useState<MitigationAction | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [isEmergencyVisible, setIsEmergencyVisible] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    {
      name: 'Defesa Civil',
      phone: '199',
      description: 'Situações de emergência e evacuação',
      icon: Shield,
    },
    {
      name: 'Bombeiros',
      phone: '193',
      description: 'Resgate e primeiros socorros',
      icon: Heart,
    },
    {
      name: 'SAMU',
      phone: '192',
      description: 'Emergências médicas',
      icon: Zap,
    },
    {
      name: 'Polícia Militar',
      phone: '190',
      description: 'Segurança e ordem pública',
      icon: Shield,
    },
  ];

  const mitigationActions: MitigationAction[] = [
    {
      id: 'kit-emergencia',
      title: 'Prepare Kit de Emergência',
      description: 'Monte um kit com itens essenciais para situações de evacuação',
      priority: 'alta',
      category: 'preparacao',
      timeframe: '2 horas',
      icon: Home,
      steps: [
        'Água potável (3 litros por pessoa)',
        'Alimentos não perecíveis para 3 dias',
        'Medicamentos essenciais',
        'Documentos importantes em saco plástico',
        'Lanterna e pilhas extras',
        'Rádio portátil',
        'Kit de primeiros socorros',
        'Roupas extras e cobertores',
        'Dinheiro em espécie',
      ],
      resources: ['Lista de verificação completa', 'Guia de montagem'],
    },
    {
      id: 'plano-evacuacao',
      title: 'Elabore Plano de Evacuação',
      description: 'Defina rotas e pontos de encontro seguros',
      priority: 'alta',
      category: 'preparacao',
      timeframe: '1 hora',
      icon: MapPin,
      steps: [
        'Identifique 2 rotas de saída diferentes',
        'Localize abrigos temporários próximos',
        'Defina ponto de encontro da família',
        'Memorize números de emergência',
        'Pratique o plano com todos da casa',
        'Mantenha combustível no veículo',
      ],
      contacts: [
        { name: 'Defesa Civil Local', phone: '199' },
        { name: 'Prefeitura', phone: '156' },
      ],
    },
    {
      id: 'monitoramento-clima',
      title: 'Monitore Condições Climáticas',
      description: 'Acompanhe previsões e alertas meteorológicos',
      priority: 'media',
      category: 'preparacao',
      timeframe: 'Contínuo',
      icon: AlertTriangle,
      steps: [
        'Instale apps de alertas meteorológicos',
        'Cadastre-se no sistema de SMS da Defesa Civil',
        'Monitore níveis de chuva na região',
        'Observe sinais de instabilidade no terreno',
        'Mantenha rádio sintonizado em notícias',
      ],
      resources: ['Apps recomendados', 'Sites de monitoramento'],
    },
    {
      id: 'evacuacao-imediata',
      title: 'Evacuação Imediata',
      description: 'Ações urgentes quando há risco iminente',
      priority: 'alta',
      category: 'evacuacao',
      timeframe: 'Imediato',
      icon: Users,
      steps: [
        'Pegue apenas o kit de emergência',
        'Siga a rota de evacuação planejada',
        'Dirija-se ao ponto de encontro',
        'Conte todos os membros da família/grupo',
        'Comunique sua situação às autoridades',
        'NÃO retorne até liberação oficial',
      ],
      contacts: [
        { name: 'Defesa Civil', phone: '199' },
        { name: 'Emergência Geral', phone: '911' },
      ],
    },
    {
      id: 'primeiros-socorros',
      title: 'Primeiros Socorros',
      description: 'Atendimento básico em caso de ferimentos',
      priority: 'alta',
      category: 'emergencia',
      timeframe: 'Imediato',
      icon: Heart,
      steps: [
        'Mantenha a calma e avalie a situação',
        'Chame ajuda médica imediatamente (192)',
        'Não mova vítimas com suspeita de fratura',
        'Estanque sangramentos com pressão direta',
        'Mantenha vítima aquecida e consciente',
        'Aguarde chegada do socorro especializado',
      ],
      contacts: [
        { name: 'SAMU', phone: '192' },
        { name: 'Bombeiros', phone: '193' },
      ],
    },
    {
      id: 'pos-evento',
      title: 'Após o Evento',
      description: 'Cuidados após a passagem do risco',
      priority: 'media',
      category: 'pos-evento',
      timeframe: '24-48h',
      icon: CheckCircle,
      steps: [
        'Aguarde liberação oficial para retorno',
        'Verifique estrutura da residência',
        'Documente danos com fotos',
        'Entre em contato com seguro/assistência',
        'Procure apoio psicológico se necessário',
        'Colabore com avaliações técnicas',
      ],
      resources: ['Formulários de seguro', 'Contatos de apoio'],
    },
  ];

  const getRiskActions = (riskLevel: string) => {
    switch (riskLevel) {
      case 'baixo':
        return mitigationActions.filter(action => 
          action.category === 'preparacao' && action.priority !== 'alta'
        );
      case 'moderado':
        return mitigationActions.filter(action => 
          action.category === 'preparacao'
        );
      case 'alto':
        return mitigationActions.filter(action => 
          ['preparacao', 'evacuacao'].includes(action.category)
        );
      case 'extremo':
        return mitigationActions.filter(action => 
          ['evacuacao', 'emergencia'].includes(action.category)
        );
      default:
        return mitigationActions.filter(action => action.category === 'preparacao');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return COLORS.danger;
      case 'media':
        return COLORS.warning;
      case 'baixa':
        return COLORS.success;
      default:
        return COLORS.textLight;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'preparacao':
        return Shield;
      case 'evacuacao':
        return Users;
      case 'emergencia':
        return AlertTriangle;
      case 'pos-evento':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getRiskLevelConfig = (level: string) => {
    switch (level) {
      case 'baixo':
        return { color: COLORS.success, label: 'Baixo', bgColor: 'rgba(107, 142, 35, 0.1)' };
      case 'moderado':
        return { color: COLORS.warning, label: 'Moderado', bgColor: 'rgba(218, 165, 32, 0.1)' };
      case 'alto':
        return { color: COLORS.accent, label: 'Alto', bgColor: 'rgba(192, 127, 85, 0.1)' };
      case 'extremo':
        return { color: COLORS.danger, label: 'Extremo', bgColor: 'rgba(205, 92, 92, 0.1)' };
      default:
        return { color: COLORS.textLight, label: 'Desconhecido', bgColor: 'rgba(128, 128, 128, 0.1)' };
    }
  };

  const toggleActionComplete = (actionId: string) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const makePhoneCall = (phoneNumber: string) => {
    Alert.alert(
      'Ligar para ' + phoneNumber,
      'Deseja fazer a ligação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`),
        },
      ]
    );
  };

  const renderActionCard = (action: MitigationAction) => {
    const CategoryIcon = getCategoryIcon(action.category);
    const isCompleted = completedActions.includes(action.id);

    return (
      <TouchableOpacity
        key={action.id}
        style={[styles.actionCard, isCompleted && styles.actionCardCompleted]}
        onPress={() => {
          setSelectedAction(action);
          setIsModalVisible(true);
        }}
      >
        <View style={styles.actionHeader}>
          <View style={styles.actionIconContainer}>
            <action.icon size={20} color={COLORS.primary} />
          </View>
          
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, isCompleted && styles.actionTitleCompleted]}>
              {action.title}
            </Text>
            <Text style={styles.actionDescription} numberOfLines={2}>
              {action.description}
            </Text>
            
            <View style={styles.actionMeta}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(action.priority) }]}>
                <Text style={styles.priorityText}>
                  {action.priority.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.timeframe}>
                <Clock size={12} color={COLORS.textLight} />
                <Text style={styles.timeframeText}>{action.timeframe}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkButton, isCompleted && styles.checkButtonCompleted]}
            onPress={() => toggleActionComplete(action.id)}
          >
            <CheckCircle 
              size={20} 
              color={isCompleted ? COLORS.success : COLORS.textLight} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionFooter}>
          <ArrowRight size={16} color={COLORS.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmergencyContact = (contact: EmergencyContact) => (
    <TouchableOpacity
      key={contact.phone}
      style={styles.emergencyContact}
      onPress={() => makePhoneCall(contact.phone)}
    >
      <View style={styles.emergencyIconContainer}>
        <contact.icon size={24} color={COLORS.danger} />
      </View>
      
      <View style={styles.emergencyInfo}>
        <Text style={styles.emergencyName}>{contact.name}</Text>
        <Text style={styles.emergencyPhone}>{contact.phone}</Text>
        <Text style={styles.emergencyDescription}>{contact.description}</Text>
      </View>
      
      <Phone size={20} color={COLORS.danger} />
    </TouchableOpacity>
  );

  const renderActionModal = () => {
    if (!selectedAction) return null;

    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedAction.title}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>📋 Passos a Seguir</Text>
              {selectedAction.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            {selectedAction.contacts && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>📞 Contatos Importantes</Text>
                {selectedAction.contacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItem}
                    onPress={() => makePhoneCall(contact.phone)}
                  >
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedAction.resources && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>📚 Recursos Adicionais</Text>
                {selectedAction.resources.map((resource, index) => (
                  <View key={index} style={styles.resourceItem}>
                    <FileText size={16} color={COLORS.textLight} />
                    <Text style={styles.resourceText}>{resource}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.markCompleteButton}
              onPress={() => {
                toggleActionComplete(selectedAction.id);
                setIsModalVisible(false);
              }}
            >
              <CheckCircle size={20} color={COLORS.white} />
              <Text style={styles.markCompleteText}>
                {completedActions.includes(selectedAction.id) 
                  ? 'Marcar como Pendente' 
                  : 'Marcar como Concluído'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const currentActions = getRiskActions(currentRiskLevel);
  const riskConfig = getRiskLevelConfig(currentRiskLevel);
  const completionRate = currentActions.length > 0 
    ? Math.round((completedActions.filter(id => 
        currentActions.some(action => action.id === id)
      ).length / currentActions.length) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ações de Mitigação</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => setIsEmergencyVisible(true)}
        >
          <AlertTriangle size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status atual */}
        <View style={[styles.statusCard, { backgroundColor: riskConfig.bgColor }]}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Nível de Risco Atual</Text>
            <View style={[styles.riskBadge, { backgroundColor: riskConfig.color }]}>
              <Text style={styles.riskBadgeText}>{riskConfig.label}</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progresso das Ações</Text>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${completionRate}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedActions.filter(id => 
                currentActions.some(action => action.id === id)
              ).length} de {currentActions.length} ações concluídas ({completionRate}%)
            </Text>
          </View>
        </View>

        {/* Seletor de nível de risco */}
        <View style={styles.riskSelector}>
          <Text style={styles.selectorTitle}>Simular Nível de Risco:</Text>
          <View style={styles.riskOptions}>
            {['baixo', 'moderado', 'alto', 'extremo'].map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.riskOption,
                  currentRiskLevel === level && styles.riskOptionActive,
                  { borderColor: getRiskLevelConfig(level).color }
                ]}
                onPress={() => setCurrentRiskLevel(level)}
              >
                <Text style={[
                  styles.riskOptionText,
                  currentRiskLevel === level && { color: getRiskLevelConfig(level).color }
                ]}>
                  {getRiskLevelConfig(level).label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista de ações */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>
            Ações Recomendadas ({currentActions.length})
          </Text>
          
          {currentActions.length > 0 ? (
            currentActions.map(renderActionCard)
          ) : (
            <View style={styles.emptyState}>
              <Shield size={48} color={COLORS.success} />
              <Text style={styles.emptyStateTitle}>Situação Controlada</Text>
              <Text style={styles.emptyStateText}>
                Nenhuma ação específica necessária no momento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de detalhes da ação */}
      {renderActionModal()}

      {/* Modal de contatos de emergência */}
      <Modal
        visible={isEmergencyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.emergencyModalContainer}>
          <View style={styles.emergencyModalHeader}>
            <Text style={styles.emergencyModalTitle}>Contatos de Emergência</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsEmergencyVisible(false)}
            >
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.emergencyModalContent}>
            <View style={styles.emergencyWarning}>
              <AlertTriangle size={24} color={COLORS.danger} />
              <Text style={styles.emergencyWarningText}>
                Use apenas em situações de real emergência
              </Text>
            </View>

            {emergencyContacts.map(renderEmergencyContact)}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emergencyButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(205, 92, 92, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  progressSection: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  riskSelector: {
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  riskOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  riskOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    alignItems: 'center',
  },
  riskOptionActive: {
    backgroundColor: 'rgba(76, 90, 65, 0.1)',
  },
  riskOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardCompleted: {
    backgroundColor: 'rgba(107, 142, 35, 0.05)',
    borderColor: COLORS.success,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 90, 65, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  timeframe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeframeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  checkButton: {
    padding: 4,
  },
  checkButtonCompleted: {
    backgroundColor: 'rgba(107, 142, 35, 0.1)',
    borderRadius: 12,
  },
  actionFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalSection: {
    marginBottom: 32,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  contactPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resourceText: {
    fontSize: 14,
    color: COLORS.text,
  },
  markCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  markCompleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Emergency modal styles
  emergencyModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emergencyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  emergencyModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.danger,
    flex: 1,
  },
  emergencyModalContent: {
    flex: 1,
    padding: 24,
  },
  emergencyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(205, 92, 92, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  emergencyWarningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(205, 92, 92, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  emergencyPhone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
});