import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "./PageHeader";

export default function InfoPage({ title, intro, sections }) {
  return (
    <View style={styles.screen}>
      <PageHeader title={title} showMenu />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{intro}</Text>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 27,
    marginBottom: 18,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    color: "#2E609B",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
  },
  body: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 23,
  },
});