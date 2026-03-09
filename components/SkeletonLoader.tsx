import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { BorderRadius, Colors, Shadows } from "@/constants/theme";

interface SkeletonLoaderProps {
  type: "chips" | "cards" | "detail";
  count?: number;
}

function SkeletonPulse({
  width,
  height,
  radius = 8,
  style,
}: {
  width: number | string;
  height: number;
  radius?: number;
  style?: any;
}) {
  const pulseAnim = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.55,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: Colors.surfaceSecondary,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <SkeletonPulse width={52} height={52} radius={18} />
        <View style={styles.cardInfo}>
          <SkeletonPulse width="55%" height={16} radius={8} />
          <SkeletonPulse
            width="32%"
            height={12}
            radius={6}
            style={{ marginTop: 8 }}
          />
          <View style={styles.tagRow}>
            <SkeletonPulse width={92} height={24} radius={12} />
            <SkeletonPulse width={74} height={24} radius={12} />
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <SkeletonPulse width="42%" height={12} radius={6} />
        <SkeletonPulse width={84} height={12} radius={6} />
      </View>
    </View>
  );
}

function SkeletonChips() {
  return (
    <View style={styles.chipsRow}>
      {[110, 90, 100, 80].map((w, i) => (
        <SkeletonPulse key={i} width={w} height={44} radius={22} />
      ))}
    </View>
  );
}

function SkeletonDetail() {
  return (
    <View style={styles.detailContainer}>
      <SkeletonPulse
        width={88}
        height={88}
        radius={24}
        style={{ alignSelf: "center" }}
      />
      <SkeletonPulse
        width={180}
        height={22}
        radius={12}
        style={{ alignSelf: "center", marginTop: 16 }}
      />
      <SkeletonPulse
        width={96}
        height={26}
        radius={14}
        style={{ alignSelf: "center", marginTop: 10 }}
      />
      <SkeletonPulse width="100%" height={126} radius={24} style={{ marginTop: 32 }} />
      <SkeletonPulse width="100%" height={78} radius={20} style={{ marginTop: 12 }} />
      <SkeletonPulse width="100%" height={78} radius={20} style={{ marginTop: 8 }} />
    </View>
  );
}

export default function SkeletonLoader({ type, count = 3 }: SkeletonLoaderProps) {
  if (type === "chips") return <SkeletonChips />;

  if (type === "detail") return <SkeletonDetail />;

  return (
    <View>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  detailContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
