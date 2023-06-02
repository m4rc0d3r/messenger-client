export type TUserFromServer = {
  id_user: number;
  nickname: string;
  email: string;
  password?: string;
};

export type TUser = {
  id: number;
  nickname: string;
  email: string;
  password?: string;
};

export type TUserToEdit = {
  email?: TUser["email"];
  nickname?: TUser["nickname"];
  password?: TUser["password"];
  newPassword?: TUser["password"];
};

export type TUserToEditToServer = {
  email?: TUserFromServer["email"];
  nickname?: TUserFromServer["nickname"];
  password?: TUserFromServer["password"];
  new_password?: TUserFromServer["password"];
};

export type TUserToRegister = Pick<TUser, "email" | "nickname" | "password">;
export type TUserToLogin = Pick<TUser, "email" | "password">;

export type TRegistrationAndLoginResponse = TUserFromServer & { token: string };
