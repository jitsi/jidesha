/* 
This file contains all the logic that interacts with the html of the google calendar site
 */

import { createRoom, generateNewRoomUrl, isBraveTalkUrl } from "./brave-talk";

// we want to automatically add the brave talk meeting to
// the event immediately when it opens in full screen mode, in two cases:
//  1. when the user has selected "Create Google Calendar meeting" from the extension
//     popup window (see popup.html)
//  2. when the user clicks "Add a brave talk meeting" from the "quick add" dialog
let scheduleAutoCreateMeeting = false;

// The "view family" is a flag set by gcal indicating what root view is currently displayed.
// The options we are interested in are:
//  - "EVENT" - this is the normal screen view of a calendar showing events. Within this screen
//     pop up dialogs are shown with the details of events.
//  - "EVENT_EDIT" - when you click the "edit" button on an event dialog in the EVENT screen, a
//     full screen edit mode is displayed. This switches the view family to "EVENT_EDIT".
export function getViewFamily(): string | undefined {
  return document?.body?.dataset?.viewfamily;
}

export function isGoogleCalendar(): boolean {
  return !!getViewFamily();
}

/*
 * QUICK ADD SCREEN
 */

// The "quick add" screen is the inline event creation dialog,
// invoked usually by clicking the "create +" button. We add a button
// here, and get it to invoke the full-screen "edit" mode where the full functionaltiy is.
function addButtonToQuickAdd(quickAddDialog: HTMLElement) {
  // skip if our button is already added
  if (document.querySelector("#jitsi_button_quick_add")) {
    return;
  }
  const tabEvent = quickAddDialog.querySelector("#tabEvent");
  if (tabEvent) {
    const tabPanel = document.createElement("content");
    tabPanel.setAttribute("role", "tabpanel");
    tabPanel.setAttribute("id", "jitsi_button_quick_add_content");
    tabPanel.innerHTML = `
      <div class="fy8IH poWrGb">
        <div class="FkXdCf HyA7Fb">
          <div class="DPvwYc QusFJf jitsi_quick_add_icon"/>
        </div>
      </div>
      <div class="mH89We">
        <div role="button"
             class="uArJ5e UQuaGc Y5sE8d"
             id="jitsi_button_quick_add">
          <content class="CwaK9">
            <span class="RveJvd jitsi_quick_add_text_size">
              Add a Brave Talk meeting
            </span>
          </content>
        </div>
      </div>
    `;

    tabEvent.parentElement?.appendChild(tabPanel);
    const clickHandler = tabEvent.parentElement?.querySelector(
      "#jitsi_button_quick_add"
    );
    clickHandler?.addEventListener("click", () => {
      // this is clicking the "more options" button on the quick add dialog,
      // which causes the full screen event editor to appear
      scheduleAutoCreateMeeting = true;
      document
        .querySelector<HTMLElement>('div[role="button"][jsname="rhPddf"]')
        ?.click();
    });
  }
}

/*
 * FULL SCREEN EVENT EDIT
 */

function isFullScreenEventButtonPresent(): boolean {
  return document.getElementById("jitsi_button") !== null;
}

// the value currently entered into the "location" text box
function getLocationString(): string {
  return (
    document
      .querySelector<HTMLInputElement>(
        "#xLocIn input[jsname=YPqjbf][role=combobox]"
      )
      ?.value?.toString() ?? ""
  );
}

async function setLocationString(newValue: string): Promise<void> {
  const input = document.querySelector(
    "#xLocIn input[jsname=YPqjbf][role=combobox]"
  );

  if (input instanceof HTMLElement) {
    // inspired by
    //  https://stackoverflow.com/questions/64094461/edit-descrption-or-location-of-google-calendar-event-with-chrome-extension

    input.focus();

    // need to let the event loop run, so the gcal code responds to the focus
    await new Promise((resolve) => setTimeout(resolve, 1));

    document.execCommand("insertText", false, newValue);
    for (const type of ["keydown", "keypress", "keyup"])
      input.dispatchEvent(new KeyboardEvent(type));
  }
}

/* This creates the row with icon and a button - with no text on it and no click handler */
function getOrCreateButtonContainer(): HTMLElement | Element | null {
  // #xNtList is the notification list, we need to insert the button row before this.
  // If it's not there, the UI isn't ready to insert yet
  const neighbor = document.querySelector("#xNtList")?.parentElement;
  if (!neighbor) {
    return null;
  }

  // do we have an existing button in place?
  const existingButton = document.querySelector(
    "#jitsi_button_container content"
  );
  if (existingButton) {
    return existingButton;
  }

  const buttonRow = document.createElement("div");
  buttonRow.className = "FrSOzf";
  buttonRow.innerHTML = `
      <div class="tzcF6">
        <div class="DPvwYc jitsi_edit_page_icon"></div>
      </div>
      <div class="j3nyw">
        <div class="BY5aAd">
          <div role="button"
               class="uArJ5e UQuaGc Y5sE8d"
               id="jitsi_button_container">
            <content class="CwaK9">
              <div id="jitsi_button" 
                  class="goog-inline-block jfk-button jfk-button-action jfk-button-clear-outline">
                <a href="#" style="color: white"></a>
              </div>
            </content>
          </div>
        </div>
      </div>
  `;

  neighbor.parentElement?.insertBefore(buttonRow, neighbor);

  return buttonRow.querySelector("content");
}

async function onAddMeetingClick() {
  const newRoomUrl = generateNewRoomUrl();
  await setLocationString(newRoomUrl);
  updateToJoinMeetingButton(newRoomUrl);

  createRoom(newRoomUrl);
}

/**
 * Updates the initial button text and click handler when there is
 * no meeting scheduled.
 */
function updateToAddMeetingButton() {
  const anchor = document.querySelector("#jitsi_button a");
  if (anchor) {
    anchor.textContent = "Add a Brave Talk meeting";
    anchor.setAttribute("href", "#");
    anchor.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        onAddMeetingClick();
      },
      { once: true }
    );
  }
}

/**
 * Updates the url for the button.
 */
function updateToJoinMeetingButton(joinUrl: string) {
  const button = document.querySelector("#jitsi_button a");
  if (button) {
    button.textContent = "Join your Brave Talk meeting now";
    button.setAttribute("href", joinUrl);
    button.setAttribute("target", "_new");
  }
}

export function maintainButtonOnFullScreenEventEdit() {
  // we want to trigger all the logic only when we have enough elements
  // on the page, as the new interface is loading live and some elements
  // are missing when directly go the event edit page
  // we require the notifications element and location
  const xNtList = document.querySelector("#xNtList");
  const xLocIn = document.querySelector("#xLocIn");
  const xOnCal = document.querySelector("#xOnCal");
  if (
    xNtList && // notifications
    (xLocIn || // editable location
      xOnCal) &&
    !isFullScreenEventButtonPresent()
  ) {
    /// add button
    if (getOrCreateButtonContainer()) {
      const currentLocation = getLocationString();
      if (isBraveTalkUrl(currentLocation)) {
        updateToJoinMeetingButton(currentLocation);
      } else {
        updateToAddMeetingButton();

        if (scheduleAutoCreateMeeting) {
          scheduleAutoCreateMeeting = false;
          setTimeout(() => onAddMeetingClick(), 1000);
        }
      }
    }
  }
}

export function watchForChanges() {
  const onMutation: MutationCallback = (mutations) => {
    const viewFamily = getViewFamily();

    // in normal calendar mode, watch for the quick add popup
    if (viewFamily === "EVENT") {
      mutations.forEach((mutation) => {
        let dlg;
        mutation.addedNodes.forEach((node) => {
          const el =
            node instanceof HTMLElement &&
            node.querySelector("[role='dialog']");
          if (el) {
            dlg = el;
            return;
          }
        });
        if (dlg) {
          addButtonToQuickAdd(dlg);
        }
      });
    }
    // in full screen event edit mode, ensure our feedback button is present
    else if (viewFamily === "EVENT_EDIT") {
      maintainButtonOnFullScreenEventEdit();
    }
  };

  const watcher = new MutationObserver(onMutation);

  watcher.observe(document.body, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  });
}

export function checkForAutoCreateMeetingFlag(): boolean {
  const params = new URLSearchParams(window.location.search);
  const autoCreateMeeting = params.get("autoCreateMeeting");
  const extid = params.get("extid");
  if (autoCreateMeeting && extid === chrome.runtime.id) {
    /* Actually this didn't work reliably, we think because there's no user interaction
     * on the gcal side, so it doesn't accept the programmatic editing on the event.
     * So, for now, users get the event but then have to click the brave talk button
     * for themselves.
     */
    // scheduleAutoCreateMeeting = true;
    return true;
  }

  return false;
}
