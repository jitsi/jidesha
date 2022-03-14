import * as gcal from "./google-calendar";
import fs from "fs";
import path from "path";

function waitForMutationObserversToFire(): Promise<void> {
  return new Promise((resolve) => process.nextTick(resolve));
}

function loadTestDoc(filename: string): string {
  return fs.readFileSync(path.join(__dirname, "testdata", filename), {
    encoding: "utf-8",
  });
}

it("should correctly detect whether gcal has loaded", () => {
  document.body.outerHTML =
    "<html><body>This is not google calendar</body></html>";
  expect(gcal.isGoogleCalendar()).toBeFalsy();

  document.body.outerHTML = `<body data-viewfamily="EVENT">This looks like google calendar</body>`;
  expect(gcal.isGoogleCalendar()).toBeTruthy();
});

it("should report the view family", () => {
  document.body.outerHTML =
    "<html><body>This is not google calendar</body></html>";
  expect(gcal.getViewFamily()).toBeUndefined();

  document.body.outerHTML = `<body data-viewfamily="EVENT">This looks like google calendar</body>`;
  expect(gcal.getViewFamily()).toEqual("EVENT");

  document.body.outerHTML = `<body data-viewfamily="EVENT_EDIT">This looks like google calendar</body>`;
  expect(gcal.getViewFamily()).toEqual("EVENT_EDIT");
});

it("should add button to quick add dialog", async () => {
  document.body.outerHTML = `<body data-viewfamily="EVENT">This looks like google calendar</body>`;
  expect(document.getElementById("jitsi_button_quick_add")).toBeNull();

  gcal.watchForChanges();

  expect(document.getElementById("jitsi_button_quick_add")).toBeNull();

  // in real life, gcal ads a node with a dialog deep down inside
  const dialog = document.createElement("div");
  dialog.innerHTML = `
    <div role="dialog">
      <span>This is the quick add dialog</span>
      <div id="tabEvent">
        This tab shows event details
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  // give the mutation observer a chance to run
  await waitForMutationObserversToFire();

  // we now expect the button to have been added to the quick add dialog
  expect(document.getElementById("jitsi_button_quick_add")).not.toBeNull();
});

it("should add 'Add Brave Talk' button to full screen event edit if location is not currently brave talk", async () => {
  document.body.outerHTML = '<body data-viewfamily="EVENT_EDIT"></body>';

  const newEventHtml = loadTestDoc("new_event.html");
  gcal.watchForChanges();

  document.body.innerHTML = newEventHtml;

  // give the mutation observer a chance to run
  await waitForMutationObserversToFire();

  const el = document.getElementById("jitsi_button");
  expect(el).not.toBeNull();

  const link = el?.getElementsByTagName("a")[0];
  expect(link?.outerHTML).toMatchInlineSnapshot(
    `"<a href=\\"#\\" style=\\"color: white\\">Add a Brave Talk meeting</a>"`
  );
});

it("should add 'Join Brave Talk' button to full screen event edit if location is currently brave talk", async () => {
  document.body.outerHTML = '<body data-viewfamily="EVENT_EDIT"></body>';

  const newEventHtml = loadTestDoc("event_with_talk_meeting_location.html");
  gcal.watchForChanges();

  document.body.innerHTML = newEventHtml;

  // give the mutation observer a chance to run
  await waitForMutationObserversToFire();

  const el = document.getElementById("jitsi_button");
  expect(el).not.toBeNull();

  const link = el?.getElementsByTagName("a")[0];
  expect(link?.outerHTML).toMatchInlineSnapshot(
    `"<a href=\\"https://talk.brave.com/yzd4Zi1B5Gf48m4X_TsNrDZSmTCdIhAvJ10Wz5gh4FA\\" style=\\"color: white\\" target=\\"_new\\">Join your Brave Talk meeting now</a>"`
  );
});
