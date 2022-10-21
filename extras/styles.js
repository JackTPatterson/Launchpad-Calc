import {
    StyleSheet,

    Dimensions,

  } from "react-native";

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
      fontSize: 30,
    },
  });
  

  export default styles;