import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { LevelService } from "../services/level.service";

export default function LevelPicker({
  value,
  onChange,
  levels: externalLevels,
}) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (externalLevels) {
      setLevels(normalizeLevels(externalLevels));
      setLoading(false);
    } else {
      load();
    }
  }, [externalLevels, load]);

  const load = useCallback(async () => {
    try {
      const data = await LevelService.getLevels();
      setLevels(normalizeLevels(data));
    } catch (e) {
      console.log("Level picker error:", e);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Seviyeler yüklenirken bir sorun oluştu.",
        visibilityTime: 2500,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeLevels = (levels) => {
    if (!levels?.length) return [];

    if (typeof levels[0] === "string") {
      return levels.map((l) => ({
        value: l,
        label: l,
      }));
    }

    return levels.map((l) => ({
      value: l.code,
      label: l.title ? `${l.code} · ${l.title}` : l.code,
    }));
  };

  const selected = levels.find((l) => l.value === value);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (Platform.OS === "android") {
    return (
      <View style={styles.androidWrapper}>
        <Picker selectedValue={value} onValueChange={(v) => onChange(v)}>
          <Picker.Item label="Seviye Seç" value="" />
          {levels.map((lvl) => (
            <Picker.Item key={lvl.value} label={lvl.label} value={lvl.value} />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.iosInput}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? selected?.label : "Seviye Seç"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.cancel}>Vazgeç</Text>
            </Pressable>

            <Text style={styles.title}>Seviye Seç</Text>

            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.done}>Tamam</Text>
            </Pressable>
          </View>

          <Picker
            selectedValue={value ?? null}
            onValueChange={(v) => onChange(v)}
            itemStyle={{ color: "#000" }}
          >
            {levels.map((lvl) => (
              <Picker.Item
                key={lvl.value}
                label={lvl.label}
                value={lvl.value}
              />
            ))}
          </Picker>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  androidWrapper: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
  },

  iosInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "#999",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
  },

  header: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancel: {
    fontSize: 16,
    color: "#999",
  },
  done: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F5D9F",
  },
});
