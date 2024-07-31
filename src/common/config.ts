export const config = () => ({
  serverPort: process.env.PORT as unknown as number,

  // load database configurations
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT as unknown as number,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    url: process.env.DATABASE_URL,
  },

  secret: {
    secretTokenKey: process.env.SECRET_TOKEN,
  },
});
