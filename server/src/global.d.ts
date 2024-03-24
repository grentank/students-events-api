namespace NodeJS {
  type ProcessEnv = {
    [key: string]: string | undefined;
    DATABASE_URL: string;
    PORT: string;
    TOKEN_SECRET: string;
    SECRET_AUTH_PASSPHRASE: string;
  };
}
