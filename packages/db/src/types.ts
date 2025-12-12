export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  sessions?: Session[];
  accounts?: Account[];
  conversations?: Conversation[];
  apiKeys?: ApiKey[];
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  user?: User;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  user?: User;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  provider: string;
  keyHash: string;
  label: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export type ApiKeyWithoutHash = Omit<ApiKey, "keyHash">;

export interface Conversation {
  id: string;
  title: string;
  model: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  messages?: Message[];
}

export interface Message {
  id: string;
  role: string;
  content: string;
  model: string | null;
  createdAt: Date;
  conversationId: string;
  conversation?: Conversation;
}

export interface Model {
  id: string;
  provider: string;
  modelId: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreateInput {
  provider: string;
  keyHash: string;
  label?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

export interface ConversationCreateInput {
  title?: string;
  model: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

export interface MessageCreateInput {
  role: string;
  content: string;
  model?: string | null;
  createdAt?: Date;
  conversationId: string;
}

export interface ModelCreateInput {
  provider: string;
  modelId: string;
  displayName: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Update types
export interface UserUpdateInput {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
  updatedAt?: Date;
}

export interface SessionUpdateInput {
  expiresAt?: Date;
  token?: string;
  updatedAt?: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AccountUpdateInput {
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  updatedAt?: Date;
}

export interface ApiKeyUpdateInput {
  provider?: string;
  keyHash?: string;
  label?: string | null;
  isActive?: boolean;
  updatedAt?: Date;
}

export interface ConversationUpdateInput {
  title?: string;
  model?: string;
  provider?: string;
  updatedAt?: Date;
}

export interface MessageUpdateInput {
  role?: string;
  content?: string;
  model?: string | null;
}

export interface ModelUpdateInput {
  provider?: string;
  modelId?: string;
  displayName?: string;
  description?: string | null;
  isActive?: boolean;
  updatedAt?: Date;
}

// Query and filter types
export interface UserFilter {
  id?: string | string[];
  email?: string | string[];
  name?: string | string[];
  emailVerified?: boolean;
}

export interface ConversationFilter {
  id?: string | string[];
  userId?: string | string[];
  model?: string | string[];
  provider?: string | string[];
}

export interface MessageFilter {
  id?: string | string[];
  conversationId?: string | string[];
  role?: string | string[];
}

export interface ApiKeyFilter {
  id?: string | string[];
  userId?: string | string[];
  provider?: string | string[];
  isActive?: boolean;
}

export interface ModelFilter {
  id?: string | string[];
  provider?: string | string[];
  modelId?: string | string[];
  isActive?: boolean;
}
