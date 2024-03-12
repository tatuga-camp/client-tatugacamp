export type User = {
  id: string;
  createAt: string;
  updateAt: string;
  email: string;
  hash: string;
  firstName: string;
  picture: string;
  lastName: string;
  phone: string;
  school: string;
  provider: string;
  resetToken: string | null;
  resetTokenExpiresAt: string | null;
  IsResetPassword: boolean;
  isSchoolAccount: boolean;
  lastActiveAt: string;
  language: Language;
  plan: "FREE" | "TATUGA-STARTER" | "TATUGA-PREMIUM";
  role: "TEACHER" | "SCHOOL";
  isDisabled: boolean;
  isDelete: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
  subscriptions: string;
  schoolUser: SchoolUser | null;
};

export type Language = "Thai" | "English";

export type SchoolUser = {
  id: string;
  createAt: string;
  updateAt: string;
  limite: number;
  organization: string;
  imageCover: string | null;
  expireAt: string | null;
  userId: string;
};
