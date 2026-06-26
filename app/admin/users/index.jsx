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
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import AdminGuard from "../../../src/components/AdminGuard";
import Button from "../../../src/components/Button";
import PageHeader from "../../../src/components/PageHeader";
import Select from "../../../src/components/Select";
import { db } from "../../../src/services/firebase";
import { Ionicons } from "@expo/vector-icons";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState("");
  const [role, setRole] = useState("user");
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const LEVEL_OPTIONS = [
    { label: "A1", value: "A1" },
    { label: "A2", value: "A2" },
    { label: "B1", value: "B1" },
    { label: "B2", value: "B2" },
    { label: "C1", value: "C1" },
    { label: "C2", value: "C2" },
  ];
  const LEVELS = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];
  const ROLES = ["ALL", "admin", "user"];
  const hasFilters =
    search.length > 0 || roleFilter !== "ALL" || levelFilter !== "ALL";

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
        })),
      );
    } catch (e) {
      console.log("Admin users load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async () => {
    if (!selectedUser) return;

    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        email,
        username,
        level,
        role,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                email,
                username,
                level,
                role,
              }
            : u,
        ),
      );

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Kullanıcı güncellendi.",
      });

      setModalVisible(false);
      setSelectedUser(null);
    } catch (e) {
      console.log(e);

      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Kullanıcı güncellenemedi.",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch = (user.email ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "ALL" ? true : (user.role ?? "user") === roleFilter;

    const levelMatch =
      levelFilter === "ALL" ? true : user.level === levelFilter;

    return searchMatch && roleMatch && levelMatch;
  });

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
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />

          <TextInput
            placeholder="Email ara..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {search && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
              }}
            >
              <Ionicons
                name="refresh-circle-outline"
                size={24}
                color="#2563eb"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.levelContainer}>
          {ROLES.map((r) => {
            const active = roleFilter === r;

            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRoleFilter(r)}
                style={[styles.levelButton, active && styles.levelButtonActive]}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    active && styles.levelButtonTextActive,
                  ]}
                >
                  {r === "ALL"
                    ? "Tümü"
                    : r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.levelContainer}>
          {LEVELS.map((l) => {
            const active = levelFilter === l;

            return (
              <TouchableOpacity
                key={l}
                onPress={() => setLevelFilter(l)}
                style={[styles.levelButton, active && styles.levelButtonActive]}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    active && styles.levelButtonTextActive,
                  ]}
                >
                  {l === "ALL" ? "Tümü" : l}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.filterFooter}>
          <Text style={styles.resultText}>
            {filteredUsers.length} kullanıcı bulundu
          </Text>

          {hasFilters && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                setRoleFilter("ALL");
                setLevelFilter("ALL");
              }}
            >
              <Text style={styles.clearFiltersText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedUser(item);

              setEmail(item.email ?? "");
              setUsername(item.username ?? "");
              setLevel(item.level ?? "");
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

            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email"
            />

            <Text style={styles.label}>Username</Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder="Username"
            />

            <Text style={styles.label}>Seviye</Text>

            <Select
              title="Seviye"
              placeholder="Seviye seç"
              value={level}
              onChange={setLevel}
              options={LEVEL_OPTIONS}
            />

            <Text style={styles.label}>Rol</Text>
            <Select
              title="Rol Seç"
              placeholder="Rol seç"
              value={role}
              onChange={setRole}
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
            />

            <View style={styles.modalActions}>
              <Button
                title="Vazgeç"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Kaydet"
                onPress={saveUser}
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
    width: 80,
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
  filters: {
    padding: 16,
    gap: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  searchInput: {
    flex: 1,
    height: 48,
  },

  levelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },

  levelButtonActive: {
    backgroundColor: "#2563eb",
  },

  levelButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
  levelButtonTextActive: {
    color: "#fff",
  },
  resultText: {
    fontSize: 13,
    color: "#6b7280",
  },
  filterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  clearFiltersButtonDisabled: {
    opacity: 0.5,
  },

  clearFiltersText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  },

  clearFiltersTextDisabled: {
    color: "#9ca3af",
  },
});
