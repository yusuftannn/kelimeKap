import { router } from "expo-router";
import { View } from "react-native";
import AdminGuard from "../../src/components/AdminGuard";
import Button from "../../src/components/Button";
import PageHeader from "../../src/components/PageHeader";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function AdminHome() {
  return (
    <AdminGuard>
      <PageHeader title="Admin Panel" showBack={false} />

      <View style={{ padding: 20 }}>
        <Button
          title="Kullanıcılar"
          variant="success"
          onPress={() => router.push("/admin/users")}
        />
        <Button
          title="Kelime Yönetimi"
          onPress={() => router.push("/admin/words")}
        />

        <Button
          title="Yeni Kelime Ekle"
          variant="outline"
          onPress={() => router.push("/admin/words/create")}
        />

        <Button
          title="Çıkış Yap"
          variant="danger"
          onPress={() => {
            useAuthStore.getState().logout();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </AdminGuard>
  );
}
