import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

type GameScreenProps = NativeStackScreenProps<RootStackParamList, "Game">;

const GameScreen = ({ navigation }: GameScreenProps) => {
  // Butonlarda kullanılacak metin ve renk bilgileri
  const bottomButtons = [
    { icon: require("../assets/vote.png"), text: "VOTE", color: "#440a00" },  // Bordo
    { icon: require("../assets/vampire.png"), text: "Öldür", color: "#1c3300" }, // Haki/yeşil
    { icon: require("../assets/doktor.png"), text: "Koru", color: "#440a00" },
    { icon: require("../assets/avcı.png"), text: "Yanına Al", color: "#1c3300" },
    { icon: require("../assets/Buyucu.png"), text: "Öğren", color: "#440a00" },
  ];

  return (
    <ImageBackground source={require("../assets/Gamebackground.png")} style={styles.background}>
      {/* Üst Başlık */}
      <View style={styles.headerContainer}>
        <Image source={require("../assets/header.png")} style={styles.header} />
        
        {/* Başlık ve yanındaki ikon */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>VAMPİR KÖYLÜ</Text>
          <Image source={require("../assets/headericon.png")} style={styles.headerIcon} />
        </View>
      </View>

      {/* Oyuncu Platformu */}
      <View style={styles.characterPlatform}>
        {/* Character Decor (En Arkada) */}
        <Image source={require("../assets/characterdecor.png")} style={styles.platformImage} />

        {/* Portreler (CharacterDecor'un Üzerinde) */}
        <View style={styles.characterFrames}>
          {[...Array(9)].map((_, index) => (
            <TouchableOpacity
              key={index}
              style={styles.characterFrame}
              onPress={() => alert(`Portre ${index + 1} tıklandı`)}
            >
              <Image
                source={require("../assets/gameportre.png")}
                style={styles.characterFrameImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Alt Butonlar */}
      <View style={styles.bottomBar}>
        {bottomButtons.map((item, index) => (
          <TouchableOpacity key={index} style={styles.bottomButton}>
            {/* Butonun kendi görsel arka planı */}
            <Image
              source={require("../assets/bottombutton.png")}
              style={styles.buttonImage}
            />

            {/* İkon */}
            <Image source={item.icon} style={styles.buttonIcon} />

            {/* Metnin arkasındaki renkli kutucuk */}
            <View style={[styles.textBox, { backgroundColor: item.color }]}>
              <Text style={styles.buttonText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  /* Arka plan */
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Üst Başlık */
  headerContainer: {
    position: "absolute",
    top: 20,
    alignItems: "center",
  },
  header: {
    width: 300,
    height: 80,
    resizeMode: "contain",
  },
  // Başlık ve ikonun yanyana konulacağı kapsayıcı
  headerRow: {
    position: "absolute",
    top: 25,
    left: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    transform: [{ rotate: "-1deg" }], // Yazıyı hafif eğmek için
  },
  headerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5, // Yazıdan biraz boşluk
    resizeMode: "contain",
  },

  /* Karakter Platformu */
  characterPlatform: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
    position: "relative",
  },
  platformImage: {
    width: "90%",
    resizeMode: "contain",
    position: "absolute",
  },
  characterFrames: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    zIndex: 1, // Portreleri öne getirmek için
  },
  characterFrame: {
    width: 70,
    height: 115,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  characterFrameImage: {
    width: 70,
    height: 110,
    resizeMode: "contain",
  },

  /* Alt Butonlar */
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
  bottomButton: {
    alignItems: "center",
    position: "relative",
    marginHorizontal: 0,
  },
  buttonImage: {
    width: 85,
    height: 115,
    resizeMode: "contain",
  },
  buttonIcon: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 30,
    resizeMode: "contain",
  },
  /* Metnin arkasındaki kutucuk */
  textBox: {
    position: "absolute", 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default GameScreen;
