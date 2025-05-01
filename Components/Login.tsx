import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const bgImage = require("../assets/aaa.jpg");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://10.12.71.39:7001/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;
      console.log(response.data);

      if (user && user._id) {
        await AsyncStorage.setItem("userId", user._id);
        console.log(user._id);
        await AsyncStorage.setItem("token", token);
      }

      navigation.navigate("HistoryExplorer");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bgImage}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#c2aaff"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#c2aaff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)", // glassy white overlay
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#6a0dad",
  },
  input: {
    height: 50,
    borderColor: "#b19cd9",
    borderWidth: 1.5,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#4b0082",
  },
  button: {
    backgroundColor: "#7b4de4",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#7b4de4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "#cc0000",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  signupText: {
    textAlign: "center",
    color: "#6a0dad",
    marginTop: 20,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default Login;
