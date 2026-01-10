import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import CustomToast from "../src/components/CustomToast";

const toastConfig = {
  success: (props) => <CustomToast {...props} />,
  error: (props) => <CustomToast {...props} />,
  info: (props) => <CustomToast {...props} />,
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />

      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
