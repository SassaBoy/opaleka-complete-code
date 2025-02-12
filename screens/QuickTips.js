import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const QuickTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://192.168.8.138:5001/api/tips");
        setTips(response.data.data || []);
      } catch (error) {
        console.error("Error fetching tips:", error.message);
        setError("Failed to fetch tips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
    const interval = setInterval(fetchTips, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Tips</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a237e" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : tips.length === 0 ? (
        <Text style={styles.noTipsText}>No tips available at the moment.</Text>
      ) : (
        <View style={styles.tipsContainer}>
          {tips.map((tip, index) => {
            // Trim colors to remove any whitespace
            const cleanedColors = tip.colors.map(color => color.trim());

            return (
              <LinearGradient
                key={index}
                colors={cleanedColors}
                style={styles.tipCard}
              >
                <View style={styles.tipContent}>
                  <View style={styles.iconContainer}>
                    <Icon name={tip.icon} size={24} color={cleanedColors[0]} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                </View>
              </LinearGradient>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: -28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginLeft: 8,
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  tipTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tipDescription: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  noTipsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default QuickTips;