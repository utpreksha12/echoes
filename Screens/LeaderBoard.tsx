import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://10.12.71.39:7001/api/user/leaderboard");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          throw new Error("Failed to fetch leaderboard");
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#793dfa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => `${item.email}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.userRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9ff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    padding: 20,
    textAlign: "center",
    color: "#1d1333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: "700",
    color: "#793dfa",
    width: 30,
  },
  email: {
    fontSize: 16,
    color: "#1d1333",
    flex: 1,
    marginLeft: 8,
  },
  score: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d1333",
  },
});
