import type { TChat, TChatFromServer } from "./chat";

export type TUserFromServer = {
  id_user: number;
  nickname: string;
  email: string;
  password?: string;
  private_acc?: boolean;
};

export type TUser = {
  id: number;
  nickname: string;
  email: string;
  password?: string;
  isPrivate?: boolean;
};

export type TUserToEdit = {
  email?: TUser["email"];
  nickname?: TUser["nickname"];
  password?: TUser["password"];
  newPassword?: TUser["password"];
  isPrivate?: TUser["isPrivate"];
};

export type TUserToEditToServer = {
  email?: TUserFromServer["email"];
  nickname?: TUserFromServer["nickname"];
  password?: TUserFromServer["password"];
  new_password?: TUserFromServer["password"];
  private_acc?: TUserFromServer["private_acc"];
};

export type TUserToRegister = Pick<TUser, "email" | "nickname" | "password">;
export type TUserToLogin = Pick<TUser, "email" | "password">;

export type TRegistrationAndLoginResponse = TUserFromServer & { token: string };

export type TAddedToChatUserFromServer = Pick<
  TUserFromServer,
  "id_user" | "email" | "nickname"
> &
  Pick<TChatFromServer, "id_chat">;

export type TAddedToChatUser = Pick<TUser, "id" | "email" | "nickname"> & {
  chatId: TChat["id"];
};
