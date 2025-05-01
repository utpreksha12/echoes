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
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const bgImage = require("../assets/aaa.jpg");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://10.12.71.39:7001/api/auth/signup",
        { username, email, password }
      );
      const { token } = response.data;
      navigation.navigate("HistoryExplorer");
    } catch (error) {
      setErrorMessage("Error creating account");
    }
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bgImage}
      imageStyle={{ opacity: 0.2 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#c2aaff"
          value={username}
          onChangeText={setUserName}
        />
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
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
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
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
  loginText: {
    textAlign: "center",
    color: "#6a0dad",
    marginTop: 20,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default Signup;
