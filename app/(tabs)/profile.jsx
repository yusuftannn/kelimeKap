import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setLevel(user.level || "");
    }
  }, [user]);

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
    } catch (e) {
      console.log("Profile update error:", e);
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
    <View style={{ flex: 1 }}>
      <PageHeader title="Profil" />
      <View style={styles.container}>
        {!isGuest && (
          <>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.readonly}>{user.email}</Text>
          </>
        )}
        {isGuest && (
          <View
            style={{
              backgroundColor: "#FFF3CD",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#856404", marginBottom: 6 }}>
              Üyeliksiz moddasın. Bilgilerin sadece bu cihazda saklanır.
            </Text>

            <Button
              title="Hesap Oluştur"
              variant="outline"
              onPress={() => router.push("/(auth)/register")}
            />
          </View>
        )}
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

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Kaydet" onPress={saveProfile} />
        )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: "#666",
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
