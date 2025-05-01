import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import axios from "axios";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [nearestLandmark, setNearestLandmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [landmarkDescription, setLandmarkDescription] = useState(null);
  const [visited, setVisited] = useState(false);

  const GOOGLE_API_KEY = "GOOGLE_API_KEY";
  const OPENAI_API_KEY = "OPENAI_API_KEY";

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          alert("Permission to access location was denied");
        }
      }
    }
  };

  const speakArticle = () => {
    if (landmarkDescription) {
      Speech.speak(landmarkDescription, {
        language: "en",
        rate: 1.0,
        pitch: 1.0,
      });
    } else {
      alert("No article to read aloud");
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    fetchNearbyLandmarks(loc.coords.latitude, loc.coords.longitude);
  };

  const fetchNearbyLandmarks = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=tourist_attraction&key=${GOOGLE_API_KEY}`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const filteredLandmarks = response.data.results.filter((landmark) =>
          landmark.types.some((type) =>
            [
              "historical_site",
              "museum",
              "fort",
              "tomb",
              "historical_landmark",
            ].includes(type)
          )
        );

        if (filteredLandmarks.length > 0) {
          const nearest = getNearestLandmark(
            filteredLandmarks,
            latitude,
            longitude
          );
          setNearestLandmark(nearest);
          fetchDescriptionFromChatGPT(nearest.name);
        } else {
          const cityName = await getCityNameFromCoords(latitude, longitude);
          if (cityName) {
            fetchCityInfoFromChatGPT(cityName);
          } else {
            setError("Could not determine city name.");
            setLoading(false);
          }
        }
      } else {
        setError("No landmarks found");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching landmarks:", error);
      setError("Error fetching landmarks");
      setLoading(false);
    }
  };

  const getCityNameFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      if (
        response.data.status === "OK" &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const addressComponents = response.data.results[0].address_components;
        const cityComponent = addressComponents.find((comp) =>
          comp.types.includes("locality")
        );
        return cityComponent ? cityComponent.long_name : null;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      return null;
    }
  };

  const fetchDescriptionFromChatGPT = async (monumentName) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `You are a professional travel writer. Write a detailed, captivating, and informative article about the historical monument called "${monumentName}". Include at least 8 to 10 well-structured paragraphs.`,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const gptDescription = response.data.choices[0].message.content;
      setLandmarkDescription(gptDescription);
    } catch (err) {
      console.error("Error fetching description from ChatGPT:", err);
      setError("Error fetching description from ChatGPT");
    } finally {
      setLoading(false);
    }
  };

  const fetchCityInfoFromChatGPT = async (cityName) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `You are a professional travel guide. Write a highly detailed and engaging article about the city "${cityName}".`,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const gptCityInfo = response.data.choices[0].message.content;
      setLandmarkDescription(gptCityInfo);
      setNearestLandmark({ name: cityName, photos: [] }); // Fallback
    } catch (err) {
      console.error("Error fetching city info from ChatGPT:", err);
      setError("Could not fetch city information.");
    } finally {
      setLoading(false);
    }
  };

  const getNearestLandmark = (landmarks, latitude, longitude) => {
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let nearest = landmarks[0];
    let minDistance = calculateDistance(
      latitude,
      longitude,
      landmarks[0].geometry.location.lat,
      landmarks[0].geometry.location.lng
    );

    landmarks.forEach((landmark) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        landmark.geometry.location.lat,
        landmark.geometry.location.lng
      );
      if (distance < minDistance) {
        nearest = landmark;
        minDistance = distance;
      }
    });

    return nearest;
  };

  useEffect(() => {
    requestLocationPermission();
    getCurrentLocation();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/aaa.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#9b59b6" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : nearestLandmark && landmarkDescription ? (
          <View style={styles.landmarkContainer}>
            <Text style={styles.landmarkName}>{nearestLandmark.name}</Text>

            {nearestLandmark.photos && nearestLandmark.photos[0] ? (
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${nearestLandmark.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`,
                }}
                style={styles.landmarkImage}
              />
            ) : (
              <Text style={styles.noPhotoText}>No photo available</Text>
            )}

            <Text style={styles.description}>{landmarkDescription}</Text>

            <TouchableOpacity style={styles.ttsButton} onPress={speakArticle}>
              <Text style={styles.ttsText}>🔊 Listen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonContainer,
                visited ? styles.visitedButton : styles.unvisitedButton,
              ]}
              onPress={async () => {
                if (!visited && nearestLandmark) {
                  try {
                    const userId = await AsyncStorage.getItem("userId");
                    if (!userId) return alert("User ID not found");

                    const photo = nearestLandmark.photos?.[0]?.photo_reference
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${nearestLandmark.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                      : "N/A";

                    const payload = {
                      userId,
                      name: nearestLandmark.name,
                      photo,
                    };

                    await axios.post(
                      "http://10.12.71.39:7001/api/user/visit",
                      payload
                    );
                    setVisited(true);
                  } catch (err) {
                    console.error("Failed to mark as visited:", err);
                    alert("Something went wrong");
                  }
                }
              }}
              disabled={visited}
            >
              <Text style={styles.buttonText}>
                {visited ? "Visited ✅" : "Mark as Visited"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.errorText}>No landmarks found nearby</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)", // Major opacity
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  landmarkContainer: {
    marginTop: 40,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  landmarkName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6a1b9a",
    textAlign: "center",
    marginBottom: 10,
  },
  landmarkImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 15,
  },
  noPhotoText: {
    fontSize: 16,
    color: "#777",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    textAlign: "left",
  },
  ttsButton: {
    backgroundColor: "#8e44ad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  ttsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 100,
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  unvisitedButton: {
    backgroundColor: "#9b59b6",
  },
  visitedButton: {
    backgroundColor: "#6a1b9a",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
