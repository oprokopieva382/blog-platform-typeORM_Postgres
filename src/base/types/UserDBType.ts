export type UserDBType = {
  login: string;
  email: string;
  password: string;
  createdAt: Date;
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
