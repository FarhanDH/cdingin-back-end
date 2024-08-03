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

  jwtConstants: {
    secretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
  },

  // load redis configurations
  redis: {
    url: process.env.REDIS_URL as string,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as unknown as number,
    password: process.env.REDIS_PASSWORD,
  },
});
