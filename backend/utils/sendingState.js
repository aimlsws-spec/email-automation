let isSending = false;

module.exports = {
  get isSending() {
    return isSending;
  },
  set isSending(value) {
    isSending = value;
  }
};
