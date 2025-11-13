import { CreateLinkInput, AffiliateLink, AffiliateLinkWithTracking } from './link.types';
import * as repository from './link.repository';
import * as affiliateRepository from '../affiliates/affiliate.repository';
import * as notificationService from '../notifications/notification.service';
import { buildTrackingUrl } from './link.helpers';

const withTrackingUrl = (link: AffiliateLink): AffiliateLinkWithTracking => ({
  ...link,
  trackingUrl: buildTrackingUrl(link.url, link.id),
});

export const listLinks = async (query: Record<string, string>) => {
  const result = await repository.listLinks(query);
  return {
    ...result,
    data: result.data.map(withTrackingUrl),
  };
};

export const createLink = async (payload: CreateLinkInput): Promise<AffiliateLinkWithTracking> => {
  const { userId, name, channelLink, appLink, websiteLink, ...linkPayload } = payload;

  if (name !== undefined || channelLink !== undefined || appLink !== undefined || websiteLink !== undefined) {
    await affiliateRepository.updateAffiliate(userId, {
      name,
      channelLink,
      appLink,
      websiteLink,
    });
  }

  const link = await repository.createLink({ userId, ...linkPayload });
  return withTrackingUrl(link);
};

export const updateLinkStatus = async (
  id: number,
  payload: { status: 'approved' | 'rejected'; adminRemarks?: string | null },
): Promise<AffiliateLinkWithTracking | null> => {
  const updated = await repository.updateLinkStatus(id, payload);
  if (updated) {
    await notificationService.notify({
      userId: updated.userId,
      title: payload.status === 'approved' ? 'Link approved' : 'Link rejected',
      body:
        payload.status === 'approved'
          ? 'Your affiliate link has been approved. It is now live for tracking.'
          : `Your affiliate link was rejected.${payload.adminRemarks ? ` Reason: ${payload.adminRemarks}` : ''}`,
      type: payload.status === 'approved' ? 'link_approved' : 'link_rejected',
    });
    return withTrackingUrl(updated);
  }
  return null;
};

