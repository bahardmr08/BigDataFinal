import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

// Ekran yüksekliğini ve genişliğini al (tam ekran için)
const { height, width } = Dimensions.get("window");

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve parola alanlarını doldurun.");
      return;
    }
    // Giriş işlemi başarılıysa HomeScreen'e yönlendir
    navigation.navigate("Home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <View style={styles.screen}>
        {/* StatusBar'ı gizle */}
        <StatusBar hidden={true} />

        <ImageBackground
          source={require("../assets/Mysterious Forest.png")}
          style={styles.background}
        >
          <View style={styles.container}>
            {/* E-Posta Input */}
            <ImageBackground
              source={require("../assets/Registerbutton1.png")}
              style={styles.inputContainer}
              imageStyle={{ borderRadius: 25 }}
            >
              <TextInput
                placeholder="E-Posta"
                placeholderTextColor="#ddd"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </ImageBackground>

            {/* Parola Input */}
            <ImageBackground
              source={require("../assets/Registerbutton1.png")}
              style={styles.inputContainer}
              imageStyle={{ borderRadius: 25 }}
            >
              <TextInput
                placeholder="Parola"
                placeholderTextColor="#ddd"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </ImageBackground>

            {/* Giriş Yap Butonu */}
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogin}
            >
              <ImageBackground
                source={require("../assets/registerbutton2.png")}
                style={styles.button}
                imageStyle={{ borderRadius: 25 }}
              >
                <Text style={styles.buttonText}>Giriş Yap</Text>
              </ImageBackground>
            </TouchableOpacity>

            {/* Kayıt Ol Linki */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerText}>
                Hesabınız mı yok?{" "}
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: "#fff",
    fontSize: 16,
    textAlign: "left",
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    width: "95%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 15,
    color: "#ddd",
    fontSize: 14,
  },
  registerLink: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginScreen;