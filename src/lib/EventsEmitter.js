// @ts-check
import _EventsEmitter from "events";
class EventsEmitter extends _EventsEmitter {
  addListener(eventName, listener) {
    super.addListener(eventName, listener);
    return listener;
  }
}
export { EventsEmitter };
