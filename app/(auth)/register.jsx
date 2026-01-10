import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Logo from "../../assets/images/logo.png";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import useAuth from "../../src/hooks/useAuth";

export default function Register() {
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Kayıt Başarısız",
        text2: error,
      });
    }
  }, [error]);

  const handleRegister = () => {
    if (!email || !password || !password2) {
      Toast.show({
        type: "error",
        text1: "Eksik Bilgi",
        text2: "Lütfen tüm alanları doldurun.",
      });
      return;
    }

    if (password !== password2) {
      Toast.show({
        type: "error",
        text1: "Şifre Hatası",
        text2: "Şifreler birbiriyle eşleşmiyor.",
      });
      return;
    }

    register(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo}></Image>
      <View style={styles.content}>
        <Text style={styles.title}>Kayıt Ol</Text>
      </View>

      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <View style={styles.passwordWrapper}>
        <Input
          placeholder="Şifre"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordWrapper}>
        <Input
          placeholder="Şifre Tekrar"
          secureTextEntry={!showPassword2}
          value={password2}
          onChangeText={setPassword2}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword2((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword2 ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E6EF7" />
      ) : (
        <Button title="Kayıt Ol" onPress={handleRegister} />
      )}

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Zaten bir hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  link: {
    textAlign: "center",
    color: "#2E6EF7",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  error: {
    color: "red",
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },
});
