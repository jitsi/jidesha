/**
 * Generates new room name.  This is how Brave Talk does it.
 */
export function generateRoomWithoutSeparator() {
  const { crypto } = window;
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function generateNewRoomUrl() {
  return `https://talk.brave.com/${generateRoomWithoutSeparator()}`;
}

export function isBraveTalkUrl(text: string): boolean {
  return text.startsWith("https://talk.brave.com/");
}

export function createRoom(roomUrl: string) {
  window.open(
    `${roomUrl}?create_only=y`,
    "talk_extension_popup",
    "popup,width=320,height=480,noopener,noreferrer"
  );
}
