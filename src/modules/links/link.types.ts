export interface AffiliateLink {
  id: number;
  userId: number;
  productId: number | null;
  url: string;
  source: string | null;
  createdAt: Date;
  status: 'approved' | 'pending' | 'rejected';
  lastReviewedAt: Date | null;
  adminRemarks: string | null;
  userName?: string | null;
}

export interface AffiliateLinkWithTracking extends AffiliateLink {
  trackingUrl: string;
}

export interface CreateLinkInput {
  userId: number;
  productId?: number | null;
  url: string;
  source?: string | null;
  name?: string;
  channelLink?: string | null;
  appLink?: string | null;
  websiteLink?: string | null;
}

