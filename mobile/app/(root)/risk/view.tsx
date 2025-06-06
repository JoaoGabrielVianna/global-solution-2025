import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  TrendingUp, 
  MapPin, 
  Clock,
  RefreshCw,
  Info,
  Droplets,
  Mountain,
  CloudRain,
  Thermometer,
  Eye,
  Bell
} from 'lucide-react-native';
import { COLORS } from '@/app/constants/colors';

interface RiskData {
  level: 'baixo' | 'moderado' | 'alto' | 'extremo';
  percentage: number;
  location: string;
  lastUpdate: string;
  factors: {
    soilHumidity: number;
    terrainInclination: number;
    rainfall: number;
    temperature: number;
  };
}

export default function RiskScreen() {
  const [riskData, setRiskData] = useState<RiskData>({
    level: 'moderado',
    percentage: 65,
    location: 'Morro da Favela, São Paulo',
    lastUpdate: new Date().toLocaleString('pt-BR'),
    factors: {
      soilHumidity: 78,
      terrainInclination: 35,
      rainfall: 45,
      temperature: 24,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const progressAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animar o progresso do risco
    Animated.timing(progressAnim, {
      toValue: riskData.percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animação de pulso para riscos altos
    if (riskData.level === 'alto' || riskData.level === 'extremo') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [riskData.percentage, riskData.level]);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'baixo':
        return {
          color: COLORS.success,
          icon: Shield,
          title: 'Risco Baixo',
          description: 'Condições estáveis. Monitoramento regular recomendado.',
          bgColor: 'rgba(107, 142, 35, 0.1)',
        };
      case 'moderado':
        return {
          color: COLORS.warning,
          icon: Activity,
          title: 'Risco Moderado',
          description: 'Atenção necessária. Monitore as condições de perto.',
          bgColor: 'rgba(218, 165, 32, 0.1)',
        };
      case 'alto':
        return {
          color: COLORS.accent,
          icon: TrendingUp,
          title: 'Risco Alto',
          description: 'Situação preocupante. Considere medidas preventivas.',
          bgColor: 'rgba(192, 127, 85, 0.1)',
        };
      case 'extremo':
        return {
          color: COLORS.danger,
          icon: AlertTriangle,
          title: 'Risco Extremo',
          description: 'Evacuação recomendada. Contate as autoridades.',
          bgColor: 'rgba(205, 92, 92, 0.1)',
        };
      default:
        return {
          color: COLORS.info,
          icon: Info,
          title: 'Análise Pendente',
          description: 'Coletando dados para análise...',
          bgColor: 'rgba(70, 130, 180, 0.1)',
        };
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    
    // Simular carregamento de dados
    setTimeout(() => {
      // Simular novos dados (em um app real, viria de uma API ou AsyncStorage)
      const newPercentage = Math.floor(Math.random() * 100);
      let newLevel: 'baixo' | 'moderado' | 'alto' | 'extremo' = 'baixo';
      
      if (newPercentage >= 80) newLevel = 'extremo';
      else if (newPercentage >= 60) newLevel = 'alto';
      else if (newPercentage >= 30) newLevel = 'moderado';
      
      setRiskData(prev => ({
        ...prev,
        level: newLevel,
        percentage: newPercentage,
        lastUpdate: new Date().toLocaleString('pt-BR'),
        factors: {
          soilHumidity: Math.floor(Math.random() * 100),
          terrainInclination: Math.floor(Math.random() * 90),
          rainfall: Math.floor(Math.random() * 100),
          temperature: Math.floor(Math.random() * 40) + 10,
        },
      }));
      
      setIsLoading(false);
    }, 2000);
  };

  const riskConfig = getRiskConfig(riskData.level);

  const FactorCard = ({ title, value, unit, icon: Icon, riskLevel, description }: {
    title: string;
    value: number;
    unit: string;
    icon: any;
    riskLevel: 'baixo' | 'moderado' | 'alto';
    description: string;
  }) => {
    const getFactorColor = (level: string) => {
      switch (level) {
        case 'baixo': return COLORS.success;
        case 'moderado': return COLORS.warning;
        case 'alto': return COLORS.danger;
        default: return COLORS.info;
      }
    };

    const getFactorPercentage = () => {
      // Calcular percentual baseado no tipo de fator
      if (title === 'Umidade') return Math.min((value / 100) * 100, 100);
      if (title === 'Inclinação') return Math.min((value / 90) * 100, 100);
      if (title === 'Chuva') return Math.min((value / 100) * 100, 100);
      if (title === 'Temperatura') return Math.min(((value - 10) / 40) * 100, 100);
      return 50;
    };

    return (
      <View style={styles.factorCard}>
        <View style={styles.factorHeader}>
          <View style={[styles.factorIconContainer, { backgroundColor: getFactorColor(riskLevel) + '20' }]}>
            <Icon size={20} color={getFactorColor(riskLevel)} />
          </View>
          <View style={styles.factorInfo}>
            <Text style={styles.factorTitle}>{title}</Text>
            <Text style={styles.factorDescription}>{description}</Text>
          </View>
        </View>
        
        <View style={styles.factorValueContainer}>
          <Text style={styles.factorValue}>
            {value}<Text style={styles.factorUnit}>{unit}</Text>
          </Text>
          <View style={styles.factorProgressBar}>
            <View 
              style={[
                styles.factorProgress, 
                { 
                  width: `${getFactorPercentage()}%`,
                  backgroundColor: getFactorColor(riskLevel)
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={[styles.factorStatusBadge, { backgroundColor: getFactorColor(riskLevel) }]}>
          <Text style={styles.factorStatusText}>
            {riskLevel.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Análise de Risco</Text>
            <TouchableOpacity 
              style={[styles.refreshButton, isLoading && styles.refreshButtonLoading]} 
              onPress={refreshData}
              disabled={isLoading}
            >
              <RefreshCw 
                size={20} 
                color={COLORS.primary} 
                style={isLoading ? { transform: [{ rotate: '360deg' }] } : {}}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.textLight} />
            <Text style={styles.location}>{riskData.location}</Text>
          </View>
          
          <View style={styles.timestampContainer}>
            <Clock size={14} color={COLORS.placeholder} />
            <Text style={styles.timestamp}>Última atualização: {riskData.lastUpdate}</Text>
          </View>
        </View>

        {/* Card principal de risco */}
        <View style={[styles.riskCard, { backgroundColor: riskConfig.bgColor }]}>
          <View style={styles.riskHeader}>
            <riskConfig.icon size={32} color={riskConfig.color} />
            <View style={styles.riskInfo}>
              <Text style={styles.riskTitle}>{riskConfig.title}</Text>
              <Text style={styles.riskDescription}>{riskConfig.description}</Text>
            </View>
          </View>
          
          {/* Indicador de progresso circular melhorado */}
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressCircleContainer,
                riskData.level === 'alto' || riskData.level === 'extremo' 
                  ? { transform: [{ scale: pulseAnim }] }
                  : {}
              ]}
            >
              <View style={styles.progressCircle}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: riskConfig.color,
                      height: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
                <View style={styles.progressOverlay}>
                  <Text style={[styles.progressText, { color: riskConfig.color }]}>
                    {riskData.percentage}%
                  </Text>
                  <Text style={styles.progressLabel}>RISCO</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* Estatísticas rápidas */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Eye size={16} color={COLORS.primary} />
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Monitoramento</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Bell size={16} color={COLORS.accent} />
            <Text style={styles.statValue}>{alertsEnabled ? 'ON' : 'OFF'}</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Activity size={16} color={COLORS.success} />
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Sensores</Text>
          </View>
        </View>

        {/* Fatores de risco */}
        <View style={styles.factorsSection}>
          <Text style={styles.sectionTitle}>Fatores Monitorados</Text>
          
          <View style={styles.factorsGrid}>
            <FactorCard
              title="Umidade"
              value={riskData.factors.soilHumidity}
              unit="%"
              icon={Droplets}
              riskLevel={riskData.factors.soilHumidity > 70 ? 'alto' : riskData.factors.soilHumidity > 40 ? 'moderado' : 'baixo'}
              description="Saturação do solo"
            />
            
            <FactorCard
              title="Inclinação"
              value={riskData.factors.terrainInclination}
              unit="°"
              icon={Mountain}
              riskLevel={riskData.factors.terrainInclination > 45 ? 'alto' : riskData.factors.terrainInclination > 25 ? 'moderado' : 'baixo'}
              description="Ângulo do terreno"
            />
            
            <FactorCard
              title="Chuva"
              value={riskData.factors.rainfall}
              unit="mm"
              icon={CloudRain}
              riskLevel={riskData.factors.rainfall > 50 ? 'alto' : riskData.factors.rainfall > 25 ? 'moderado' : 'baixo'}
              description="Precipitação 24h"
            />
            
            <FactorCard
              title="Temperatura"
              value={riskData.factors.temperature}
              unit="°C"
              icon={Thermometer}
              riskLevel='baixo'
              description="Temperatura ambiente"
            />
          </View>
        </View>

        {/* Recomendações */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>📋 Recomendações</Text>
          <View style={styles.recommendationsList}>
            {riskData.level === 'extremo' && (
              <>
                <Text style={styles.recommendationItem}>• Evacue a área imediatamente</Text>
                <Text style={styles.recommendationItem}>• Contate os bombeiros (193)</Text>
                <Text style={styles.recommendationItem}>• Alerte os vizinhos</Text>
              </>
            )}
            {riskData.level === 'alto' && (
              <>
                <Text style={styles.recommendationItem}>• Evite a área de risco</Text>
                <Text style={styles.recommendationItem}>• Mantenha kit de emergência</Text>
                <Text style={styles.recommendationItem}>• Monitore constantemente</Text>
              </>
            )}
            {riskData.level === 'moderado' && (
              <>
                <Text style={styles.recommendationItem}>• Aumente a frequência de monitoramento</Text>
                <Text style={styles.recommendationItem}>• Verifique sistemas de drenagem</Text>
                <Text style={styles.recommendationItem}>• Mantenha contatos de emergência</Text>
              </>
            )}
            {riskData.level === 'baixo' && (
              <>
                <Text style={styles.recommendationItem}>• Continue o monitoramento regular</Text>
                <Text style={styles.recommendationItem}>• Mantenha dados atualizados</Text>
                <Text style={styles.recommendationItem}>• Revise planos de contingência</Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshButtonLoading: {
    opacity: 0.6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: COLORS.textLight,
    marginLeft: 6,
    fontWeight: '500',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.placeholder,
    marginLeft: 4,
  },
  riskCard: {
    margin: 24,
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  riskInfo: {
    flex: 1,
    marginLeft: 16,
  },
  riskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  progressCircleContainer: {
    position: 'relative',
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundDark,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  progressFill: {
    width: '100%',
    borderRadius: 60,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  factorsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  factorCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  factorInfo: {
    flex: 1,
  },
  factorTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  factorDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 14,
  },
  factorValueContainer: {
    marginBottom: 8,
  },
  factorValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  factorUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.textLight,
  },
  factorProgressBar: {
    height: 4,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 2,
    overflow: 'hidden',
  },
  factorProgress: {
    height: '100%',
    borderRadius: 2,
  },
  factorStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  factorStatusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  recommendationsCard: {
    margin: 24,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  recommendationsList: {
    gap: 4,
  },
  recommendationItem: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 4,
  },
});