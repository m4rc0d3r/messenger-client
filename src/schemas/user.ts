import type { TChat } from "./chat";

type UserPassword = string;

export type TUser = {
  id: number;
  nickname: string;
  email: string;
  isPrivate: boolean;
};

export type TUserFromServer = TUser;

export type TUserToEdit = {
  email?: TUser["email"];
  nickname?: TUser["nickname"];
  password?: UserPassword;
  newPassword?: UserPassword;
  isPrivate?: TUser["isPrivate"];
};
export type TUserToEditToServer = Pick<
  TUserToEdit,
  "email" | "nickname" | "isPrivate"
> & {
  currentPassword?: UserPassword;
  newPassword?: UserPassword;
};

export type TUserToRegister = Pick<TUser, "email" | "nickname"> & {
  password: UserPassword;
};
export type TUserToLogin = Omit<TUserToRegister, "nickname"> & {
  password: UserPassword;
};
export type TRegistrationAndLoginResponse = TUserFromServer & {
  token: string;
};

export type TAddedToChatUser = {
  user: TUser;
  chat: Pick<TChat, "id">;
};
export type TAddedToChatUserFromServer = TAddedToChatUser;
