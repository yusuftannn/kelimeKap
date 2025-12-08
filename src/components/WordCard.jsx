import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export default function WordCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  const rotate = useSharedValue(0);

  const flipCard = () => {
    rotate.value = withTiming(flipped ? 0 : 180, { duration: 250 });
    setFlipped(!flipped);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${rotate.value}deg`,
        },
      ],
    };
  });

  return (
    <Pressable onPress={flipCard}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.inner}>
          <Text style={styles.word}>{flipped ? back : front}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 48,
    paddingHorizontal: 24,
    elevation: 4,
  },

  inner: {
    alignItems: "center",
  },

  word: {
    fontSize: 32,
    fontWeight: "700",
  },
});
