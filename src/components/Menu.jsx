import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menuItems = [
  { label: "Nasıl Çalışır?", icon: "help-circle-outline", href: "/how-it-works" },
  { label: "Hakkımızda", icon: "information-circle-outline", href: "/about" },
  { label: "İletişim ve Geri Bildirim", icon: "chatbubble-ellipses-outline", href: "/contact" },
  { label: "Gizlilik Politikası", icon: "shield-checkmark-outline", href: "/privacy" },
];

export default function Menu() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerX = useRef(new Animated.Value(-Dimensions.get("window").width)).current;

  useEffect(() => {
    if (!mounted) return;

    Animated.timing(drawerX, {
      toValue: visible ? 0 : -Dimensions.get("window").width,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) setMounted(false);
    });
  }, [drawerX, mounted, visible]);

  const closeMenu = () => setVisible(false);

  const openPage = (href) => {
    closeMenu();
    router.push(href);
  };

  const openMenu = () => {
    drawerX.setValue(-Dimensions.get("window").width);
    setMounted(true);
    setVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        accessibilityLabel="Menüyü aç"
        onPress={openMenu}
        style={styles.trigger}
      >
        <Ionicons name="menu" size={28} color="#111827" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent
        visible={mounted}
        onRequestClose={closeMenu}
      >
        <SafeAreaView style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={closeMenu} />
          <Animated.View style={[styles.panel, { transform: [{ translateX: drawerX }] }]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Menü</Text>
              <TouchableOpacity
                accessibilityLabel="Menüyü kapat"
                onPress={closeMenu}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.href}
                onPress={() => openPage(item.href)}
                style={styles.item}
              >
                <Ionicons name={item.icon} size={22} color="#2E609B" />
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 24, 39, 0.35)",
  },
  panel: {
    flex: 1,
    width: "82%",
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  panelTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  item: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
  },
  itemLabel: {
    flex: 1,
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
  },
});