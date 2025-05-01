// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const PlacesVisitedScreen = () => {
//   const [places, setPlaces] = useState([]);

//   useEffect(() => {
//     const fetchVisitedPlaces = async () => {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) return;

//       try {
//         const res = await axios.get(
//           `http://10.12.71.39:7001/api/user/visited-places/${userId}`
//         );
//         setPlaces(res.data.placesVisited || []);
//       } catch (err) {
//         console.error("Error fetching visited places:", err);
//       }
//     };

//     fetchVisitedPlaces();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <View style={styles.header}>
//           <Image
//             source={{
//               uri: "https://cdn.usegalileo.ai/sdxl10/02f006a2-3c00-45dd-bf79-a23449fc75d8.png",
//             }}
//             style={styles.avatar}
//           />
//           <Text style={styles.title}>My History</Text>
//         </View>

//         {places.map((entry, index) => (
//           <View key={index} style={styles.card}>
//             <Image
//               source={{
//                 uri: entry.photo
//                   ? entry.photo
//                   : "https://via.placeholder.com/70",
//               }}
//               style={styles.cardImage}
//             />
//             <View style={styles.cardText}>
//               <Text style={styles.cardTitle}>{entry.name}</Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     padding: 16,
//     paddingBottom: 8,
//   },
//   avatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#131118",
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#131118",
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   card: {
//     flexDirection: "row",
//     padding: 16,
//     gap: 12,
//   },
//   cardImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 12,
//     backgroundColor: "#eee",
//   },
//   cardText: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#131118",
//   },
//   cardSub: {
//     fontSize: 14,
//     color: "#6d5f8c",
//   },
// });

// export default PlacesVisitedScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

const PlacesVisitedScreen = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchVisitedPlaces = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://10.12.71.39:7001/api/user/visited-places/${userId}`
        );
        setPlaces(res.data.placesVisited || []);
      } catch (err) {
        console.error("Error fetching visited places:", err);
      }
    };

    fetchVisitedPlaces();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {/* <Image
            source={{
              uri: "https://cdn.usegalileo.ai/sdxl10/02f006a2-3c00-45dd-bf79-a23449fc75d8.png",
            }}
            style={styles.avatar}
          /> */}
          <Text style={styles.title}>Places Visited</Text>
        </View>

        {places.map((entry, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{
                uri: entry.photo || "https://via.placeholder.com/300",
              }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{entry.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0ff",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    color: "#6a0dad",
    fontFamily: "Georgia",
    fontWeight: "bold",
  },
  card: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#7b4de4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.6,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: "#4b0082",
    marginTop: 12,
    textAlign: "center",
  },
});

export default PlacesVisitedScreen;
