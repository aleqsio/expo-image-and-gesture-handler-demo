import { Image, ImageStyle } from "expo-image";
import tilemap from "./assets/tilemap.json";
import { PixelRatio, Platform } from "react-native";

const TILEMAP_SIZE = {
  x: 1024,
  y: 2048,
};
function Tile({ name, style }: { name: string; style?: ImageStyle }) {
  const tile = tilemap.find((tile) => tile.name.includes(name));
  const offset =
    Platform.OS === "ios"
      ? {
          x:
            TILEMAP_SIZE.x / PixelRatio.get() / 2 -
            TILEMAP_SIZE.x / 2 +
            Number(tile.x),
          y:
            TILEMAP_SIZE.y / PixelRatio.get() / 2 -
            TILEMAP_SIZE.y / 2 +
            Number(tile.y),
        }
      : {
          x: TILEMAP_SIZE.x / 2 - TILEMAP_SIZE.x / 2 + Number(tile.x),
          y: TILEMAP_SIZE.y / 2 - TILEMAP_SIZE.y / 2 + Number(tile.y),
        };
  const size =
    Platform.OS === "android"
      ? {
          x: Number(tile.width) / PixelRatio.get(),
          y: Number(tile.height) / PixelRatio.get(),
        }
      : {
          x: Number(tile.width),
          y: Number(tile.height),
        };
  return (
    <Image
      source={require(`./assets/sheet.png`)}
      style={{
        ...style,
        width: size.x,
        height: size.y,
      }}
      placeholder={require(`./assets/dot.png`)}
      transition={{
        duration: 1000,
        effect: "cross-dissolve",
        timing: "ease-out",
      }}
      contentFit="none"
      contentPosition={{
        left: -offset.x,
        top: -offset.y,
      }}
    />
  );
}
export default Tile;
