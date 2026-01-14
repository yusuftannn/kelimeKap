import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Seç",
  title = "Seç",
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  if (Platform.OS === "android") {
    return (
      <View style={styles.androidWrapper}>
        <Picker selectedValue={value} onValueChange={onChange}>
          {options.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.iosInput} onPress={() => setOpen(true)}>
        <Text style={!value ? styles.placeholder : styles.text}>
          {selected?.label ?? placeholder}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.cancel}>Vazgeç</Text>
            </Pressable>

            <Text style={styles.title}>{title}</Text>

            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.done}>Tamam</Text>
            </Pressable>
          </View>

          <Picker
            selectedValue={value}
            onValueChange={onChange}
            itemStyle={{ color: "#000" }}
          >
            {options.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  androidWrapper: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
  },

  iosInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 15,
    color: "#000",
  },
  placeholder: {
    fontSize: 15,
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
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row",
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
    color: "#2563eb",
    fontWeight: "600",
  },
});
