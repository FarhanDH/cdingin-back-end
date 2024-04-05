export const config = () => ({
  serverPort: process.env.PORT,

  // load database configurations
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    url: process.env.DATABASE_URL,
  },
});
