export type TUser = {
  id: number;
  nickname: string;
  email: string;
  password: string;
};

export type TUserRegisterDTO = Pick<TUser, "email" | "nickname" | "password">;
export type TUserLoginDTO = Pick<TUser, "email" | "password">;
