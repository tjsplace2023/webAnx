import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";

import { Picker } from "@react-native-picker/picker";
import { generateHuggingFace, generateDallE } from "../utils/api";
import PressButton from "../components/PressButton";

const options = ["Kitchen", "Bedroom", "Bathroom", "Living Room"];

const LightingOptions = [
  "Overhead lighting",
  "Task lighting",
  "Ambient lighting",
  "Accent lighting",
];

function HomeScreen() {
  const [colorPalettes, setColorPalettes] = useState("");
  const [flooringOptions, setFlooringOptions] = useState("Hardwood");
  const [lightingOptions, setLightingOptions] = useState("Overhead lighting");
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [accessories, setAccessories] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState("");

  const prompt = `Generate an realistic interior design that includes the following criteria for a ${selectedOption}: ${flooringOptions}, ${lightingOptions}, a ${colorPalettes} color scheme, and It should have ${accessories}. The design should be always realistic.`;

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const generateImage = async () => {
    setLoading(true);
    setModalVisible(true);
    let img = await generateDallE(prompt);
    setImage(img);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>Generate Interior Designs with AI</Text>
        <Text style={styles.subheading}>Please select the options below: </Text>

        <Text style={styles.label}>Select a room:</Text>
        <Picker
          style={styles.textInput}
          selectedValue={selectedOption}
          onValueChange={handleOptionChange}
        >
          {options.map((option) => (
            <Picker.Item label={option} value={option} key={option} />
          ))}
        </Picker>

        <Text style={styles.label}>Select Colors:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Example : Red and Black"
          placeholderTextColor="gray"
          onChangeText={(text) => setColorPalettes(text)}
          value={colorPalettes}
        />
        <Text style={styles.label}>Add Accessories:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Example :  Chair, Lamps and Television"
          placeholderTextColor="gray"
          onChangeText={(text) => setAccessories(text)}
          value={accessories}
        />
        <Text style={styles.label}>Select Flooring:</Text>
        <Picker
          style={styles.textInput}
          selectedValue={flooringOptions}
          onValueChange={(itemValue) => setFlooringOptions(itemValue)}
        >
          <Picker.Item label="Hardwood" value="Hardwood" />
          <Picker.Item label="Tile" value="Tile" />
          <Picker.Item label="Carpet" value="Carpet" />
        </Picker>
        <Text style={styles.label}>Select Lighting:</Text>
        <Picker
          style={styles.textInput}
          selectedValue={lightingOptions}
          onValueChange={(itemValue, itemIndex) =>
            setLightingOptions(itemValue)
          }
        >
          {LightingOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <PressButton
          onPress={generateImage}
          title="Generate Image"
          color="#3e5696"
          textColor="white"
          marginTop={5}
        />

        {loading && (
          <PressButton
            onPress={() => setModalVisible(true)}
            title="Generating Image..."
            color="white"
            textColor="black"
            marginTop={10}
          />
        )}

        {image && (
          <PressButton
            onPress={() => setModalVisible(true)}
            title="View Generated Image"
            color="white"
            textColor="black"
            marginTop={10}
          />
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalContent}>
                {loading ? (
                  <>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={styles.genText}>Generating...</Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={{
                        uri: image,
                      }}
                      style={{ width: 350, height: 350, marginTop: -100 }}
                    />
                  </>
                )}
                <View style={styles.closeButton}>
                  <PressButton
                    onPress={() => setModalVisible(false)}
                    title="Close"
                    color="red"
                    textColor="white"
                    marginTop={5}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff", // white text
    fontSize: 24,
  },
  textInput: {
    backgroundColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 5,
    color: "white",
    fontSize: 15,
    outlineStyle: "none",
  },
  heading: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center", // center text
    marginBottom: 3,
  },

  subheading: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center", // center text
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    color: "white",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#3e5696",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 500,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#121212",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  genText: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
});
