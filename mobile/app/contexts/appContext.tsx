import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import MonitoringRecord from "../models/monitoringRecord";
import states from "@/app/mocks/states.json"

interface AppContextType {
    monitoringData: MonitoringRecord[];
    setMonitoringData: Dispatch<SetStateAction<MonitoringRecord[]>>
    states: typeof states;

}


export const AppContext = createContext<AppContextType | undefined>(undefined)


interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [monitoringData, setMonitoringData] = useState<MonitoringRecord[]>([]);

    return (
        <AppContext.Provider value={{
            monitoringData, setMonitoringData, states
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useApp must be used within an AppProvider");
    }
    return context;
  };
  