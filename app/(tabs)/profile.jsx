import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import PageHeader from "../../src/components/PageHeader";
import { LevelService } from "../../src/services/level.service";
import { UserService } from "../../src/services/user.service";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(true);

  const loadLevels = useCallback(async () => {
    try {
      setLoadingLevels(true);
      const data = await LevelService.getLevels();
      setLevels(data);
    } catch (e) {
      console.log("Level load error:", e);
    } finally {
      setLoadingLevels(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLevels();
    }, [loadLevels])
  );

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

      await UserService.updateProfile(user.id, {
        name,
        username,
        level,
      });

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
        <Text style={styles.label}>Email</Text>
        <Text style={styles.readonly}>{user.email}</Text>

        <Text style={styles.label}>İsim</Text>
        <Input placeholder="Ad Soyad" value={name} onChangeText={setName} />

        <Text style={styles.label}>Username</Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Seviye</Text>

        {loadingLevels ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={level}
              onValueChange={(value) => setLevel(value)}
            >
              <Picker.Item label="Seviye Seç" value="" />
              {levels.map((lvl) => (
                <Picker.Item
                  key={lvl.id}
                  label={`${lvl.code} · ${lvl.title}`}
                  value={lvl.code.toUpperCase()}
                />
              ))}
            </Picker>
          </View>
        )}

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
