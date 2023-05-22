export type TMessageFromServer = {
  id_message: number;
  text_message: string;
  data_time: string;
  rk_user: number;
  rk_chat: number;
};

export type TMessage = {
  id: number;
  text: string;
  date: Date;
  senderId: number;
  chatId: number;
};

export type TMessageToSendToServer = Pick<
  TMessageFromServer,
  "text_message"
> & { id_chat: TMessageFromServer["rk_chat"] };
export type TMessageToSend = Pick<TMessage, "text" | "chatId">;
