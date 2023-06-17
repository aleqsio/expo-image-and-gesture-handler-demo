import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import Tile from "./Tile";
import { DraggableContainer, cleanupAll } from "./DraggableContainer";
import { Fragment, useState } from "react";
import tilemap from "./assets/tilemap.json";
function Drawer() {
  const categories = [
    {
      name: "Ground floor",
      tiles: tilemap.filter((tile) => Number(tile.height) > 125),
    },
    {
      name: "Floors",
      tiles: tilemap.filter(
        (tile) => Number(tile.height) < 125 && Number(tile.height) > 80
      ),
      offset: 0,
      drawerTopOffset: -20,
    },
    {
      name: "Ceilings",
      tiles: tilemap.filter(
        (tile) => Number(tile.height) < 80 && Number(tile.height) > 50
      ),
      offset: 0,
      drawerTopOffset: -35,
    },
  ];
  const [offset, setOffset] = useState(0);
  const [zIndexOrder, setZIndexOrder] = useState([]);
  return (
    <View style={styles.container}>
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      ></View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          margin: 10,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="🎲"
          onPress={() => {
            setOffset((o) => (o < 5 ? o + 1 : 0));
          }}
        />
        <Button
          title="🗑️"
          onPress={() => {
            cleanupAll();
          }}
        />
        {categories.map((category, i) => (
          <Fragment key={category.name}>
            {category.tiles.slice(offset, offset + 11).map((tile, i) => (
              <View
                style={{
                  height: 32,
                  width: 32,
                  margin: 5,
                  zIndex: -zIndexOrder.indexOf(category.name + i),
                }}
                pointerEvents="box-none"
                key={category.name + i}
              >
                <DraggableContainer
                  onBringToFront={() => {
                    setZIndexOrder((zIndexOrder) => [
                      category.name + i,
                      ...zIndexOrder.filter((z) => z !== category.name + i),
                    ]);
                  }}
                  gridOffset={category.offset || 0}
                  drawerTopOffset={category.drawerTopOffset || 0}
                >
                  <Tile name={tile.name} />
                </DraggableContainer>
              </View>
            ))}
          </Fragment>
        ))}
      </View>
      <Text style={{ marginLeft: 20, color: "#777" }}>@aleqsio 💛</Text>
      <Text style={{ marginLeft: 20, marginTop: 5, color: "#aaa" }}>
        sprites by kenney.nl ✨
      </Text>
    </View>
  );
}

export default Drawer;
const styles = StyleSheet.create({
  container: {
    height: 370,
    backgroundColor: "#fff",
    shadowOpacity: 0.3,
    shadowColor: "#000",
    shadowRadius: 10,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
