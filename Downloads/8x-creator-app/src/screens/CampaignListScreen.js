import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
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
  warning: "#A16207",
  danger: "#B42318",
};

const formatDeadline = (dateStr) => {
  const deadline = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Expired";
  if (diffDays === 1) return "1 day left";
  if (diffDays <= 7) return `${diffDays} days left`;
  return deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getDeadlineColor = (dateStr) => {
  const deadline = new Date(dateStr);
  const diffDays = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 2) return COLORS.danger;
  if (diffDays <= 5) return COLORS.warning;
  return COLORS.success;
};

const CampaignCard = ({ item, onPress, submissionStatus }) => {
  const deadlineColor = getDeadlineColor(item.deadline);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={[styles.brandLogo, { backgroundColor: item.brandColor + "14" }]}>
          <Text style={styles.brandLogoEmoji}>{item.brandLogo}</Text>
        </View>
        <View style={styles.brandInfo}>
          <Text style={styles.brandName}>{item.brand}</Text>
          <View style={styles.platformRow}>
            {item.platforms.map((platform) => (
              <View key={platform} style={styles.platformTag}>
                <Text style={styles.platformText}>{platform}</Text>
              </View>
            ))}
          </View>
        </View>
        {submissionStatus && (
          <View
            style={[
              styles.submissionBadge,
              submissionStatus === "approved" && styles.badgeApproved,
              submissionStatus === "rejected" && styles.badgeRejected,
              submissionStatus === "pending" && styles.badgePending,
            ]}
          >
            <Text style={styles.submissionBadgeText}>
              {submissionStatus === "approved"
                ? "Approved"
                : submissionStatus === "rejected"
                  ? "Rejected"
                  : "Pending"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.payoutLabel}>PAYOUT PER VIDEO</Text>
          <Text style={styles.payoutAmount}>${item.payout}</Text>
        </View>
        <View style={styles.deadlineBlock}>
          <View style={[styles.deadlineDot, { backgroundColor: deadlineColor }]} />
          <View>
            <Text style={styles.deadlineLabel}>DEADLINE</Text>
            <Text style={[styles.deadlineValue, { color: deadlineColor }]}>
              {formatDeadline(item.deadline)}
            </Text>
          </View>
        </View>
        <View style={styles.spotsBlock}>
          <Text style={styles.spotsLabel}>SPOTS LEFT</Text>
          <Text style={styles.spotsValue}>{item.spotsLeft}</Text>
        </View>
      </View>

      <View style={styles.briefPreview}>
        <Text style={styles.briefPreviewText}>{item.brief.title}</Text>
        <Text style={styles.arrowText}>View brief</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function CampaignListScreen({ navigation }) {
  const [filter, setFilter] = useState("all");

  const submissionMap = {};
  SUBMISSIONS.forEach((submission) => {
    submissionMap[submission.campaignId] = submission.status;
  });

  const filters = ["all", "new", "submitted"];
  const filtered = CAMPAIGNS.filter((campaign) => {
    if (filter === "submitted") return !!submissionMap[campaign.id];
    if (filter === "new") return !submissionMap[campaign.id];
    return true;
  });

  const totalEarned = SUBMISSIONS.filter((submission) => submission.status === "approved")
    .reduce((acc, submission) => acc + submission.payout, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Your campaigns</Text>
          <Text style={styles.headerTitle}>Open briefs</Text>
        </View>
        <TouchableOpacity style={styles.submissionsBtn} onPress={() => navigation.navigate("Submissions")}>
          <Text style={styles.submissionsBtnText}>Submissions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.earningsBanner}>
        <View>
          <Text style={styles.earningsLabel}>TOTAL EARNED</Text>
          <Text style={styles.earningsAmount}>${totalEarned.toLocaleString()}</Text>
        </View>
        <View style={styles.earningsDivider} />
        <View>
          <Text style={styles.earningsLabel}>SUBMITTED</Text>
          <Text style={styles.earningsAmount}>{SUBMISSIONS.length}</Text>
        </View>
        <View style={styles.earningsDivider} />
        <View>
          <Text style={styles.earningsLabel}>PENDING</Text>
          <Text style={styles.earningsAmount}>
            {SUBMISSIONS.filter((submission) => submission.status === "pending").length}
          </Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === "all" ? "All" : f === "new" ? "New" : "Submitted"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CampaignCard
            item={item}
            submissionStatus={submissionMap[item.id]}
            onPress={() =>
              navigation.navigate("CampaignDetail", {
                campaignId: item.id,
                brand: item.brand,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No campaigns here yet.</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginBottom: 3,
    letterSpacing: 0.4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.6,
  },
  submissionsBtn: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submissionsBtnText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  earningsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  earningsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  earningsDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#111827",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brandLogoEmoji: {
    fontSize: 20,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  platformRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  platformTag: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  platformText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },
  submissionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeApproved: {
    backgroundColor: "#E6F4EE",
    borderColor: "#C9E8D8",
  },
  badgeRejected: {
    backgroundColor: "#FDECEC",
    borderColor: "#F6C7C7",
  },
  badgePending: {
    backgroundColor: "#FFF4D6",
    borderColor: "#E8D8A8",
  },
  submissionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  payoutLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  payoutAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  deadlineBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deadlineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  deadlineLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  deadlineValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  spotsBlock: {
    alignItems: "flex-end",
  },
  spotsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  spotsValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },
  briefPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  briefPreviewText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },
  arrowText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.muted,
  },
});
