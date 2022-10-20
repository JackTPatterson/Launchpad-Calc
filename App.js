import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useRef, useEffect, useState, useCallback } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
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
  useTheme
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import BottomSheet from "react-native-simple-bottom-sheet";
import Icon from "react-native-vector-icons/Feather";




export default function App() {

  

  const panelRef = useRef(false);

  const settingsPanelRef = useRef(false);

  const [panelOpacity, setPanelOpacity] = React.useState(1);




  const [isSci, setIsSci] = React.useState(true);
  const [isTrig, setIsTrig] = React.useState(false);

  const [historyCalc, setHistoryCalc] = React.useState([]);
  const [historyArr, setHistoryArr] = React.useState([]);

  const [UITheme, setUITheme] = React.useState("#82d0f1");

  const [theme, setTheme] = React.useState("dark");

  const [flipNums, setFlipNums] = React.useState(true);

  const [resultText, setResultText] = React.useState("");
  const [calculationText, setCalculationText] = React.useState("");

  const [messages, setMessages] = useState([]);

  const primaryBtnTheme = useTheme({ colors: { primary: UITheme } });

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(resultText);
  };

  function isUsingBrightColors(color) {
    return (color == '#ffd6a5' || color == '#fdffb6' || color == "#caffbf")
  }


  var calculateResult = () => {
    let result = Number(
      eval(
        calculationText
          .replaceAll("•", "*")
          .replaceAll("÷", "/")
          .replaceAll("^", "**")
          .replaceAll("^2", "**2")
          .replaceAll("^3", "**3")
          .replaceAll("π", "Math.PI")
          .replaceAll("sin(", "Math.sin(")
          .replaceAll("cos(", "Math.cos(")
          .replaceAll("tan(", "Math.tan(")
          .replaceAll("asin(", "Math.asin(")
          .replaceAll("acos(", "Math.acos(")
          .replaceAll("atan(", "Math.atan(")
      ).toFixed(5)
    );

    setResultText(result);
    setHistoryArr([...historyArr, result]);
  };

  var setCalcText = (string) => {
    if (
      string == "π" &&
      calculationText[calculationText.indexOf("π") - 1] == "•" &&
      calculationText[calculationText.indexOf("π") - 1] == "+" &&
      calculationText[calculationText.indexOf("π") - 1] == "-" &&
      calculationText[calculationText.indexOf("π") - 1] == "÷" &&
      calculationText[calculationText.indexOf("π") - 1] == "^" &&
      calculationText[calculationText.indexOf("π") - 1] == "(" &&
      calculationText[calculationText.indexOf("π") - 1] == ")"
    ) {
      setCalculationText(calculationText + "•" + string);
    } else {
      setCalculationText(calculationText + string);
    }
    console.log(calculationText);
  };

  function clearText() {
    setCalculationText("");
  }




  return (
    
    <View
      style={{ height: "100%", backgroundColor: theme ? "#121212" : "#fff" }}
    >
      
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
                    copyToClipboard();
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
                  setIsTrig(true), setIsSci(false), Haptics.selectionAsync();
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
                  disabled={calculationText.length > 0 ? false : true}
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"⌫"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      setCalculationText(
                        calculationText.substring(0, calculationText.length - 1)
                      );
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="division"
                  onPress={() => {
                    setCalcText("÷");
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
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="close"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("•");
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
                  disabled={calculationText.length > 0 ? false : true}
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
                  disabled={calculationText.length > 0 ? false : true}
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
                  disabled={calculationText.length > 0 ? false : true}
                  iconColor="#fff"
                  style={[styles.equalsBtn, { backgroundColor: UITheme }]}
                  icon="equal"
                  onPress={() => {
                    setHistoryCalc(calculationText);

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
                  disabled={calculationText.length > 0 ? false : true}
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"⌫"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      setCalculationText(
                        calculationText.substring(0, calculationText.length - 1)
                      );
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="division"
                  onPress={() => {
                    setCalcText("÷");
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
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="close"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("•");
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
                  disabled={calculationText.length > 0 ? false : true}
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
                  disabled={calculationText.length > 0 ? false : true}
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
                  disabled={calculationText.length > 0 ? false : true}
                  iconColor="#fff"
                  style={[styles.equalsBtn, { backgroundColor: UITheme }]}
                  icon="equal"
                  onPress={() => {
                    setHistoryCalc(calculationText);

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
                  disabled={calculationText.length > 0 ? false : true}
                  theme={theme}
                  text={"-"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("-");
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"⌫"}
                  style={styles.regularBtn}
                  onLongPress={() => {
                    setCalculationText("");
                  }}
                  onPress={() => {
                    if (calculationText.length > 0) {
                      setCalculationText(
                        calculationText.substring(0, calculationText.length - 1)
                      );
                    } else {
                      setResultText("");
                    }

                    Haptics.selectionAsync();
                  }}
                ></CircleButton>

                <IconButton
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  icon="division"
                  iconColor={theme ? "#fff" : "#000"}
                  onPress={() => {
                    setCalcText("÷");
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CircleButton
                  theme={theme}
                  text={"("}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText(")");
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
                <IconButton style={styles.blankBtn} />

                <IconButton
                  disabled={calculationText.length > 0 ? false : true}
                  style={theme ? styles.darkSymbolBtn : styles.symbolBtn}
                  iconColor={theme ? "#fff" : "#000"}
                  icon="close"
                  onPress={() => {
                    setCalculationText(calculationText + "•"),
                      Haptics.selectionAsync();
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  text={"x^3"}
                  style={styles.regularBtn}
                  onPress={() => {
                    setCalcText("^3");
                  }}
                />
                <CircleButton
                  disabled={calculationText.length > 0 ? false : true}
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
                    clearText(), Haptics.selectionAsync();
                  }}
                />
                <CircleButton
                  theme={theme}
                  text={"tan"}
                  style={styles.regularBtn}
                  onPress={() => {
                    //setResultText(Math.tan(eval(calculationText)).toFixed(5)),
                    setCalcText("tan(");
                    clearText(), Haptics.selectionAsync();
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
                  disabled={calculationText.length > 0 ? false : true}
                  iconColor="#fff"
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
            sliderMaxHeight={Dimensions.get("window").height * 0.8}
            sliderMinHeight={0}
            animationDuration={600}
            animation={Easing.bezier(0.22, 1, 0.36, 1)}
            wrapperStyle={{ backgroundColor: theme ? "#1e1e1e" : "#fff", opacity: panelOpacity }}
            
            ref={(ref) => (panelRef.current = ref)}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 20,
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
              <IconButton iconColor={theme ? "white": "black"} onPress={() => {panelRef.current.togglePanel(), Haptics.impactAsync()}} icon="close">

              </IconButton>
            </View>

            <View
              style={{
                display: "flex",
                paddingTop: 30,
              }}
            >
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
                    <Text
                      style={{
                        fontSize: 20,
                        color: theme ? "#fff" : "#000",
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                );
              })}
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                }}
              ></View>
            </View>
            <View style={{marginLeft: 5,
                marginRight: 5,}}>
            <Button
              onPress={() => {
                panelRef.current.togglePanel(), Haptics.impactAsync(), setHistoryArr([]);
              }}
              style={{
                width: "100%",
                backgroundColor: "#ff686b",
                marginBottom: 40,
                
                borderRadius: 20,
                padding: 10,
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 20, color: "white" }}
              >
                Clear History
              </Text>

            </Button>
            </View>
            
          </BottomSheet>
        </View>
        <View style={{ flex: 0 }}>
          <BottomSheet
            animationDuration={600}
            animation={Easing.bezier(0.22, 1, 0.36, 1)}
            wrapperStyle={{ backgroundColor: theme ? "#1e1e1e" : "#fff", opacity: panelOpacity }}
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
                paddingRight: 20,
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
              <IconButton iconColor={theme ? "white": "black"} onPress={() => {settingsPanelRef.current.togglePanel(), Haptics.impactAsync()}} icon="close">

              </IconButton>
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
                    setUITheme("#ff686b"), Haptics.impactAsync();
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
                    setUITheme("#ffadad"), Haptics.impactAsync();
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
                    setUITheme("#ffd6a5"), Haptics.impactAsync();
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
                    setUITheme("#fdffb6"), Haptics.impactAsync();
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
                    setUITheme("#caffbf"), Haptics.impactAsync();
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
                    setUITheme("#82d0f1"), Haptics.impactAsync();
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
                    setUITheme("#bdb2ff"), Haptics.impactAsync();
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
                    setUITheme("#ffc6ff"), Haptics.impactAsync();
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
                  !theme ? {
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width / 2 - 40,
                    borderColor: "#000",
                    textColor: "#fff",
                    backgroundColor: UITheme,
                    borderRadius: 20,
                    padding: 10,
                  } : {
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
                  setTheme(false)
                }}
              >
                <Text
                  style={
                    theme ? {color: isUsingBrightColors(UITheme) ? UITheme : UITheme} : {color: isUsingBrightColors(UITheme) ? "black" : 'white'}
                  }
                >
                  Light
                </Text>
              </Button>
              <Button
                mode={theme ? "contained" : "outlined"}
                style={
                  theme ? {
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width / 2 - 40,
                    borderColor: UITheme,
                    textColor: "#fff",
                    backgroundColor: UITheme,
                    borderRadius: 20,
                    padding: 10,

                  } : {
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
                  setTheme(true)
                }}
              >
                <Text 
                  style={
                    theme ? {color: isUsingBrightColors(UITheme) ? 'black' : 'white'} : {color: isUsingBrightColors(UITheme) ? 'black' : UITheme}
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
                mode={flipNums ? "contained" : "outlined"}
                style={
                  flipNums ? {
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width / 2 - 40,
                    borderColor: "#000",
                    textColor: "#fff",
                    backgroundColor: UITheme,
                    borderRadius: 20,
                    padding: 10,
                  } : {
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
                  setFlipNums(true)
                }}
              >
                <Text
                  style={
                    !flipNums ? {color: isUsingBrightColors(UITheme) ? UITheme : UITheme} : {color: isUsingBrightColors(UITheme) ? "black" : 'white'}
                  }
                >
                  Up
                </Text>
              </Button>
              <Button
                mode={!flipNums ? "contained" : "outlined"}
                style={
                  !flipNums ? {
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get("window").width / 2 - 40,
                    borderColor: UITheme,
                    textColor: "#fff",
                    backgroundColor: UITheme,
                    borderRadius: 20,
                    padding: 10,

                  } : {
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
                  setFlipNums(false)
                }}
              >
                <Text 
                  style={
                    !flipNums ? {color: isUsingBrightColors(UITheme) ? 'black' : 'white'} : {color: isUsingBrightColors(UITheme) ? 'black' : UITheme}
                  }
                >
                  Down
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
                  style={{ textAlign: "center", fontSize: 20, color: isUsingBrightColors(UITheme) ? 'black' : 'white'}  }
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

const CircleButton = (props) => (
  <TouchableHighlight
    onLongPress={props.onLongPress}
    disabled={props.disabled}
    activeOpacity={0.6}
    underlayColor="#DDDDDD"
    style={styles.regularBtn}
    onPress={props.onPress}
  >
    <Text
      style={[
        props.theme
          ? !props.disabled
            ? styles.btnDarkText
            : styles.btnDisabledText
          : !props.disabled
          ? styles.btnText
          : styles.btnDarkDisabledText,
      ]}
    >
      {props.text}
    </Text>
    
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  symbolBtn: {
    backgroundColor: "#efefee",
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: "bold",
  },

  darkSymbolBtn: {
    backgroundColor: "#1e1e1e",
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: "bold",
  },

  blankBtn: {
    backgroundColor: "transparent",
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: "bold",
  },

  regularBtn: {
    backgroundColor: "transparent",
    height: 60,
    width: 60,
    borderRadius: 100,
    textColor: "#000",
    marginLeft: 15,
    marginRight: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  darkBtn: {
    backgroundColor: "#fff",
    height: 60,
    width: 60,
    borderRadius: 100,
    marginLeft: 15,
    marginRight: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  equalsBtn: {
    height: 60,
    width: 60,
    borderRadius: 100,
    textColor: "#fff",
    marginLeft: 15,
    marginRight: 15,
  },

  trigText: {
    color: "#000",
    fontSize: 10,
  },

  btnText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDarkText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  acText: {
    fontSize: 25,
    fontWeight: "semibold",
    textAlign: "center",
  },

  inactiveModeBtn: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2 - 40,
    borderColor: "#000",
    textColor: "#000",
    marginBottom: 10,
  },

  activeModeBtn: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2 - 40,
    borderColor: "#000",
    textColor: "#fff",
    backgroundColor: "#000",
    marginBottom: 10,
  },

  inactiveModeDarkBtn: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2 - 40,
    borderColor: "#fff",
    textColor: "#fff",
    marginBottom: 10,
  },

  activeModeDarkBtn: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2 - 40,
    borderColor: "#000",
    textColor: "#000",
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  activeModeDarkBtn: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2 - 40,
    borderColor: "#000",
    textColor: "#000",
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  activeModeText: {
    color: "#fff",
    fontSize: 15,
  },

  inactiveModeText: {
    color: "#000",
    fontSize: 15,
  },

  activeModeDarkText: {
    color: "#000",
    fontSize: 15,
  },

  inactiveModeDarkText: {
    color: "#fff",
    fontSize: 15,
  },

  btnDisabledText: {
    color: "#efefee",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  btnDarkDisabledText: {
    color: "#f3f1f6",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  equalsText: {
    color: "#fff",
    fontSize: 30,
  },
});
