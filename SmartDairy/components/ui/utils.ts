import { StyleProp } from "react-native";

type RNStyle = StyleProp<any>;

export function cn(...styles: RNStyle[]) {
  return styles.filter(Boolean);
}
