import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
    useEffect,
  } from "react";
  import MonitoringRecord from "../models/monitoringRecord";
  import states from "@/app/mocks/states.json";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const STORAGE_KEY = "@monitoring_data";
  
  interface AppContextType {
    monitoringData: MonitoringRecord[];
    setMonitoringData: Dispatch<SetStateAction<MonitoringRecord[]>>;
    states: typeof states;
  }
  
  export const AppContext = createContext<AppContextType | undefined>(undefined);
  
  interface AppProviderProps {
    children: ReactNode;
  }
  
  export const AppProvider = ({ children }: AppProviderProps) => {
    const [monitoringData, setMonitoringData] = useState<MonitoringRecord[]>([]);
  
    // 🔄 Carrega dados do AsyncStorage ao iniciar
    useEffect(() => {
      const loadData = async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            setMonitoringData(JSON.parse(stored));
            console.log(JSON.parse(stored))
          }
        } catch (e) {
          console.error("Erro ao carregar dados do AsyncStorage", e);
        }
      };
      loadData();
    }, []);
  
    // 💾 Salva dados no AsyncStorage sempre que mudarem
    useEffect(() => {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(monitoringData));
        } catch (e) {
          console.error("Erro ao salvar dados no AsyncStorage", e);
        }
      };
      saveData();
    }, [monitoringData]);
  
    return (
      <AppContext.Provider value={{ monitoringData, setMonitoringData, states }}>
        {children}
      </AppContext.Provider>
    );
  };
  
  export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useApp must be used within an AppProvider");
    }
    return context;
  };
  