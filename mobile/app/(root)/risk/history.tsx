import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Activity,
  Filter,
  Download,
  Trash2,
  MapPin,
  BarChart3,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react-native';
import { COLORS } from '@/app/constants/colors';
import { useApp } from '@/app/contexts/appContext';

interface HistoryRecord {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  riskLevel: 'baixo' | 'moderado' | 'alto' | 'extremo';
  riskPercentage: number;
  location: string;
  factors: {
    soilHumidity: number;
    terrainInclination: number;
    rainfall: number;
    temperature: number;
  };
}

interface FilterOptions {
  riskLevel: string[];
  dateRange: 'today' | 'week' | 'month' | 'all';
  location: string[];
}
type RiskLevel = 'baixo' | 'moderado' | 'alto' | 'extremo' | 'desconhecido';
const riskLevels: RiskLevel[] = ['baixo', 'moderado', 'alto', 'extremo'];

const riskConfigMap = {
  baixo: {
    color: COLORS.success,
    icon: Shield,
    bgColor: 'rgba(107, 142, 35, 0.1)',
    label: 'Baixo',
  },
  moderado: {
    color: COLORS.warning,
    icon: Activity,
    bgColor: 'rgba(218, 165, 32, 0.1)',
    label: 'Moderado',
  },
  alto: {
    color: COLORS.accent,
    icon: TrendingUp,
    bgColor: 'rgba(192, 127, 85, 0.1)',
    label: 'Alto',
  },
  extremo: {
    color: COLORS.danger,
    icon: AlertTriangle,
    bgColor: 'rgba(205, 92, 92, 0.1)',
    label: 'Extremo',
  },
  desconhecido: {
    color: COLORS.textLight,
    icon: Activity,
    bgColor: 'rgba(128, 128, 128, 0.1)',
    label: 'Desconhecido',
  },
};

function getRiskConfig(level: RiskLevel) {
  return riskConfigMap[level] || riskConfigMap['desconhecido'];
}

function filterByDateRange(data: HistoryRecord[], range: FilterOptions['dateRange']) {
  if (range === 'all') return data;
  const now = new Date();
  let cutoff = now;
  if (range === 'today') {
    return data.filter(r => new Date(r.timestamp).toDateString() === now.toDateString());
  }
  if (range === 'week') {
    cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === 'month') {
    cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return data.filter(r => new Date(r.timestamp) >= cutoff);
}

function applyFiltersAndSort(
  data: HistoryRecord[],
  filters: FilterOptions,
  sortOrder: 'asc' | 'desc'
) {
  let filtered = data;

  if (filters.riskLevel.length) {
    filtered = filtered.filter(r => filters.riskLevel.includes(r.riskLevel));
  }
  if (filters.location.length) {
    filtered = filtered.filter(r =>
      filters.location.some(loc => r.location.includes(loc))
    );
  }
  filtered = filterByDateRange(filtered, filters.dateRange);

  filtered.sort((a, b) => {
    const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? diff : -diff;
  });

  return filtered;
}

export default function HistoryScreen() {
  const { monitoringData, setMonitoringData } = useApp();
  const [filters, setFilters] = useState<FilterOptions>({
    riskLevel: [],
    dateRange: 'all',
    location: [],
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredData, setFilteredData] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    setFilteredData(applyFiltersAndSort(monitoringData, filters, sortOrder));
  }, [monitoringData, filters, sortOrder]);

  const toggleFilter = useCallback((type: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      if (type === 'dateRange') {
        return { ...prev, dateRange: value as FilterOptions['dateRange'] };
      }
      const arr = prev[type] as string[];
      const updated = arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value];
      return { ...prev, [type]: updated };
    });
  }, []);

  const resetFilters = () => {
    setFilters({ riskLevel: [], dateRange: 'all', location: [] });
  };

  const clearHistory = () => {
    Alert.alert('Limpar Histórico', 'Deseja realmente apagar todos os registros?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: () => setMonitoringData([]),
      },
    ]);
  };

  const exportData = () => {
    Alert.alert('Exportar Dados', 'Funcionalidade em desenvolvimento.', [{ text: 'OK' }]);
  };

  const statistics = useMemo(() => {
    const total = filteredData.length;
    const counts = filteredData.reduce(
      (acc, cur) => {
        acc[cur.riskLevel] = (acc[cur.riskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const avgRisk = total
      ? Math.round(filteredData.reduce((sum, r) => sum + r.riskPercentage, 0) / total)
      : 0;
    return { total, counts, avgRisk };
  }, [filteredData]);

  // Render functions here (renderHistoryItem, renderDetailModal) — mantidos iguais
  // por brevidade, seguem limpos e só com pequenas melhorias

  const renderHistoryItem = ({ item }: { item: HistoryRecord }) => {
    const { color, icon: Icon, bgColor, label } = getRiskConfig(item.riskLevel);

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          setSelectedRecord(item);
          setIsModalVisible(true);
        }}
      >
        <View style={styles.itemHeader}>
          <View style={[styles.riskBadge, { backgroundColor: bgColor }]}>
            <Icon size={16} color={color} />
            <Text style={[styles.riskLabel, { color }]}>{label}</Text>
          </View>
          <View style={styles.itemMeta}>
            <Text style={styles.itemDate}>{item.date}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <View style={styles.riskPercentageContainer}>
            <Text style={styles.riskPercentage}>{item.riskPercentage}%</Text>
            <Text style={styles.riskText}>RISCO</Text>
          </View>

          <View style={styles.itemDetails}>
            <View style={styles.locationContainer}>
              <MapPin size={12} color={COLORS.textLight} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            <View style={styles.factorsSummary}>
              <Text style={styles.factorText}>
                Umidade: {item.factors.soilHumidity}% | Inclinação: {item.factors.terrainInclination}°
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedRecord) return null;

    const { color, icon: Icon, bgColor, label } = getRiskConfig(selectedRecord.riskLevel);

    return (
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Registro</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={[styles.modalRiskCard, { backgroundColor: bgColor }]}>
              <View style={styles.modalRiskHeader}>
                <Icon size={32} color={color} />
                <View>
                  <Text style={styles.modalRiskTitle}>{label}</Text>
                  <Text style={styles.modalRiskPercentage}>{selectedRecord.riskPercentage}%</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalInfoSection}>
              <Text style={styles.modalSectionTitle}>📍 Informações Gerais</Text>
              {[
                ['Data:', selectedRecord.date],
                ['Horário:', selectedRecord.time],
                ['Local:', selectedRecord.location],
              ].map(([label, value]) => (
                <View key={label} style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>{label}</Text>
                  <Text style={styles.modalInfoValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalInfoSection}>
              <Text style={styles.modalSectionTitle}>📊 Fatores Ambientais</Text>
              <View style={styles.modalFactorsGrid}>
                {[
                  ['Umidade do Solo', `${selectedRecord.factors.soilHumidity}%`],
                  ['Inclinação', `${selectedRecord.factors.terrainInclination}°`],
                  ['Precipitação', `${selectedRecord.factors.rainfall}mm`],
                  ['Temperatura', `${selectedRecord.factors.temperature}°C`],
                ].map(([label, value]) => (
                  <View key={label} style={styles.modalFactorCard}>
                    <Text style={styles.modalFactorLabel}>{label}</Text>
                    <Text style={styles.modalFactorValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)} style={styles.headerButton}>
            <Filter size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
            style={styles.headerButton}
          >
            {sortOrder === 'desc' ? (
              <TrendingDown size={20} color={COLORS.primary} />
            ) : (
              <TrendingUp size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.total}</Text>
          <Text style={styles.statLabel}>Registros</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.avgRisk}%</Text>
          <Text style={styles.statLabel}>Risco Médio</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{statistics.counts.extremo || 0}</Text>
          <Text style={styles.statLabel}>Críticos</Text>
        </View>
      </View>

      {/* Lista do histórico */}
      <FlatList
        data={filteredData}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BarChart3 size={48} color={COLORS.textLight} />
            <Text style={styles.emptyStateTitle}>Nenhum registro encontrado</Text>
            <Text style={styles.emptyStateSubtitle}>
              {filters.riskLevel.length || filters.location.length || filters.dateRange !== 'all'
                ? 'Ajuste os filtros para ver mais resultados.'
                : 'Comece o monitoramento para ver o histórico aqui.'}
            </Text>
          </View>
        }
      />

      {/* Barra de ações */}
      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.actionButton} onPress={exportData}>
          <Download size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Exportar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={clearHistory}>
          <Trash2 size={20} color={COLORS.danger} />
          <Text style={[styles.actionButtonText, styles.dangerText]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal detalhes */}
      {renderDetailModal()}

      {/* Modal filtros */}
      <Modal visible={isFilterVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.filterModalContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setIsFilterVisible(false)} style={styles.filterCloseButton}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Nível de Risco</Text>
              <View style={styles.filterOptions}>
                {riskLevels.map((level:RiskLevel) => {
                  const { color, label } = getRiskConfig(level);
                  const selected = filters.riskLevel.includes(level);
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.filterOption,
                        selected && { backgroundColor: color, opacity: 0.2 },
                      ]}
                      onPress={() => toggleFilter('riskLevel', level)}
                    >
                      <Text style={[styles.filterOptionText, selected && { color }]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Período</Text>
              <View style={styles.filterOptions}>
                {[
                  { label: 'Hoje', value: 'today' },
                  { label: 'Últimos 7 dias', value: 'week' },
                  { label: 'Últimos 30 dias', value: 'month' },
                  { label: 'Todos', value: 'all' },
                ].map(({ label, value }) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.filterOption,
                      filters.dateRange === value && { backgroundColor: COLORS.primary, opacity: 0.2 },
                    ]}
                    onPress={() => toggleFilter('dateRange', value)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.dateRange === value && { color: COLORS.primary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Localização</Text>
              <View style={styles.filterOptions}>
                {Array.from(new Set(monitoringData.map(r => r.location))).map(loc => {
                  const selected = filters.location.includes(loc);
                  return (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.filterOption,
                        selected && { backgroundColor: COLORS.primary, opacity: 0.2 },
                      ]}
                      onPress={() => toggleFilter('location', loc)}
                    >
                      <Text style={[styles.filterOptionText, selected && { color: COLORS.primary }]}>
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.filterResetButton} onPress={resetFilters}>
              <Text style={styles.filterResetText}>Limpar filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterApplyButton} onPress={() => setIsFilterVisible(false)}>
              <Text style={styles.filterApplyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  historyItem: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  riskPercentageContainer: {
    alignItems: 'center',
  },
  riskPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  riskText: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  itemDetails: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  factorsSummary: {
    marginTop: 4,
  },
  factorText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  actionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  dangerButton: {
    borderColor: COLORS.danger,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.danger,
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
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalRiskCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalRiskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  modalRiskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  modalRiskPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalInfoSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalFactorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalFactorCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    width: '47%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalFactorLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  modalFactorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  // Filter modal styles
  filterModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  filterCloseButton: {
    padding: 8,
  },
  filterContent: {
    flex: 1,
    padding: 24,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  filterResetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  filterResetText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  filterApplyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  filterApplyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

});