if (typeof MessageChannel === 'undefined') {
  class MessageChannel {
    constructor() {
      this.port1 = {};
      this.port2 = {};
    }
  }
  globalThis.MessageChannel = MessageChannel;
}


