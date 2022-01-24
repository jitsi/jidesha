import {
  checkForAutoCreateMeetingFlag,
  isGoogleCalendar,
  watchForChanges,
} from "./google-calendar";

if (isGoogleCalendar()) {
  console.log(
    `Brave Talk Google Calendar extension ${
      chrome.runtime.getManifest().version
    } running`
  );

  checkForAutoCreateMeetingFlag();
  watchForChanges();
}
