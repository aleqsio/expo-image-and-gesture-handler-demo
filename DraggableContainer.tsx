import { ImageStyle } from "expo-image";
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { useEffect } from "react";

export const grid = {
  x: 66,
  y: 33,
};

export const height = Dimensions.get("screen").height;

const cleanupHandlers = new Set<() => void>();
export const cleanupAll = () => {
  cleanupHandlers.forEach((handler) => handler());
};

export function DraggableContainer({
  children,
  style,
  onBringToFront,
  gridOffset,
  drawerTopOffset,
}: {
  children: React.ReactNode;
  style?: ImageStyle;
  gridOffset?: number;
  drawerTopOffset?: number;
  onBringToFront?: () => void;
}) {
  const drawerOffset = {
    x: 49,
    y: 49 + drawerTopOffset,
  };
  function nearestGridPoint(
    { x, y }: { x: number; y: number },
    { pageX: xinit, pageY: yinit, height }: any
  ) {
    "worklet";
    return {
      x: Math.round((x + xinit) / grid.x) * grid.x - xinit,
      y:
        Math.round((y + yinit - gridOffset) / grid.y) * grid.y -
        yinit +
        gridOffset,
    };
  }

  useEffect(() => {
    const cleanup = () => {
      offset.value = { x: 0, y: 0 };
      isPressed.value = false;
      isInDrawer.value = true;
      start.value = { x: 0, y: 0 };
    };
    cleanupHandlers.add(cleanup);
    return () => {
      cleanupHandlers.delete(cleanup);
    };
  }, []);

  const isPressed = useSharedValue(false);
  const isInDrawer = useSharedValue(true);
  const zIndex = useSharedValue(0);

  const offset = useSharedValue({ x: 0, y: 0 });
  const initialPosition = useSharedValue({ x: 0, y: 0, pageX: 0, pageY: 0 });
  const animatedRef = useAnimatedRef();
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            offset.value.x - (isInDrawer.value ? drawerOffset.x : 0)
          ),
        },
        {
          translateY: withSpring(
            offset.value.y - (isInDrawer.value ? drawerOffset.y : 0)
          ),
        },
        { scale: withSpring(isInDrawer.value ? 0.25 : 1) },
      ],
      zIndex: isPressed ? -4000 : zIndex.value,
      shadowOpacity: withSpring(isPressed.value ? 0.3 : 0),
    };
  });
  const start = useSharedValue({ x: 0, y: 0 });
  const gesture = Gesture.Pan()
    .onBegin((e) => {
      if (isInDrawer.value) {
        initialPosition.value = measure(animatedRef);
      }
      runOnJS(onBringToFront)?.();
      isPressed.value = true;
    })
    .onUpdate((e) => {
      offset.value = nearestGridPoint(
        {
          x: e.translationX + start.value.x,

          // (e.absoluteX - initialPosition.value.pageX),
          y: e.translationY + start.value.y,
        },
        initialPosition.value
      );
      isInDrawer.value = height - e.absoluteY < 400;
    })
    .onEnd(() => {
      start.value = isInDrawer.value
        ? { x: 0, y: 0 }
        : nearestGridPoint(
            {
              x: offset.value.x,
              y: offset.value.y,
            },
            initialPosition.value
          );
      offset.value = start.value;
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedRef}
        style={[
          {
            shadowColor: "#000",
            shadowRadius: 20,
            // shadowOpacity: 0.5,
            width: 132,
            alignItems: "center",
            // ...style,
          },
          animatedStyles,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
