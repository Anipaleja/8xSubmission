import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { CAMPAIGNS, SUBMISSIONS } from "../data/campaigns";

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
  warning: "#A16207",
  warningSoft: "#FFF4D6",
};

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    color: COLORS.success,
    bg: COLORS.successSoft,
    border: "#C9E8D8",
  },
  rejected: {
    label: "Rejected",
    color: COLORS.danger,
    bg: COLORS.dangerSoft,
    border: "#F6C7C7",
  },
  pending: {
    label: "Under review",
    color: COLORS.warning,
    bg: COLORS.warningSoft,
    border: "#E8D8A8",
  },
};

const formatDate = (isoStr) => {
  const date = new Date(isoStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SubmissionCard = ({ submission, campaign, onPress }) => {
  const config = STATUS_CONFIG[submission.status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTop}>
        <View style={[styles.statusDot, { backgroundColor: config.bg, borderColor: config.border }]}>
          <Text style={[styles.statusDotText, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.brandName}>{campaign?.brand || "Unknown campaign"}</Text>
          <Text style={styles.briefTitle}>{campaign?.brief.title}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: config.bg, borderColor: config.border }]}>
          <Text style={[styles.statusPillText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.urlRow}>
        <Text style={styles.urlLabel}>Link</Text>
        <Text style={styles.urlText} numberOfLines={1}>
          {submission.videoUrl}
        </Text>
      </View>

      {submission.reviewNote && (
        <View style={[styles.reviewNote, { backgroundColor: config.bg, borderColor: config.border }]}>
          <Text style={[styles.reviewNoteLabel, { color: config.color }]}>Review note</Text>
          <Text style={styles.reviewNoteText}>{submission.reviewNote}</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.timestamp}>Submitted {formatDate(submission.submittedAt)}</Text>
        {submission.status === "approved" && submission.payout > 0 && (
          <Text style={styles.payoutText}>+${submission.payout} earned</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SubmissionsScreen({ navigation }) {
  const sortedSubmissions = [...SUBMISSIONS].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  const stats = {
    approved: SUBMISSIONS.filter((submission) => submission.status === "approved").length,
    rejected: SUBMISSIONS.filter((submission) => submission.status === "rejected").length,
    pending: SUBMISSIONS.filter((submission) => submission.status === "pending").length,
    earned: SUBMISSIONS.filter((submission) => submission.status === "approved").reduce(
      (acc, submission) => acc + submission.payout,
      0
    ),
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.earnedValue]}>${stats.earned}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      <FlatList
        data={sortedSubmissions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const campaign = CAMPAIGNS.find((campaignItem) => campaignItem.id === item.campaignId);
          return (
            <SubmissionCard
              submission={item}
              campaign={campaign}
              onPress={() =>
                navigation.navigate("CampaignDetail", {
                  campaignId: item.campaignId,
                  brand: campaign?.brand,
                })
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No submissions yet</Text>
            <Text style={styles.emptyBody}>
              Pick a campaign and submit your first video to start earning.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("CampaignList")}>
              <Text style={styles.emptyBtnText}>Browse campaigns</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 2,
  },
  earnedValue: {
    color: COLORS.success,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    shadowColor: "#111827",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    minWidth: 82,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  statusDotText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  briefTitle: {
    fontSize: 12,
    color: COLORS.muted,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.page,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  urlLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    width: 32,
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    fontFamily: "monospace",
  },
  reviewNote: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    gap: 4,
  },
  reviewNoteLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  reviewNoteText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.muted,
  },
  payoutText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.success,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptyBody: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: COLORS.text,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.text,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
