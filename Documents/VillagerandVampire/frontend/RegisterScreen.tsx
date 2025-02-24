import React from "react";
import { View, TextInput, TouchableOpacity, Text, ImageBackground, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const RegisterScreen = () => {
    return (


        <ImageBackground
            source={require("../assets/Mysterious Forest.png")} // Arka plan resmi
            style={styles.background}
        >
            <View style={styles.container}>
                {/* E-Posta Input */}
                <ImageBackground source={require("../assets/Registerbutton1.png")}
                    style={styles.inputContainer}
                    imageStyle={{ borderRadius: 25 }}>
                    <TextInput placeholder="E-Posta" placeholderTextColor="#ddd" style={styles.input} />
                </ImageBackground>

                {/* Parola Input */}
                <ImageBackground source={require("../assets/Registerbutton1.png")} style={styles.inputContainer}
                    imageStyle={{ borderRadius: 25 }}>
                    <TextInput placeholder="Parola" placeholderTextColor="#ddd" style={styles.input} secureTextEntry />
                </ImageBackground>

                {/* Parola Tekrar Input */}
                <ImageBackground source={require("../assets/Registerbutton1.png")}
                    style={styles.inputContainer}
                    imageStyle={{ borderRadius: 25 }}>
                    <TextInput placeholder="Parola Tekrar" placeholderTextColor="#ddd" style={styles.input} secureTextEntry />
                </ImageBackground>

                {/* Kayıt Ol Butonu */}
                <TouchableOpacity style={styles.buttonContainer}>
                    <ImageBackground
                        source={require("../assets/registerbutton2.png")}
                        style={styles.button}
                        imageStyle={{ borderRadius: 25 }}
                    >
                        <Text style={styles.buttonText}>Kayıt Ol</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center", // İçeriği ortala
        alignItems: "center",
    },
    container: {
        width: "90%",
        alignItems: "center",
        position: "absolute",
        bottom: 90, // Butonları gri alana yerleştir
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        color: "#fff",
        fontSize: 16,
        textAlign: "left", // Yazıyı sola hizala
        width: "100%", // Genişliği tam kapla
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    button: {
        width: "95%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});


export default RegisterScreen; 