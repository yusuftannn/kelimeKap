import { StyleSheet, TextInput, View } from "react-native";

export default function Input({ placeholder, secureTextEntry, onChangeText, value }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    fontSize: 16,
  },
});
