import { Text, View } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminGuard({ children }) {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== "admin") {
    return (
      <View style={{ padding: 24 }}>
        <Text>Bu alana erişim yetkiniz yok.</Text>
      </View>
    );
  }

  return children;
}
