import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Droplets, Mountain, Thermometer, Wind, Save, MapPin } from 'lucide-react-native';
import { COLORS } from '@/app/constants/colors';
import { useApp } from '@/app/contexts/appContext';
import { InputField } from '@/app/components/inputField';
import MonitoringRecord from '@/app/models/monitoringRecord';

interface EnvironmentData {
  soilHumidity: string;
  terrainInclination: string;
  temperature: string;
  rainfall: string;
  location: string;
}

export default function EnvironmentDataScreen() {
  const { states, monitoringData, setMonitoringData } = useApp();
  const [data, setData] = useState<EnvironmentData>({
    soilHumidity: '',
    terrainInclination: '',
    temperature: '',
    rainfall: '',
    location: '',
  });

  const handleInputChange = (field: keyof EnvironmentData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const validateData = () => {
    const { soilHumidity, terrainInclination, temperature, rainfall, location } = data;

    if (!soilHumidity || !terrainInclination || !temperature || !rainfall || !location) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    const humidity = parseFloat(soilHumidity);
    const inclination = parseFloat(terrainInclination);
    const temp = parseFloat(temperature);
    const rain = parseFloat(rainfall);

    if (humidity < 0 || humidity > 100) {
      Alert.alert('Erro', 'Umidade do solo deve estar entre 0% e 100%.');
      return false;
    }

    if (inclination < 0 || inclination > 90) {
      Alert.alert('Erro', 'Inclinação deve estar entre 0° e 90°.');
      return false;
    }

    if (temp < -50 || temp > 60) {
      Alert.alert('Erro', 'Temperatura deve estar entre -50°C e 60°C.');
      return false;
    }

    if (rain < 0) {
      Alert.alert('Erro', 'Precipitação não pode ser negativa.');
      return false;
    }

    return true;
  };

  const handleSaveData = async () => {
    if (!validateData()) return;

    try {
      const timestamp = new Date();
      const isoString = timestamp.toISOString();

      const date = timestamp.toLocaleDateString('pt-BR');
      const time = timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const soilHumidity = parseFloat(data.soilHumidity);
      const terrainInclination = parseFloat(data.terrainInclination);
      const rainfall = parseFloat(data.rainfall);
      const temperature = parseFloat(data.temperature);

      // Função simples de exemplo para cálculo de risco:
      const weightedRisk = (
        (soilHumidity * 0.25) +
        (terrainInclination * 0.30) +
        (rainfall * 0.30) +
        (temperature * 0.15)
      );

      let riskLevel: 'baixo' | 'moderado' | 'alto' | 'extremo';

      if (weightedRisk < 25) riskLevel = 'baixo';
      else if (weightedRisk < 50) riskLevel = 'moderado';
      else if (weightedRisk < 75) riskLevel = 'alto';
      else riskLevel = 'extremo';

      const newReading: MonitoringRecord = {
        id: Date.now().toString(),
        timestamp: isoString,
        date,
        time,
        location: data.location,
        riskLevel,
        riskPercentage: Math.min(Math.round(weightedRisk), 100),
        factors: {
          soilHumidity,
          terrainInclination,
          rainfall,
          temperature,
        },
      };

      setMonitoringData(prev => [newReading, ...prev]);
      console.log(newReading)
      Alert.alert('Sucesso', 'Dados ambientais salvos com sucesso!', [{ text: 'OK' }]);

      setData({
        soilHumidity: '',
        terrainInclination: '',
        temperature: '',
        rainfall: '',
        location: '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar os dados. Tente novamente.');
    }
  };


  const citiesList = useMemo(() => {
    const list: string[] = [];
    states.states.forEach(state => {
      state.cities.forEach(city => {
        list.push(`${city}, ${state.name}`);
      });
    });
    return list;
  }, [states]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dados Ambientais</Text>
          <Text style={styles.subtitle}>Insira os dados coletados pelos sensores</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Localização"
            value={data.location}
            onChangeText={(text) => handleInputChange('location', text)}
            placeholder="Ex: Morro da Favela, São Paulo"
            icon={MapPin}
            type="dropdown"
            dropdownData={citiesList}
          />

          <InputField
            label="Umidade do Solo"
            value={data.soilHumidity}
            onChangeText={(text) => handleInputChange('soilHumidity', text)}
            placeholder="0-100"
            icon={Droplets}
            keyboardType="decimal-pad"
            unit="%"
            type="numeric"
          />

          <InputField
            label="Inclinação do Terreno"
            value={data.terrainInclination}
            onChangeText={(text) => handleInputChange('terrainInclination', text)}
            placeholder="0-90"
            icon={Mountain}
            keyboardType="decimal-pad"
            unit="°"
            type="numeric"
          />

          <InputField
            label="Temperatura"
            value={data.temperature}
            onChangeText={(text) => handleInputChange('temperature', text)}
            placeholder="Ex: 25.5"
            icon={Thermometer}
            keyboardType="decimal-pad"
            unit="°C"
            type="numeric"
          />

          <InputField
            label="Precipitação (24h)"
            value={data.rainfall}
            onChangeText={(text) => handleInputChange('rainfall', text)}
            placeholder="Ex: 15.2"
            icon={Wind}
            keyboardType="decimal-pad"
            unit="mm"
            type="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
          <Save size={20} color={COLORS.white} />
          <Text style={styles.saveButtonText}>Salvar Dados</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Dicas de Coleta</Text>
          <Text style={styles.infoText}>
            • Meça a umidade em diferentes pontos{'\n'}
            • Considere a inclinação média da área{'\n'}
            • Registre dados regularmente{'\n'}
            • Verifique condições climáticas recentes
          </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoCard: {
    margin: 24,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});
