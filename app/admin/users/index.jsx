import { Picker } from "@react-native-picker/picker";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";
import AdminGuard from "../../../src/components/AdminGuard";
import Button from "../../../src/components/Button";
import PageHeader from "../../../src/components/PageHeader";
import { db } from "../../../src/services/firebase";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("user");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);

      setUsers(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (e) {
      console.log("Admin users load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveRole = async () => {
    if (!selectedUser) return;

    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        role,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role } : u))
      );
      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: `"${selectedUser.email}" kullanıcısı başarıyla güncellendi.`,
        visibilityTime: 2000,
      });
      setModalVisible(false);
      setSelectedUser(null);
    } catch (e) {
      console.log("Role update error:", e);
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kullanıcı rolü güncellenirken bir hata oluştu.",
      });
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <PageHeader title="Kullanıcılar" />
        <View style={styles.center}>
          <Text>Yükleniyor...</Text>
        </View>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <PageHeader title="Kullanıcılar" />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedUser(item);
              setRole(item.role ?? "user");
              setModalVisible(true);
            }}
          >
            <View style={styles.card}>
              <Text style={styles.email}>{item.email ?? "Guest"}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>Role:</Text>
                <Text
                  style={[styles.value, item.role === "admin" && styles.admin]}
                >
                  {item.role}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Level:</Text>
                <Text style={styles.value}>{item.level ?? "-"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Kullanıcı Güncelle</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.readonly}>
              {selectedUser?.email ?? "Guest"}
            </Text>

            <Text style={styles.label}>Seviye</Text>
            <Text style={styles.readonly}>{selectedUser?.level ?? "-"}</Text>

            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={role} onValueChange={setRole}>
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Vazgeç"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Kaydet"
                onPress={saveRole}
                variant="primary"
                style={{ flex: 1 }}
              />
              <View style={styles.modalActions}></View>
            </View>
          </View>
        </View>
      </Modal>
    </AdminGuard>
  );
}

const styles = StyleSheet.create({
  center: {
    padding: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 60,
    color: "#666",
  },
  value: {
    fontWeight: "600",
  },
  admin: {
    color: "#4F46E5",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  readonly: {
    backgroundColor: "#EEE",
    padding: 12,
    borderRadius: 8,
  },
  pickerWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
});
