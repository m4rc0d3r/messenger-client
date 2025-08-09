import { zChat } from "@/schemas/chat";
import { z } from "zod";

const zEventBusEventType = z.enum(["SELECT_CHAT"]);
const EventBusEventType = zEventBusEventType.Enum;
type EventBusEventType = z.infer<typeof zEventBusEventType>;

const EVENT_BUS_EVENT_DISCRIMINATOR = "type";

const zEventBusEvent = z.discriminatedUnion(EVENT_BUS_EVENT_DISCRIMINATOR, [
  z.object({
    [EVENT_BUS_EVENT_DISCRIMINATOR]: z.literal(EventBusEventType.SELECT_CHAT),
    payload: zChat.pick({
      id: true,
    }),
  }),
]);
type EventBusEvent = z.infer<typeof zEventBusEvent>;

export {
  EVENT_BUS_EVENT_DISCRIMINATOR,
  EventBusEventType,
  zEventBusEvent,
  zEventBusEventType,
};
export type { EventBusEvent };
