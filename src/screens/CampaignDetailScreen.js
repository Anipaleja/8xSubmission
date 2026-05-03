import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { CAMPAIGNS, SUBMISSIONS } from "../data/campaigns";

const COLORS = {
  page: "#F7F4EE",
  surface: "#FFFFFF",
  surfaceSoft: "#FAF8F4",
  border: "#E7E1D7",
  text: "#1F2937",
  muted: "#6B7280",
  accent: "#184E77",
  success: "#157347",
  successSoft: "#E6F4EE",
  danger: "#B42318",
  dangerSoft: "#FDECEC",
  warning: "#A16207",
  warningSoft: "#FFF4D6",
};

const SectionHeader = ({ title }) => <Text style={styles.sectionHeader}>{title}</Text>;

const CheckItem = ({ text, type = "do" }) => (
  <View style={styles.checkItem}>
    <View style={[styles.checkMark, type === "do" ? styles.checkMarkGood : styles.checkMarkBad]}>
      <Text style={[styles.checkIcon, type === "do" ? styles.doIcon : styles.dontIcon]}>
        {type === "do" ? "✓" : "−"}
      </Text>
    </View>
    <Text style={[styles.checkText, type === "dont" && styles.dontText]}>{text}</Text>
  </View>
);

const ExampleVideoCard = ({ video }) => (
  <View style={styles.videoCard}>
    <View style={styles.videoThumbnailWrapper}>
      <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} resizeMode="cover" />
      <View style={styles.playOverlay}>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.viewsBadge}>
        <Text style={styles.viewsText}>{video.views}</Text>
      </View>
    </View>
    <View style={styles.videoMeta}>
      <Text style={styles.videoCreator}>{video.creator}</Text>
      <Text style={styles.videoNote}>{video.note}</Text>
    </View>
  </View>
);

const statusLabel = (status) => {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Under review";
};

export default function CampaignDetailScreen({ route, navigation }) {
  const { campaignId } = route.params;
  const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
  const submission = SUBMISSIONS.find((s) => s.campaignId === campaignId);
  const [activeTab, setActiveTab] = useState("brief");

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Campaign not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, { backgroundColor: campaign.brandColor + "12" }]}>
          <View style={[styles.heroLogo, { backgroundColor: campaign.brandColor + "18" }]}>
            <Text style={styles.heroLogoEmoji}>{campaign.brandLogo}</Text>
          </View>
          <Text style={styles.heroTitle}>{campaign.brand}</Text>
          <Text style={styles.heroSubtitle}>{campaign.brief.title}</Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>${campaign.payout}</Text>
              <Text style={styles.heroStatLabel}>Per video</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{campaign.spotsLeft}</Text>
              <Text style={styles.heroStatLabel}>Spots left</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{campaign.quota}</Text>
              <Text style={styles.heroStatLabel}>Videos / creator</Text>
            </View>
          </View>
        </View>

        <View style={styles.platformsRow}>
          <Text style={styles.platformsLabel}>Platforms</Text>
          <View style={styles.platformBadges}>
            {campaign.platforms.map((platform) => (
              <View key={platform} style={styles.platformBadge}>
                <Text style={styles.platformBadgeText}>{platform}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tabBar}>
          {[
            { key: "brief", label: "Brief" },
            { key: "examples", label: `Examples (${campaign.exampleVideos.length})` },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "brief" && (
          <View style={styles.section}>
            <SectionHeader title="Overview" />
            <Text style={styles.overview}>{campaign.brief.overview}</Text>

            <SectionHeader title="Requirements" />
            <View style={styles.checkList}>
              {campaign.brief.requirements.map((item, index) => (
                <CheckItem key={index} text={item} type="do" />
              ))}
            </View>

            <SectionHeader title="Do not" />
            <View style={styles.checkList}>
              {campaign.brief.doNot.map((item, index) => (
                <CheckItem key={index} text={item} type="dont" />
              ))}
            </View>

            <View style={styles.noteCard}>
              <View style={styles.notePill}>
                <Text style={styles.notePillText}>Note</Text>
              </View>
              <View style={styles.noteCopy}>
                <Text style={styles.noteTitle}>Spark code</Text>
                <Text style={styles.noteBody}>{campaign.brief.spark_code}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "examples" && (
          <View style={styles.section}>
            <Text style={styles.examplesIntro}>
              Review these references for pacing and structure. Keep the tone similar without copying them directly.
            </Text>
            <View style={styles.videoGrid}>
              {campaign.exampleVideos.map((video) => (
                <ExampleVideoCard key={video.id} video={video} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {submission ? (
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                submission.status === "approved" && styles.statusApproved,
                submission.status === "rejected" && styles.statusRejected,
                submission.status === "pending" && styles.statusPending,
              ]}
            >
              <View>
                <Text style={styles.statusTitle}>{statusLabel(submission.status)}</Text>
                <Text style={styles.statusNote} numberOfLines={1}>
                  {submission.reviewNote || "Usually reviewed within 24-48 hours"}
                </Text>
              </View>
            </View>
            {submission.status === "rejected" && (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("SubmitVideo", { campaignId: campaign.id })}
              >
                <Text style={styles.secondaryBtnText}>Resubmit</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.navigate("SubmitVideo", { campaignId: campaign.id })}
            activeOpacity={0.9}
          >
            <Text style={styles.submitBtnText}>Submit video</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  heroLogo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroLogoEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 20,
    textAlign: "center",
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroStat: {
    alignItems: "center",
    paddingHorizontal: 14,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  platformsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  platformsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
  },
  platformBadges: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  platformBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformBadgeText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.9,
    marginBottom: 10,
    marginTop: 18,
  },
  overview: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 23,
  },
  checkList: {
    gap: 8,
  },
  checkItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  checkMark: {
    width: 18,
    height: 18,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkMarkGood: {
    backgroundColor: COLORS.successSoft,
  },
  checkMarkBad: {
    backgroundColor: COLORS.dangerSoft,
  },
  checkIcon: {
    fontSize: 11,
    fontWeight: "800",
  },
  doIcon: {
    color: COLORS.success,
  },
  dontIcon: {
    color: COLORS.danger,
  },
  checkText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  dontText: {
    color: COLORS.muted,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.warningSoft,
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E8D8A8",
  },
  notePill: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF9E8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  notePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.warning,
  },
  noteCopy: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  noteBody: {
    fontSize: 13,
    color: COLORS.muted,
  },
  examplesIntro: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
    marginBottom: 16,
  },
  videoGrid: {
    gap: 16,
  },
  videoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  videoThumbnailWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17,24,39,0.16)",
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 18,
    color: COLORS.text,
    marginLeft: 3,
  },
  viewsBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewsText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  videoMeta: {
    padding: 14,
  },
  videoCreator: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  videoNote: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 19,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.page,
  },
  submitBtn: {
    backgroundColor: COLORS.text,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statusContainer: {
    gap: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusApproved: {
    backgroundColor: COLORS.successSoft,
    borderColor: "#C9E8D8",
  },
  statusRejected: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: "#F6C7C7",
  },
  statusPending: {
    backgroundColor: COLORS.warningSoft,
    borderColor: "#E8D8A8",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  statusNote: {
    fontSize: 13,
    color: COLORS.muted,
  },
  secondaryBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryBtnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    padding: 20,
    color: COLORS.text,
  },
});
