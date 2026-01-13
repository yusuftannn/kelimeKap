import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { LevelService } from "../services/level.service";
export default function LevelPicker({ value, onChange }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await LevelService.getLevels();
      setLevels(data);
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
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <Picker selectedValue={value} onValueChange={(v) => onChange(v)}>
        <Picker.Item label="Seviye Seç" value="" />
        {levels.map((lvl) => (
          <Picker.Item
            key={lvl.id}
            label={`${lvl.code} · ${lvl.title}`}
            value={lvl.code}
          />
        ))}
      </Picker>
    </View>
  );
}
