export const config = {
  serverPort: process.env.PORT,

  // load database configurations
  dbType: process.env.DATABASE_TYPE,
  dbHost: process.env.DATABASE_HOST,
  dbPort: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  dbUsername: process.env.DATABASE_USERNAME,
  dbPassword: process.env.DATABASE_PASSWORD,
  dbUrl: process.env.DATABASE_URL,
};
