export const jwt = {
  secret: process.env.JWT_SECRET ?? 'c326c9fb-f056-41fa-a817-7c27f8fda5cd',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
};
