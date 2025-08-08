import { z } from "zod";
import type { TChat } from "./chat";

type UserPassword = string;

export const zUser = z.object({
  id: z.number(),
  nickname: z.string().nonempty(),
  email: z.string().email(),
  isPrivate: z.boolean(),
  avatar: z.string().nullable(),
});
export type TUser = z.infer<typeof zUser>;

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
  avatar?: string | File | null | undefined;
};
export type TUserToLogin = Omit<TUserToRegister, "nickname" | "avatar"> & {
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
