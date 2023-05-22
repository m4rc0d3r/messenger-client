import type { TMessage } from "./message";

export type TChatFromServer = {
  id_chat: number;
  name_chat: string;
  rk_type_chat: number;
  link: string;
};

export type TChat = {
  id: number;
  name: string;
  type: number;
  link: string;
  messages: TMessage[];
};
