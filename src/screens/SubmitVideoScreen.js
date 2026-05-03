import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CAMPAIGNS } from "../data/campaigns";

const COLORS = {
  page: "#F7F4EE",
  surface: "#FFFFFF",
  border: "#E7E1D7",
  text: "#1F2937",
  muted: "#6B7280",
  accent: "#184E77",
  success: "#157347",
  successSoft: "#E6F4EE",
  danger: "#B42318",
  dangerSoft: "#FDECEC",
};

const PLATFORM_PATTERNS = [
  { name: "TikTok", pattern: /tiktok\.com/i, icon: "TT" },
  { name: "Instagram", pattern: /instagram\.com/i, icon: "IG" },
  { name: "YouTube", pattern: /youtube\.com|youtu\.be/i, icon: "YT" },
];

const detectPlatform = (url) => {
  for (const platform of PLATFORM_PATTERNS) {
    if (platform.pattern.test(url)) return platform;
  }
  return null;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return url.startsWith("http");
  } catch {
    return false;
  }
};

export default function SubmitVideoScreen({ route, navigation }) {
  const { campaignId } = route.params;
  const campaign = CAMPAIGNS.find((item) => item.id === campaignId);

  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const detectedPlatform = detectPlatform(url);
  const urlValid = isValidUrl(url) && detectedPlatform !== null;

  const handleSubmit = async () => {
    if (!urlValid) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setSubmitted(true);

    Animated.spring(successAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();

    setTimeout(() => {
      navigation.navigate("Submissions");
    }, 1800);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: successAnim,
              transform: [
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Submitted</Text>
          <Text style={styles.successBody}>
            Your video is now in review. Most campaigns are turned around within 24-48 hours.
          </Text>
          <View style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Campaign</Text>
            <Text style={styles.successDetailValue}>{campaign?.brand}</Text>
          </View>
          <View style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Platform</Text>
            <Text style={styles.successDetailValue}>
              {detectedPlatform?.name || "Selected platform"}
            </Text>
          </View>
          <View style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Potential payout</Text>
            <Text style={[styles.successDetailValue, styles.payoutHighlight]}>${campaign?.payout}</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.campaignContext}>
            <Text style={styles.contextLabel}>Submitting for</Text>
            <View style={styles.contextBrand}>
              <Text style={styles.contextEmoji}>{campaign?.brandLogo}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.contextBrandName}>{campaign?.brand}</Text>
                <Text style={styles.contextBriefTitle}>{campaign?.brief.title}</Text>
              </View>
            </View>
            <View style={styles.payoutBanner}>
              <Text style={styles.payoutBannerText}>
                Approval payout <Text style={styles.payoutBannerAmount}>${campaign?.payout}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Video URL</Text>
            <Text style={styles.inputHint}>Paste the public TikTok, Instagram Reel, or YouTube Short link.</Text>

            <View
              style={[
                styles.inputWrapper,
                urlValid && styles.inputWrapperValid,
                url.length > 0 && !urlValid && styles.inputWrapperInvalid,
              ]}
            >
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="https://www.tiktok.com/@you/video/..."
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              {detectedPlatform && (
                <View style={styles.detectedBadge}>
                  <Text style={styles.detectedText}>{detectedPlatform.icon} {detectedPlatform.name}</Text>
                </View>
              )}
            </View>

            {url.length > 0 && !urlValid && (
              <Text style={styles.validationError}>
                {!isValidUrl(url)
                  ? "Please enter a valid URL starting with https://"
                  : "Only TikTok, Instagram, or YouTube links are accepted"}
              </Text>
            )}
          </View>

          <View style={styles.platformReminder}>
            <Text style={styles.platformReminderTitle}>Accepted platforms</Text>
            <View style={styles.platformList}>
              {PLATFORM_PATTERNS.map((platform) => (
                <View
                  key={platform.name}
                  style={[
                    styles.platformItem,
                    campaign?.platforms.some((campaignPlatform) => campaignPlatform.includes(platform.name)) &&
                      styles.platformItemActive,
                  ]}
                >
                  <Text style={styles.platformItemIcon}>{platform.icon}</Text>
                  <Text style={styles.platformItemName}>{platform.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.checklist}>
            <Text style={styles.checklistTitle}>Before you submit</Text>
            {[
              "Video is publicly visible on your account",
              "Caption includes the required hashtags",
              "Video meets the minimum length requirement",
              "You have not edited or deleted it",
            ].map((item, index) => (
              <View key={index} style={styles.checklistItem}>
                <View style={styles.checkboxEmpty} />
                <Text style={styles.checklistText}>{item}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitBtn, !urlValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!urlValid || submitting}
            activeOpacity={0.9}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.submitBtnText, !urlValid && styles.submitBtnTextDisabled]}>
                Submit for review
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            Submissions are reviewed within 24-48 hours. Payout is released upon approval.
          </Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  campaignContext: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  contextBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  contextEmoji: {
    fontSize: 28,
    width: 44,
    height: 44,
    textAlign: "center",
    lineHeight: 44,
    backgroundColor: COLORS.border,
    borderRadius: 10,
  },
  contextBrandName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  contextBriefTitle: {
    fontSize: 13,
    color: COLORS.muted,
  },
  payoutBanner: {
    backgroundColor: COLORS.successSoft,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#C9E8D8",
  },
  payoutBannerText: {
    fontSize: 13,
    color: COLORS.text,
  },
  payoutBannerAmount: {
    color: COLORS.success,
    fontWeight: "800",
    fontSize: 15,
  },
  inputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 1,
  },
  inputHint: {
    fontSize: 13,
    color: COLORS.muted,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  inputWrapperValid: {
    borderColor: COLORS.success,
  },
  inputWrapperInvalid: {
    borderColor: COLORS.danger,
  },
  input: {
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  detectedBadge: {
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#C9E8D8",
  },
  detectedText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: "600",
  },
  validationError: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
  },
  platformReminder: {
    gap: 10,
  },
  platformReminderTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },
  platformList: {
    flexDirection: "row",
    gap: 10,
  },
  platformItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformItemActive: {
    borderColor: COLORS.accent,
    backgroundColor: "#DCE8F1",
  },
  platformItemIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accent,
  },
  platformItemName: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "600",
  },
  checklist: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxEmpty: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  checklistText: {
    fontSize: 13,
    color: COLORS.muted,
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  submitBtn: {
    backgroundColor: COLORS.text,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  submitBtnTextDisabled: {
    color: COLORS.muted,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successSoft,
    borderWidth: 2,
    borderColor: "#C9E8D8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successEmoji: {
    fontSize: 15,
    color: COLORS.success,
    fontWeight: "800",
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },
  successBody: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  successDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  successDetailLabel: {
    fontSize: 14,
    color: COLORS.muted,
  },
  successDetailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  payoutHighlight: {
    color: COLORS.success,
  },
});
