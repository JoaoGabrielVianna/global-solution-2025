export default interface MonitoringRecord {
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