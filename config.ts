export const config = () => ({
  PORT: process.env.PORT || 3003,
  MONGO_DB_ATLAS: process.env.MONGO_DB_ATLAS || '',
  DB_NAME: process.env.DB_NAME || '',
});
