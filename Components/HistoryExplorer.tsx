// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";

// const screenWidth = Dimensions.get("window").width;
// const cardSize = (screenWidth - 60) / 2; // Padding and margin considered

// const data = [
//   {
//     title: "Explore Destinations",
//     image: "https://your-server.com/image1.jpg",
//     navigateTo: "MapScreen", // Navigate to MapScreen
//   },
//   {
//     title: "Historic Site Log",
//     image: "https://your-server.com/image2.jpg",
//     navigateTo: "PlacesVisited", // Navigate to PlacesVisited
//   },
//   {
//     title: "Challenge Yourself",
//     image: "https://your-server.com/image3.jpg",
//     navigateTo: "Quiz", // Navigate to Quiz
//   },
//   {
//     title: "Hall of Fame",
//     image: "https://your-server.com/image4.jpg",
//     navigateTo: "Leaderboard", // Navigate to Leaderboard
//   },
// ];

// const HistoryExplorer = ({ navigation }: any) => {
//   const renderCard = ({ item }: any) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate(item.navigateTo)} // Navigate based on button
//     >
//       <Image source={{ uri: item.image }} style={styles.cardImage} />
//       <Text style={styles.cardText}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>History Explorer</Text>
//         <TouchableOpacity>
//           <Icon name="settings-outline" size={22} color="#333" />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={data}
//         renderItem={renderCard}
//         keyExtractor={(item, index) => index.toString()}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         contentContainerStyle={styles.grid}
//       />
//       <View style={styles.bottomNav}>
//         <Icon name="home" size={24} color="#000" />
//         <Icon name="search-outline" size={24} color="#7b4de4" />
//         <Icon name="person-outline" size={24} color="#7b4de4" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1edf9",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   title: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
//   grid: { paddingBottom: 20 },
//   row: { justifyContent: "space-between", marginBottom: 20 },
//   card: {
//     width: cardSize,
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     elevation: 2,
//   },
//   cardImage: {
//     width: "100%",
//     height: cardSize,
//     resizeMode: "cover",
//   },
//   cardText: {
//     padding: 10,
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//     color: "#1a1a1a",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 14,
//     backgroundColor: "#f1edf9",
//     borderTopWidth: 1,
//     borderTopColor: "#dcd6f4",
//   },
// });

// export default HistoryExplorer;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;
const cardHeight = 220;
const bgImage = require("../assets/aaa.jpg");

const data = [
  {
    title: "🌍 Explore Nearby",
    image:
      "https://images.unsplash.com/photo-1607606443043-7fa4cf6a8caa?auto=format&fit=crop&w=800&q=80",
    description: "Unlock hidden tails beneath your feet.",
    navigateTo: "MapScreen",
  },
  {
    title: "📝 Places Visited",
    image:
      "https://images.unsplash.com/photo-1592201508331-e152ef559fbd?auto=format&fit=crop&w=800&q=80",
    description: "Keep track of the amazing places you’ve explored.",
    navigateTo: "PlacesVisited",
  },
  {
    title: "🧠 Challenge Yourself",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80",
    description: "Test your knowledge through quests.",
    navigateTo: "Quiz",
  },
  {
    title: "🏆 Hall of Fame",
    image:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80",
    description: "Climb the leaderboard of elite explorers!",
    navigateTo: "Leaderboard",
  },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 300}
      style={styles.card}
      useNativeDriver
    >
      <TouchableOpacity onPress={() => navigation.navigate(item.navigateTo)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <LinearGradient colors={["#ffffff", "#f0f0f0"]} style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bgImage}
      imageStyle={{ opacity: 0.27 }}
    >
      <View style={styles.container}>
        {/* <StatusBar barStyle="light-content" backgroundColor="#3e2b93" /> */}

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
  },
  profilePic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#aaa",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  image: {
    width: "100%",
    height: cardHeight,
  },
  overlay: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
});
