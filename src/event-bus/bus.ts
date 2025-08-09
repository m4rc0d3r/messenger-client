import type { InjectionKey } from "vue";
import type {
  EVENT_BUS_EVENT_DISCRIMINATOR,
  EventBusEvent,
  EventBusEventType,
} from "./event";

class EventBus {
  private eventTarget = new EventTarget();

  constructor() {}

  addEventListener<
    K extends EventBusEventType,
    P extends CustomEvent<
      Extract<
        EventBusEvent,
        {
          [EVENT_BUS_EVENT_DISCRIMINATOR]: K;
        }
      >["payload"]
    >,
  >(
    type: K,
    listener: (event: P) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.eventTarget.addEventListener(
      type,
      listener as unknown as EventListenerOrEventListenerObject | null,
      options,
    );
  }

  removeEventListener<
    K extends EventBusEventType,
    P extends CustomEvent<
      Extract<
        EventBusEvent,
        {
          [EVENT_BUS_EVENT_DISCRIMINATOR]: K;
        }
      >["payload"]
    >,
  >(
    type: K,
    listener: (event: P) => void,
    options?: boolean | EventListenerOptions,
  ) {
    this.eventTarget.removeEventListener(
      type,
      listener as unknown as EventListenerOrEventListenerObject | null,
      options,
    );
  }

  dispatchEvent<
    K extends EventBusEventType,
    P extends Extract<
      EventBusEvent,
      {
        [EVENT_BUS_EVENT_DISCRIMINATOR]: K;
      }
    >["payload"],
  >(type: K, payload: P) {
    this.eventTarget.dispatchEvent(
      new CustomEvent(type, {
        detail: payload,
      }),
    );
  }
}

const EVENT_BUS_INJECTION_KEY = Symbol() as InjectionKey<EventBus>;

export { EVENT_BUS_INJECTION_KEY, EventBus };
