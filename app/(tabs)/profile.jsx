import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import LevelPicker from "../../src/components/LevelPicker";
import PageHeader from "../../src/components/PageHeader";
import { UserService } from "../../src/services/user.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isGuest = useAuthStore((s) => s.isGuest);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setName(user.name || "");
        setUsername(user.username || "");
        setLevel(user.level || "");
      }
    }, [user]),
  );

  const saveProfile = async () => {
    try {
      setLoading(true);

      if (!isGuest && user?.id && user.id !== "guest") {
        await UserService.updateProfile(user.id, {
          name,
          username,
          level,
        });
      }

      setUser({
        ...user,
        name,
        username,
        level,
      });

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Profil bilgileri güncellendi.",
        visibilityTime: 2000,
      });
    } catch (e) {
      console.log("Profile update error:", e);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Profil güncellenirken bir sorun oluştu.",
        visibilityTime: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <PageHeader title="Profil" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            paddingTop: 15,
            paddingBottom: 5,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 36,
              backgroundColor: "#4F46E5",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#FFF",
                fontSize: 28,
                fontWeight: "700",
              }}
            >
              {(name || user.username || "U").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {user.name || "Kullanıcı"}
          </Text>

          {!!username && (
            <Text
              style={{
                textAlign: "center",
                color: "#6B7280",
                marginTop: 4,
              }}
            >
              @{user.username}
            </Text>
          )}

          {!isGuest && (
            <Text
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                marginTop: 6,
              }}
            >
              {user.email}
            </Text>
          )}
        </View>

        {isGuest && (
          <View
            style={{
              backgroundColor: "#FFF8E6",
              borderWidth: 1,
              borderColor: "#FCD34D",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#92400E",
                marginBottom: 12,
                lineHeight: 20,
              }}
            >
              Üyeliksiz moddasın. Bilgilerin yalnızca bu cihazda saklanır.
            </Text>

            <Button
              title="Hesap Oluştur"
              variant="outline"
              onPress={() => router.push("/(auth)/register")}
            />
          </View>
        )}

        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 10,
              color: "#111827",
            }}
          >
            Hesap Bilgileri
          </Text>

          <Text style={styles.label}>İsim</Text>
          <Input placeholder="Ad Soyad" value={name} onChangeText={setName} />

          <Text style={styles.label}>Username</Text>
          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Seviye</Text>
          <LevelPicker value={level} onChange={(v) => setLevel(v)} />

          <View style={{ marginTop: 24 }}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Değişiklikleri Kaydet" onPress={saveProfile} />
            )}
          </View>

          <View style={{ marginTop: 12 }}>
            <Button
              title="Çıkış Yap"
              variant="outline"
              onPress={() => {
                useAuthStore.getState().logout();
                router.replace("/(auth)/login");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    marginTop: 7,
  },
  readonly: {
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 8,
  },
  pickerWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 1,
  },
});
