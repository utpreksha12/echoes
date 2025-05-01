import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QuizScreen() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const visitedRes = await fetch(
          `http://10.12.71.39:7001/api/user/visited-places/${userId}`
        );
        const { placesVisited } = await visitedRes.json();
        const placeNames = placesVisited.map((p) => p.name).join(", ");

        const gptPrompt = `
Generate a 5-question multiple choice quiz about the following places: ${placeNames}. go deeper and make them tougher not simple.
Each question must be in this JSON format:
{
  "question": "What is the name of ...?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": "Option 1"
}
Return the quiz as a JSON array.
`;

        const openAIRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer OPENAI_API_KEY",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: gptPrompt }],
              temperature: 0.7,
            }),
          }
        );

        if (!openAIRes.ok) {
          const errorText = await openAIRes.text();
          throw new Error(`OpenAI API error: ${errorText}`);
        }

        const gptData = await openAIRes.json();
        const rawText = gptData.choices[0].message.content;

        const jsonMatch = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
        if (!jsonMatch) throw new Error("Failed to extract JSON from GPT");

        const quiz = JSON.parse(jsonMatch[0]);
        setQuestions(quiz);
      } catch (error) {
        console.error("Quiz generation error:", error);
        Alert.alert("Error", "Failed to generate quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleSelect = (questionIndex, option) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return Alert.alert("Error", "User ID not found.");

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score += 100;
      } else {
        score -= 20;
      }
    });

    try {
      const res = await fetch(
        `http://10.12.71.39:7001/api/quiz/submit-score/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scoreChange: score }),
        }
      );

      const data = await res.json();
      if (data.success) {
        Alert.alert(
          "Quiz Submitted",
          `Your score has been updated!\nChange: ${score}\nNew Score: ${data.updatedScore}`
        );
      } else {
        throw new Error("Quiz submission failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit quiz score");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#793dfa" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <View style={styles.header}>
          <Text style={styles.icon}>✖</Text>
        </View> */}

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://cdn.usegalileo.ai/sdxl10/19f1458c-6716-4a6d-9dcd-0c3e899ce470.png",
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Quiz on Visited Landmarks</Text>
        <Text style={styles.subtitle}>
          Test your knowledge about the places you've explored!
        </Text>

        {questions.map((q, i) => (
          <View key={i}>
            <Text style={styles.questionTitle}>
              Question {i + 1} of {questions.length}
            </Text>
            <Text style={styles.questionText}>{q.question}</Text>

            <View style={styles.optionsContainer}>
              {q.options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(i, option)}
                  style={[
                    styles.option,
                    answers[i] === option && styles.optionSelected,
                  ]}
                >
                  <View style={styles.radioCircle}>
                    {answers[i] === option && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#faf9ff" },
  header: { padding: 16, alignItems: "flex-start" },
  icon: { fontSize: 24, color: "#1d1333" },
  imageContainer: {
    height: 220,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerImage: { height: "100%", width: "100%" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d1333",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#4e4b59",
    paddingHorizontal: 20,
    paddingTop: 6,
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1d1333",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1d1333",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0ddef",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  optionSelected: {
    borderColor: "#793dfa",
    backgroundColor: "#f2ebff",
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#c5bedf",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#793dfa",
  },
  optionText: {
    fontSize: 15,
    color: "#1d1333",
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: "#793dfa",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
