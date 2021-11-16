/**
 * Generates new room name.  This is how Brave Talk does it.
 */
function generateRoomWithoutSeparator() {
  const { crypto } = window;
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
