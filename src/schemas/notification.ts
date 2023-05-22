import * as uuid from "uuid";

export class Notification {
  readonly id: string;
  readonly status: NotificationStatus;
  readonly message: string;

  constructor(status: NotificationStatus, message: string) {
    this.id = uuid.v4();
    this.status = status;
    this.message = message;
  }
}

export enum NotificationStatus {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
