import dotenv from 'dotenv';

const envResult = dotenv.config();

if (envResult.error) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  No .env file found or dotenv failed to load. Falling back to process environment variables.');
}

const ensure = (value: string | undefined, key: string, defaultValue?: string): string => {
  if (value === undefined || value === null || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: ensure(process.env.NODE_ENV, 'NODE_ENV', 'development'),
  port: parseInt(ensure(process.env.PORT, 'PORT', '4000'), 10),
  mysql: {
    host: ensure(process.env.MYSQL_HOST, 'MYSQL_HOST', 'localhost'),
    port: parseInt(ensure(process.env.MYSQL_PORT, 'MYSQL_PORT', '3306'), 10),
    user: ensure(process.env.MYSQL_USER, 'MYSQL_USER', 'root'),
    password: ensure(process.env.MYSQL_PASSWORD, 'MYSQL_PASSWORD', ''),
    database: ensure(process.env.MYSQL_DATABASE, 'MYSQL_DATABASE', 'ipshopy2_affiliates'),
    connectionLimit: parseInt(ensure(process.env.MYSQL_CONNECTION_LIMIT, 'MYSQL_CONNECTION_LIMIT', '10'), 10),
  },
  jwt: {
    accessSecret: ensure(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET', 'change-me-in-prod'),
    refreshSecret: ensure(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET', 'change-me-in-prod-too'),
    accessTtlMinutes: parseInt(ensure(process.env.JWT_ACCESS_TTL_MINUTES, 'JWT_ACCESS_TTL_MINUTES', '30'), 10),
    refreshTtlDays: parseInt(ensure(process.env.JWT_REFRESH_TTL_DAYS, 'JWT_REFRESH_TTL_DAYS', '7'), 10),
  },
  otp: {
    provider: ensure(process.env.OTP_PROVIDER, 'OTP_PROVIDER', 'interakt'),
    rateLimitPerHour: parseInt(ensure(process.env.OTP_RATE_LIMIT_PER_HOUR, 'OTP_RATE_LIMIT_PER_HOUR', '5'), 10),
  },
  redis: {
    url: process.env.REDIS_URL ?? '',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
    password: process.env.REDIS_PASSWORD,
  },
  integrations: {
    opencartSecret: ensure(process.env.OPENCART_WEBHOOK_SECRET, 'OPENCART_WEBHOOK_SECRET', 'change-opencart-secret'),
  },
  interakt: {
    apiUrl: ensure(process.env.INTERAKT_API_URL, 'INTERAKT_API_URL', 'https://api.interakt.ai/v1/public/message/'),
    apiToken: ensure(process.env.INTERAKT_API_TOKEN, 'INTERAKT_API_TOKEN', ''),
    countryCode: ensure(process.env.INTERAKT_COUNTRY_CODE, 'INTERAKT_COUNTRY_CODE', '+91'),
    templateName: ensure(process.env.INTERAKT_TEMPLATE_NAME, 'INTERAKT_TEMPLATE_NAME', 'o_t_p_d6'),
    languageCode: ensure(process.env.INTERAKT_LANGUAGE_CODE, 'INTERAKT_LANGUAGE_CODE', 'en'),
    callbackData: ensure(process.env.INTERAKT_CALLBACK_DATA, 'INTERAKT_CALLBACK_DATA', 'otp request'),
  },
};

export const isProduction = env.nodeEnv === 'production';

