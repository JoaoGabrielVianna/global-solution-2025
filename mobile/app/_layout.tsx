import { Stack } from "expo-router";
import { AppProvider } from "./contexts/appContext";

export default function RootLayout() {

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
