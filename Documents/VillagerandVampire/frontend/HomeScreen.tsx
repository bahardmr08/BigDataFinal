import React, { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const characterData = [
  { id: 1, name: "Bilici", image: require("../assets/Buyucu.png"), description: "Görüşçü (Bilici): Her gece bir kişinin rolünü öğrenebilir." },
  { id: 2, name: "Avcı", image: require("../assets/avcı.png"), description: "Avcı: Öldüğünde yanında birini de götürür." },
  { id: 3, name: "Vampir", image: require("../assets/vampire.png"), description: "Vampirler: Köylüleri gizlice öldürmeye çalışır." },
  { id: 4, name: "Köylü", image: require("../assets/koylu.png"), description: "Köylüler: Vampirleri bulmaya çalışır." },
  { id: 5, name: "Doktor", image: require("../assets/doktor.png"), description: "Doktor: Bir kişiyi her tur koruyabilir." }
];

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Game: undefined;  // Game ekranını ekledik
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const handleCharacterPress = (id: number) => {
    setSelectedCharacter(selectedCharacter === id ? null : id);
  };

  return (
    <ImageBackground source={require("../assets/Mysterious Forest.png")} style={styles.background}>
      {/* Characters Section */}
      <View style={styles.charactersContainer}>
        <Image source={require("../assets/decor.png")} style={styles.decorIcon} />
        <Text style={styles.sectionTitle}>CHARACTERS</Text>
        <Image source={require("../assets/decor.png")} style={styles.decorIcon} />
      </View>

      <View style={styles.charactersRow}>
        {characterData.map((char) => (
          <TouchableOpacity key={char.id} onPress={() => handleCharacterPress(char.id)}>
            <Image source={char.image} style={styles.characterIcon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Character Description */}
      {selectedCharacter !== null && (
        <View style={styles.characterDescriptionBox}>
          <Text style={styles.characterDescriptionText}>
            {characterData.find((char) => char.id === selectedCharacter)?.description}
          </Text>
        </View>
      )}

      {/* Lobby Section */}
      <View style={styles.lobbyContainer}>
        <Image source={require("../assets/lobi.png")} style={styles.lobbyFrame} />
        <Text style={styles.lobbyTitle}>JOIN LOBİ</Text>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image source={require("../assets/settings.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("Game")}>
          <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/user.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  charactersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 463,
    top: 462,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fffee0",
    marginHorizontal: 10,
  },
  decorIcon: {
    width: 138,
    height: 20,
  },
  charactersRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 20,
  },
  characterIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  characterDescriptionBox: {
    position: "absolute",
    top: 250,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  characterDescriptionText: {
    color: "#fffee0",
    fontSize: 16,
    textAlign: "center",
  },
  lobbyContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 120,
  },
  lobbyFrame: {
    width: 900,
    height: 190,
    resizeMode: "contain",
  },
  lobbyTitle: {
    position: "absolute",
    top: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fffee0",
  },
  bottomBar: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#fffeef",
    paddingVertical: 9,
    paddingHorizontal: 45,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default HomeScreen;
