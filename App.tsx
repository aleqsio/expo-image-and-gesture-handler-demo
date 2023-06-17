import { StatusBar } from "expo-status-bar";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import Tile from "./Tile";
import tilemap from "./assets/tilemap.json";
import { useEffect, useReducer, useRef } from "react";
import { ImageStyle } from "expo-image";
import { runOnUI } from "react-native-reanimated";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Drawer from "./Drawer";
import { cleanupAll } from "./DraggableContainer";
import { LinearGradient } from "expo-linear-gradient";

export function TileOfSize({
  x,
  y,
  style,
  index,
}: {
  x: string;
  y: string;
  style?: ImageStyle;
  index?: number;
}) {
  const matchingTiles = tilemap.filter(
    (tile) => tile.width === x && tile.height === y
  );
  if (!matchingTiles.length) return null;
  const name = matchingTiles[index ?? 0].name;
  // const name = useRandomTiles(matchingTiles).name;

  return <Tile name={name} style={style} />;
}

function useRandomTiles(options: typeof tilemap) {
  const [currentNameIndex, next] = useReducer(
    (n) => n + 1,
    Math.round(Math.random() * options.length)
  );
  useEffect(() => {
    const i = setInterval(() => {
      next();
    }, 300);
    return () => clearInterval(i);
  }, []);
  return options[currentNameIndex & (options.length - 1)];
}

export default function App() {
  return (
    <LinearGradient
      colors={["#2980b9", "#6dd5fa", "#ffffff"]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: -0.2 }}
      style={{ flex: 1 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar style="auto" />
        </View>

        <Drawer />
      </GestureHandlerRootView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
