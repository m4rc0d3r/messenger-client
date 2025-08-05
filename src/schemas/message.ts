export type TMessage = {
  id: number;
  text: string;
  date: Date;
  senderId: number;
  chatId: number;
};
export type TMessageFromServer = Omit<TMessage, "date" | "senderId"> & {
  createdAt: Date;
  authorId: number;
};

export type TMessageToSend = Pick<TMessage, "text" | "chatId">;
export type TMessageToSendToServer = TMessageToSend;

export type TMessageToEdit = Pick<TMessage, "id" | "text" | "chatId">;
export type TMessageToEditToServer = TMessageToEdit;

export type TMessageToDelete = Pick<TMessage, "id" | "chatId">;
export type TMessageToDeleteToServer = TMessageToDelete;

export type TMessageToForward = Pick<TMessage, "id" | "chatId">;
export type TMessageToForwardToServer = TMessageToForward;
