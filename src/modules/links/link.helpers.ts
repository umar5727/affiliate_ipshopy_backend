const TRACKING_PARAM = 'aff_link_id';

const ensureAbsoluteUrl = (rawUrl: string): { url: string; hadProtocol: boolean } => {
  const hasProtocol = /^[a-zA-Z][\w+.-]*:\/\//.test(rawUrl);
  return {
    url: hasProtocol ? rawUrl : `https://${rawUrl}`,
    hadProtocol: hasProtocol,
  };
};

const stripProtocolIfNeeded = (url: string, keepProtocol: boolean): string => {
  if (keepProtocol) {
    return url;
  }
  return url.replace(/^[a-zA-Z][\w+.-]*:\/\//, '');
};

export const buildTrackingUrl = (rawUrl: string, linkId: number): string => {
  const paramValue = String(linkId);
  const { url: absoluteUrl, hadProtocol } = ensureAbsoluteUrl(rawUrl);

  try {
    const url = new URL(absoluteUrl);
    url.searchParams.delete('aff_id');
    url.searchParams.set(TRACKING_PARAM, paramValue);
    return stripProtocolIfNeeded(url.toString(), hadProtocol);
  } catch {
    const [basePart, hashPart] = absoluteUrl.split('#');
    const withoutParam = basePart.replace(
      new RegExp(`([?&])(aff_link_id|aff_id)=[^&]*`, 'gi'),
      '$1',
    );
    const trimmedBase = withoutParam.replace(/[?&]+$/, '');
    const separator = trimmedBase.includes('?') ? '&' : '?';
    const rebuilt = `${trimmedBase}${separator}${TRACKING_PARAM}=${paramValue}`;
    const finalUrl = hashPart ? `${rebuilt}#${hashPart}` : rebuilt;
    return stripProtocolIfNeeded(finalUrl, hadProtocol);
  }
};


