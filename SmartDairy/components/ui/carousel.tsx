import * as React from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

/* ======================================================
   Types
====================================================== */
type Orientation = "horizontal" | "vertical";

type CarouselContextProps = {
  scrollRef: React.RefObject<ScrollView | null>;
  orientation: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};


const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) {
    throw new Error("useCarousel must be used inside <Carousel />");
  }
  return ctx;
}

/* ======================================================
   Carousel
====================================================== */
type CarouselProps = {
  orientation?: Orientation;
  children: React.ReactNode;
};

export function Carousel({
  orientation = "horizontal",
  children,
}: CarouselProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [containerSize, setContainerSize] = React.useState(0);
  const [contentSize, setContentSize] = React.useState(0);
  const [offset, setOffset] = React.useState(0);

  const canScrollPrev = offset > 0;
  const canScrollNext = offset + containerSize < contentSize;

  const scrollPrev = () => {
    scrollRef.current?.scrollTo({
      x: orientation === "horizontal" ? Math.max(offset - containerSize, 0) : 0,
      y: orientation === "vertical" ? Math.max(offset - containerSize, 0) : 0,
      animated: true,
    });
  };

  const scrollNext = () => {
    scrollRef.current?.scrollTo({
      x:
        orientation === "horizontal"
          ? Math.min(offset + containerSize, contentSize)
          : 0,
      y:
        orientation === "vertical"
          ? Math.min(offset + containerSize, contentSize)
          : 0,
      animated: true,
    });
  };

  return (
    <CarouselContext.Provider
      value={{
        scrollRef,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <View style={styles.carousel}>
        <ScrollView
          ref={scrollRef}
          horizontal={orientation === "horizontal"}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onLayout={(e: LayoutChangeEvent) =>
            setContainerSize(
              orientation === "horizontal"
                ? e.nativeEvent.layout.width
                : e.nativeEvent.layout.height,
            )
          }
          onContentSizeChange={(w, h) =>
            setContentSize(orientation === "horizontal" ? w : h)
          }
          onScroll={(e) =>
            setOffset(
              orientation === "horizontal"
                ? e.nativeEvent.contentOffset.x
                : e.nativeEvent.contentOffset.y,
            )
          }
          scrollEventThrottle={16}
        >
          <View
            style={[
              styles.track,
              orientation === "vertical" && styles.trackVertical,
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </View>
    </CarouselContext.Provider>
  );
}

/* ======================================================
   CarouselContent (alias – optional wrapper)
====================================================== */
export function CarouselContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ======================================================
   CarouselItem
====================================================== */
export function CarouselItem({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const { orientation } = useCarousel();

  return (
    <View
      style={[
        styles.item,
        orientation === "vertical" && styles.itemVertical,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ======================================================
   CarouselPrevious
====================================================== */
export function CarouselPrevious() {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Pressable
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      style={[styles.navButton, !canScrollPrev && styles.disabled]}
    >
      <ArrowLeft size={18} />
    </Pressable>
  );
}

/* ======================================================
   CarouselNext
====================================================== */
export function CarouselNext() {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Pressable
      onPress={scrollNext}
      disabled={!canScrollNext}
      style={[styles.navButton, !canScrollNext && styles.disabled]}
    >
      <ArrowRight size={18} />
    </Pressable>
  );
}

/* ======================================================
   Styles
====================================================== */
const styles = StyleSheet.create({
  carousel: {
    position: "relative",
  },

  track: {
    flexDirection: "row",
  },

  trackVertical: {
    flexDirection: "column",
  },

  item: {
    width: "100%",
    paddingRight: 16,
  },

  itemVertical: {
    paddingBottom: 16,
  },

  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.4,
  },
});
