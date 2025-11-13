export interface OtpRequestPayload {
  mobileNumber: string;
}

export interface OtpVerifyPayload {
  mobileNumber: string;
  otp: string;
  name?: string;
  channelLink?: string | null;
  appLink?: string | null;
  websiteLink?: string | null;
}

