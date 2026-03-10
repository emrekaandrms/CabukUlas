import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { BorderRadius, Colors, Motion, Typography } from "@/constants/theme";

export default function SplashAnimation() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const signalScaleX = useRef(new Animated.Value(0.32)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(15)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: Motion.duration.standard,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          ...Motion.spring.gentle,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: Motion.duration.quick,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration: Motion.duration.quick,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: Motion.duration.quick,
          useNativeDriver: true,
        }),
        Animated.timing(signalScaleX, {
          toValue: 1,
          duration: Motion.duration.screen,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logoText}>Ç</Text>
      </Animated.View>

      <Animated.Text
        style={[
          styles.brandName,
          {
            opacity: nameOpacity,
            transform: [{ translateY: nameTranslateY }],
          },
        ]}
      >
        ÇabukUlaş
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        En doğru sıradaki adıma sakin ve hızlı ulaş
      </Animated.Text>

      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingDot,
            {
              opacity: taglineOpacity,
              transform: [{ scaleX: signalScaleX }],
            },
          ]}
        />
        <Text style={styles.loadingText}>Veriler hazırlanıyor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
  logoText: {
    fontSize: 44,
    fontWeight: "800",
    color: Colors.textInverse,
    marginTop: -2,
  },
  brandName: {
    ...Typography.screenTitle,
    marginTop: 24,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 72,
    alignItems: "center",
  },
  loadingDot: {
    width: 88,
    height: 4,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  loadingText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginTop: 10,
  },
});
