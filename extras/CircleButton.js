import {
    Text,
    TouchableHighlight,
  } from "react-native";

import styles from "./styles";


const CircleButton = (props) => (
    <TouchableHighlight
      onLongPress={props.onLongPress}
      disabled={props.disabled}
      activeOpacity={0.6}
      underlayColor={props.theme ? "#212121" : "#DDDDDD"}
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

  export default CircleButton;