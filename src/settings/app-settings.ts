import { config } from 'dotenv';
config();

export type EnvironmentVariable = { [key: string]: string | undefined };

export type EnvironmentsTypes =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'
  | 'TESTING';

export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env;
  }

  isProduction() {
    return this.env === 'PRODUCTION';
  }

  isStaging() {
    return this.env === 'STAGING';
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }

  isTesting() {
    return this.env === 'TESTING';
  }
}

export class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

class APISettings {
  public readonly PORT: number;
  public readonly ADMIN_AUTH: string;
  public readonly MONGO_DB_ATLAS: string;
  public readonly DB_NAME: string;
  public readonly DB_NAME_TEST: string;
  public readonly JWT_ACCESS_TOKEN_SECRET: string;
  public readonly JWT_REFRESH_TOKEN_SECRET: string;
  public readonly REGISTRATION_EMAIL: string;
  public readonly REGISTRATION_PASS: string;

  constructor(private readonly envVariables: EnvironmentVariable) {
    this.PORT = this.getNumberOrDefault(envVariables.PORT as string, 5007);
    this.ADMIN_AUTH = envVariables.ADMIN_AUTH ?? '';
    this.MONGO_DB_ATLAS = envVariables.MONGO_DB_ATLAS ?? '';
    this.DB_NAME = envVariables.DB_NAME ?? '';
    this.DB_NAME_TEST = envVariables.DB_NAME_TEST ?? '';
    this.JWT_ACCESS_TOKEN_SECRET = envVariables.JWT_ACCESS_TOKEN_SECRET ?? '';
    this.JWT_REFRESH_TOKEN_SECRET = envVariables.JWT_REFRESH_TOKEN_SECRET ?? '';
    this.REGISTRATION_EMAIL = envVariables.REGISTRATION_EMAIL ?? '';
    this.REGISTRATION_PASS = envVariables.REGISTRATION_PASS ?? '';
  }

  private getNumberOrDefault(value: any, defaultValue: number): number {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      return defaultValue;
    }
    return parsedValue;
  }
}

const env = new EnvironmentSettings(
  (Environments.includes((process.env.ENV as string)?.trim())
    ? (process.env.ENV as string).trim()
    : 'DEVELOPMENT') as EnvironmentsTypes,
);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);
