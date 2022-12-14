import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useRef, useEffect, useState } from "react";

import {

  Text,
  View,

  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Provider as PaperProvider,
  Button,
  IconButton,
  useTheme,
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import BottomSheet from "react-native-simple-bottom-sheet";
import Icon from "react-native-vector-icons/Feather";
import styles from "./extras/styles";
import CircleButton from "./extras/CircleButton";

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  //! Make sheets go down by default

  const panelRef = useRef();

  const settingsPanelRef = useRef(false);

  const [panelOpacity, setPanelOpacity] = React.useState(1);

  const [isSci, setIsSci] = React.useState(true);
  const [isTrig, setIsTrig] = React.useState(false);

  const [historyArr, setHistoryArr] = React.useState([]);

  const [UITheme, setUITheme] = React.useState(getColorAsync());

  const [theme, setTheme] = React.useState((getThemeAsync()))

  const [flipNums, setFlipNums] = React.useState(getFlipAsync());

  const [resultText, setResultText] = React.useState("");
  const [calculationText, setCalculationText] = React.useState("");

  const [startState, setStartState] = React.useState(1);

  const [showHints, setShowHints] = React.useState(getHints());

  const [messages, setMessages] = useState([]);

  const primaryBtnTheme = useTheme({ colors: { primary: UITheme } });

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  function isUsingBrightColors(color) {
    return color == "#ffd6a5" || color == "#fdffb6" || color == "#caffbf";
  }
  
  function getHints(){
    AsyncStorage.getItem('start').then((value) => {
      return setShowHints(JSON.parse(value))
    }
  
  )}

  function setHints(value){
    AsyncStorage.setItem('start', JSON.stringify(value));
  }

  function getThemeAsync(){

    AsyncStorage.getItem('theme').then((value) => {

      return setTheme(JSON.parse(value))
    }

  )}

  function setThemeAsync(value){
    AsyncStorage.setItem('theme', JSON.stringify(value));

  }

  function getFlipAsync(){

    AsyncStorage.getItem('flip').then((value) => {

      return setFlipNums(JSON.parse(value))
    }

  )}

  function setFlipAsync(value){
    AsyncStorage.setItem('flip', JSON.stringify(value));

  }

  function getColorAsync(){

    AsyncStorage.getItem('color').then((value) => {

      if(value == null){
        return setUITheme("#82d0f1")
      }else{
        return setUITheme((value))
      }

      
    }

  )}

  

  function setColorAsync(value){
    AsyncStorage.setItem('color', value);

  }

  var calculateResult = () => {
    let result;

    try {
      result = Number(
        eval(
          calculationText
            .replaceAll("???", "*")
            .replaceAll("??", "/")
            .replaceAll("^", "**")
            .replaceAll("^2", "**2")
            .replaceAll("^3", "**3")
            .replaceAll("??", "Math.PI")
            .replaceAll("sin(", "Math.sin(")
            .replaceAll("cos(", "Math.cos(")
            .replaceAll("tan(", "Math.tan(")
            .replaceAll("asin(", "Math.asin(")
            .replaceAll("acos(", "Math.acos(")
            .replaceAll("atan(", "Math.atan(")
            .replaceAll("???(", "Math.sqrt(")
        ).toFixed(5)
      );
      setResultText(result);
      //result != historyArr.slice(-1)[0] ? setHistoryArr([...historyArr, result]) : null;
      setHistoryArr([...historyArr, result])
    } catch (error) {
      setMessages(["Invalid Syntax"]);
    }

   
  };

  var setCalcText = (string) => {
    if (
      string == "??" && calculationText.slice(-1) != "+" 
      && calculationText.slice(-1) != "-" 
      && calculationText.slice(-1) != "*" 
      && calculationText.slice(-1) != "/" 
      && calculationText.slice(-1) != "^" 
      && calculationText.slice(-1) != "(" 
      && calculationText.slice(-1) != ")" 
      && calculationText.slice(-1) != "???" 
      && calculationText.slice(-1) != "??" 
      && calculationText.slice(-1) != "sin(" 
      && calculationText.slice(-1) != "cos(" 
      && calculationText.slice(-1) != "tan(" 
      && calculationText.slice(-1) != "asin(" 
      && calculationText.slice(-1) != "acos(" 
      && calculationText.slice(-1) != "atan(" 
      && calculationText.slice(-1) != "???"
      
    ) {

      setCalculationText(calculationText + "???" + string);
    } else {
      setCalculationText(calculationText + string);
    }
  };

  function clearText() {
    setCalculationText("");
  }

  function deleteString() {

    if (
      calculationText.slice(-4) == "sin(" ||
      calculationText.slice(-4) == "cos(" ||
      calculationText.slice(-4) == "tan(" ||
      calculationText.slice(-5) == "asin(" ||
      calculationText.slice(-5) == "acos(" ||
      calculationText.slice(-5) == "atan("
    ) {
      setCalculationText(calculationText.slice(0, -4));
    } else {
      setCalculationText(
        calculationText.substring(0, calculationText.length - 1)
      );
    }
  }

  return (
    <View
      style={{ height: "100%", backgroundColor: theme ? "#121212" : "#fff" }}
    >
      <View
        style={{
          
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "black",
          opacity: 0.7,
          zIndex: 100,
          display: (startState < 4 && showHints != 4) ? "flex" : "none",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "",
            alignItems: "center",
            marginTop: 50,
            height: "90%",
          }}
        >
          <View style={{ display: "flex", justifyContent: "flex-end" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
                width: Dimensions.get("window").width - 40,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Icon
                  suppressHighlighting
                  name="settings"
                  style={{ marginLeft: 10, opacity: startState == 1 ? 1 : 0 }}
                  size={30}
                  color={'#fff'}
                />
              </View>

              <Icon
                suppressHighlighting
                name={"clock"}
                size={30}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  opacity: startState == 2 ? 1 : 0,
                }}
                color={'#fff'}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              display: startState == 1 ? "" : "none",
            }}
          >
            <View>
              <Icon
                name="corner-left-up"
                style={{ marginTop: 15 }}
                size={50}
                color='#fff'
              />
            </View>
            <Text
              style={{
                color: !theme ? "#fff" : "#000",
                textAlign: "center",
                width: 285,
                marginTop: 40,
              }}
            >
              This is the settings button, it allows access to the menu to
              change the look and feel of your calculator
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              display: startState == 2 ? "flex" : "none",
            }}
          >
            <Text
              style={{
                color: !theme ? "#fff" : "#000",
                textAlign: "center",
                width: 290,
                marginTop: 40,
              }}
            >
              This is the history button, it shows recent calculations you have made
            </Text>
            <View>
              <Icon
                name="corner-right-up"
                style={{ marginTop: 15 }}
                size={50}
                color={'#fff'}
              />
            </View>
            
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              display: startState == 3 ? "flex" : "none",
            }}
          >
            <Text
              style={{
                color: !theme ? '#fff' : '#000',
                textAlign: "center",
                width: 290,
              }}
            >
              Here are some tips: {"\n\n"}
              
              1. You can hold press on the backspace key to delete the entire entry {"\n\n"}
              2. The final result will appear in big numbers above the calculation text {"\n\n"}
              3. You can change the color, background, and number orientation at any time
            </Text>
            
            
          </View>
          <IconButton
            iconColor={ '#fff' }
            style={[
              styles.equalsBtn,
              { backgroundColor: '#82d0f1', marginTop: 20 },
            ]}
            icon={startState < 3 ? "arrow-right" : "close"}
            onPress={() => {
              if(startState == 1){
                setStartState(2)
                
              }
              if(startState == 2){
                setStartState(3)

              }
              if(startState == 3){
                setStartState(4)
                setHints(4)
              }

              Haptics.impactAsync();
            }}
          />
          
        </View>
      </View>

      <PaperProvider theme={primaryBtnTheme}>
        <View
          style={{
            position: "absolute",
            top: 45,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
        >
          {messages.map((message) => (
            <Message
              message={messages}
              theme={theme}
              onHide={() => {
                setMessages((messages) =>
                  messages.filter(
                    (currentMessage) => currentMessage !== message
                  )
                );
              }}
            />
          ))}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 50,
            height: "90%",
          }}
        >
          <View style={{ display: "flex", justifyContent: "flex-end" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 20,
                justifyContent: "space-between",
                width: Dimensions.get("window").width - 40,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Icon
                  suppressHighlighting
                  onPress={() => {
                    Haptics.impactAsync(),
                      settingsPanelRef.current.togglePanel();
                  }}
                  name="settings"
                  style={{ marginLeft: 10 }}
                  size={30}
                  color={theme ? "#fff" : "#000"}
                />
              </View>

              <Icon
                suppressHighlighting
                onPress={() => {
                  panelRef.current.togglePanel(), Haptics.impactAsync();
                }}
                name={"clock"}
                size={30}
                style={{ marginLeft: 10, marginRight: 10 }}
                color={theme ? "#fff" : "#000"}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => {
                    copyToClipboard(resultText);
                    Haptics.impactAsync();
                    setMessages(["Result Copied"]);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 70,
                      marginRight: 25,
                      marginLeft: 20,
                      fontWeight: "bold",
                      color: theme ? "#fff" : "#000",
                    }}
                  >
                    {resultText}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    marginBottom: 20,
                    textAlign: "right",
                    fontSize: 20,
                    marginRight: 20,
                    color: UITheme,
                    fontWeight: "bold",
                  }}
                >
                  {calculationText}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                mode={isSci ? "contained" : "outlined"}
                style={[
                  isSci
                    ? theme
                      ? styles.activeModeDarkBtn
                      : styles.activeModeBtn
                    : theme
                    ? styles.inactiveModeDarkBtn
                    : styles.inactiveModeBtn,
                ]}
                onPress={() => {
                  setIsSci(true), setIsTrig(false), Haptics.selectionAsync();
                }}
              >
                <Text
                  style={
                    isSci
                      ? theme
                        ? styles.activeModeDarkText
                        : styles.activeModeText
                      : theme
                      ? styles.inactiveModeDarkText
                      : styles.inactiveModeText
                  }
                >
                  +/-
                </Text>
              </Button>
              <Button
                mode={isTrig ? "contained" : "outlined"}
                style={
                  isTrig
                    ? theme
                      ? styles.activeModeDarkBtn
                      : styles.activeModeBtn
                    : theme
                    ? styles.inactiveModeDarkBtn
                    : styles.inactiveModeBtn
                }
                onPress={() => {
                  setIsTrig(true), setIsSci(false), Haptics.selectionAsync()
                }}
              >
                <Text
                  style={
                    isTrig
                      ? theme
                        ? styles.activeModeDarkText
                        : styles.activeModeText
                      : theme
                      ? styles.inactiveModeDarkText
                      : styles.inactiveModeText
                  }
                >
                  sin/cos
                </Text>
              </Button>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                display: isSci && !flipNums ? "block" : "none",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"ans"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(resultText);
                  }}
                />

                <CircleButton
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"???"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      deleteString();
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="division"
                  onPress={() => {
                    setCalcText("??");
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"7"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("7");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"8"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("8");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"9"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("9");
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="close"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("???");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"4"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("4");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"5"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("5");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"6"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("6");
                  }}
                />
                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="minus"
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"1"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("1");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"2"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("2");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"3"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("3");
                  }}
                />
                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="plus"
                  onPress={() => {
                    setCalcText("+");
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                <CircleButton
                  theme={theme}
                  text={"0"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("0");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"."}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(".");
                  }}
                />
                <IconButton style={styles.blankBtn} />
                <IconButton
                 
                 iconColor={ isUsingBrightColors(UITheme) ? "#000" : "#fff"}
                  style={[styles.equalsBtn, { backgroundColor: UITheme }]}
                  icon="equal"
                  onPress={() => {

                    calculateResult(), Haptics.impactAsync();
                  }}
                />
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                display: isSci && flipNums ? "block" : "none",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"ans"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(resultText);
                  }}
                />

                <CircleButton
                 
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"???"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      deleteString();
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="division"
                  onPress={() => {
                    setCalcText("??");
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"1"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("1");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"2"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("2");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"3"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("3");
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="close"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("???");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"4"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("4");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"5"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("5");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"6"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("6");
                  }}
                />
                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="minus"
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"7"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("7");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"8"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("8");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"9"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("9");
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="plus"
                  onPress={() => {
                    setCalcText("+");
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                <CircleButton
                  theme={theme}
                  text={"0"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("0");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"."}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(".");
                  }}
                />
                <IconButton style={styles.blankBtn} />
                <IconButton
                 
                  iconColor={ isUsingBrightColors(UITheme) ? "#000" : "#fff"}
                  style={[styles.equalsBtn, { backgroundColor: UITheme }]}
                  icon="equal"
                  onPress={() => {

                    calculateResult(), Haptics.impactAsync();
                  }}
                />
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                display: isTrig ? "block" : "none",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"ans"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(resultText);
                  }}
                />

                <CircleButton
                 
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"???"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      deleteString();
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="division"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("??");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"("}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("(");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={")"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(")");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"??"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("??");
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="close"
                  onPress={() => {
                    setCalculationText(calculationText + "???"),
                      Haptics.selectionAsync();
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"???"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("???(");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"x^2"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("^2");
                  }}
                />
                <CircleButton
                 
                  theme={theme}
                  text={"x^n"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("^");
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="minus"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalculationText(calculationText + "-"),
                      Haptics.selectionAsync();
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CircleButton
                  theme={theme}
                  text={"sin"}
                  style={styles.regularBtn}
                  onPress={() => {
                    // setResultText(Math.sin(eval(calculationText)).toFixed(5)),
                    setCalcText("sin(");
                    Haptics.selectionAsync();
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"cos"}
                  style={styles.regularBtn}
                  onPress={() => {
                    //setResultText(Math.cos(eval(calculationText)).toFixed(5)),
                    setCalcText("cos(");
                    Haptics.selectionAsync();
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"tan"}
                  style={styles.regularBtn}
                  onPress={() => {
                    //setResultText(Math.tan(eval(calculationText)).toFixed(5)),
                    setCalcText("tan(");
                    Haptics.selectionAsync();
                  }}
                />

                <IconButton
                 
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="plus"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalculationText(calculationText + "+");
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <CircleButton
                  theme={theme}
                  text={"asin"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("asin(");

                    //setResultText(Math.asin(eval(calculationText))),
                    Haptics.selectionAsync();
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"acos"}
                  style={styles.regularBtn}
                  onPress={() => {
                    //setResultText(Math.acos(eval(calculationText))),
                    setCalcText("acos(");
                    Haptics.selectionAsync();
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"atan"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("atan(");
                    //setResultText(Math.atan(eval(calculationText))),
                    Haptics.selectionAsync();
                  }}
                />
                <IconButton
                 
                 iconColor={ isUsingBrightColors(UITheme) ? "#000" : "#fff"}
                  style={[styles.equalsBtn, { backgroundColor: UITheme }]}
                  icon="equal"
                  onPress={() => {
                    calculateResult(),
                      setCalculationText(""),
                      Haptics.impactAsync();
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <BottomSheet
            isOpen={false}
            sliderMaxHeight={Dimensions.get("window").height * 0.8}
            sliderMinHeight={0}
            animationDuration={600}
            animation={Easing.bezier(0.22, 1, 0.36, 1)}
            wrapperStyle={{
              backgroundColor: theme ? "#1e1e1e" : "#fff",
              opacity: panelOpacity,
            }}
            ref={(ref) => (panelRef.current = ref)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 30,
                  fontWeight: "bold",
                  color: theme ? "#fff" : "#000",
                }}
              >
                History
              </Text>
              <IconButton
                iconColor={theme ? "white" : "black"}
                onPress={() => {
                  panelRef.current.togglePanel(), Haptics.impactAsync();
                }}
                icon="close"
              ></IconButton>
            </View>

            <View
              style={{
                display: "flex",
                paddingTop: 30,
              }}
            >
              <ScrollView style={{height: 400}}>
              {historyArr.map((item, index) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {copyToClipboard(item), Haptics.impactAsync();}}
                      >
                    <Text
                      style={{
                        fontSize: 20,
                        color: theme ? "#fff" : "#000",
                      }}
                    >
                      {item}
                    </Text>
                    </TouchableOpacity>
                  </View>
                  
                );
              })}
              </ScrollView>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                }}
              ></View>
            </View>
            <View style={{ marginLeft: 5, marginRight: 5 }}>
              <Button
                onPress={() => {
                  panelRef.current.togglePanel(),
                    Haptics.impactAsync(),
                    setHistoryArr([]);
                }}
                style={{
                  width: "100%",
                  backgroundColor: UITheme,
                  marginBottom: 40,

                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: isUsingBrightColors(UITheme) ? "black" : "white" }}
                >
                  Clear History
                </Text>
              </Button>
            </View>
          </BottomSheet>
        </View>
        <View style={{ flex: 0 }}>
          <BottomSheet
            isOpen={false}
            animationDuration={600}
            animation={Easing.bezier(0.22, 1, 0.36, 1)}
            wrapperStyle={{
              backgroundColor: theme ? "#1e1e1e" : "#fff",
              opacity: panelOpacity,
            }}
            sliderMaxHeight={Dimensions.get("window").height * 0.9}
            sliderMinHeight={0}
            ref={(ref) => (settingsPanelRef.current = ref)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
               
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 30,
                  fontWeight: "bold",
                  color: theme ? "#fff" : "#000",
                }}
              >
                Settings
              </Text>
              
              <IconButton
                iconColor={theme ? "white" : "black"}
                onPress={() => {
                  settingsPanelRef.current.togglePanel(), Haptics.impactAsync();
                }}
                icon="close"
              ></IconButton>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 24,
                marginTop: 20,
                marginBottom: 10,
                fontWeight: "medium",
                color: theme ? "#fff" : "#000",
              }}
            >
              Colors
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: 10, marginRight: 10 }}
              >
                <IconButton
                  icon={UITheme == "#ff686b" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginRight: 5,
                    backgroundColor: "#ff686b",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#ff686b"), Haptics.impactAsync(), setColorAsync("#ff686b")
                  }}
                ></IconButton>

                <IconButton
                  icon={UITheme == "#ffadad" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#ffadad",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#ffadad"), Haptics.impactAsync(), setColorAsync("#ffadad")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#ffd6a5" ? "check" : ""}
                  iconColor="black"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#ffd6a5",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#ffd6a5"), Haptics.impactAsync(), setColorAsync("#ffd6a5")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#fdffb6" ? "check" : ""}
                  iconColor="black"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#fdffb6",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#fdffb6"), Haptics.impactAsync(), setColorAsync("#fdffb6")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#caffbf" ? "check" : ""}
                  iconColor="black"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#caffbf",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#caffbf"), Haptics.impactAsync(), setColorAsync("#caffbf")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#82d0f1" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#82d0f1",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#82d0f1"), Haptics.impactAsync() , setColorAsync("#82d0f1")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#a0c4ff" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#a0c4ff",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#a0c4ff"), Haptics.impactAsync();
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#bdb2ff" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#bdb2ff",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#bdb2ff"), Haptics.impactAsync(), setColorAsync("#bdb2ff")
                  }}
                ></IconButton>
                <IconButton
                  icon={UITheme == "#ffc6ff" ? "check" : ""}
                  iconColor="white"
                  style={{
                    height: 64,
                    width: 64,
                    marginLeft: 5,
                    backgroundColor: "#ffc6ff",
                    borderRadius: "100",
                  }}
                  onPress={() => {
                    setUITheme("#ffc6ff"), Haptics.impactAsync(), setColorAsync("#ffc6ff")
                  }}
                ></IconButton>
              </ScrollView>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 24,
                marginTop: 20,
                marginBottom: 15,
                fontWeight: "medium",
                color: theme ? "#fff" : "#000",
              }}
            >
              Theme
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Button
                mode={!theme ? "contained" : "outlined"}
                style={
                  !theme
                    ? {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: "#000",
                        textColor: "#fff",
                        backgroundColor: UITheme,
                        borderRadius: 20,
                        padding: 10,
                      }
                    : {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        borderRadius: 20,
                        padding: 10,
                      }
                }
                onPress={() => {
                  setThemeAsync(false)

                  setTheme(false);
                }}
              >
                <Text
                  style={
                    theme
                      ? UITheme
                      : {
                          color: isUsingBrightColors(UITheme)
                            ? "black"
                            : "white",
                        }
                  }
                >
                  Light
                </Text>
              </Button>
              <Button
                mode={theme ? "contained" : "outlined"}
                style={
                  theme
                    ? {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        backgroundColor: UITheme,
                        borderRadius: 20,
                        padding: 10,
                      }
                    : {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        borderRadius: 20,
                        padding: 10,
                      }
                }
                onPress={() => {
                  
                  setTheme(true);
                  setThemeAsync(true)
                  console.log(getThemeAsync())
                }}
              >
                <Text
                  style={
                    theme
                      ? {
                          color: isUsingBrightColors(UITheme)
                            ? "black"
                            : "white",
                        }
                      : {
                          color: isUsingBrightColors(UITheme)
                            ? "black"
                            : UITheme,
                        }
                  }
                >
                  Dark
                </Text>
              </Button>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 24,
                marginTop: 20,
                marginBottom: 15,
                fontWeight: "medium",
                color: theme ? "#fff" : "#000",
              }}
            >
              Numpad Flip
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Button
                mode={!flipNums ? "contained" : "outlined"}
                style={
                  !flipNums
                    ? {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: "#000",
                        textColor: "#fff",
                        backgroundColor: UITheme,
                        borderRadius: 20,
                        padding: 10,
                      }
                    : {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        borderRadius: 20,
                        padding: 10,
                      }
                }
                onPress={() => {
                  setFlipAsync(false)
                  setFlipNums(false);
                }}
              >
                <Text
                  style={
                    theme && flipNums
                      ? UITheme
                      : (!theme && flipNums ? {
                        color: isUsingBrightColors(UITheme)
                          ? "black"
                          : UITheme
                      } : {
                        color: isUsingBrightColors(UITheme)
                          ? "black"
                          : 'white',
                      })
                  }
                >
                  Down
                </Text>
              </Button>
              <Button
                mode={flipNums ? "contained" : "outlined"}
                style={
                  flipNums
                    ? {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        backgroundColor: UITheme,
                        borderRadius: 20,
                        padding: 10,
                      }
                    : {
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get("window").width / 2 - 40,
                        borderColor: UITheme,
                        textColor: "#fff",
                        borderRadius: 20,
                        padding: 10,
                      }
                }
                onPress={() => {
                  setFlipNums(true);
                  setFlipAsync(true)

                }}
              >
                <Text
                  style={
                    theme && !flipNums
                      ? UITheme
                      : (!theme && !flipNums ? {
                        color: isUsingBrightColors(UITheme)
                          ? "black"
                          : UITheme
                      } : {
                        color: isUsingBrightColors(UITheme)
                          ? "black"
                          : 'white',
                      })
                  }
                >
                  Up
                </Text>
              </Button>
            </View>
            <View
              style={{
                width: "100%",
                marginTop: 20,
                paddingRight: 10,
                paddingLeft: 10,
                marginBottom: 30,
              }}
            >
              <Button
                onPress={() => {
                  settingsPanelRef.current.togglePanel(), Haptics.impactAsync();
                }}
                mode="contained"
                style={{
                  width: "100%",
                  backgroundColor: UITheme,
                  marginBottom: 40,
                  borderRadius: 20,
                  padding: 10,
                  marginTop: 20,
                  borderColor: UITheme,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    color: isUsingBrightColors(UITheme) ? "black" : "white",
                  }}
                >
                  Save
                </Text>
              </Button>
            </View>
          </BottomSheet>
        </View>
      </PaperProvider>
    </View>
  );
}

const Message = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        easing: Easing.bezier(0.22, 1, 0.36, 1),

        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onHide();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        margin: 10,
        marginBottom: 5,
        color: "white",
        textAlign: "center",
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          color: props.theme ? "#fff" : "#000",
          fontSize: 20,
          textAlign: "center",
        }}
      >
        {props.message}
      </Text>
    </Animated.View>
  );
};



