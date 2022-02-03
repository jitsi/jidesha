# Brave Talk for Google Calendar

This is the code for the Brave Talk for Google Calendar chrome extension,
originally based on https://github.com/jitsi/jidesha.

[Find out more about Brave Talk.](https://brave.com/talk/)

# For Users

Install this extension from [the chrome extension webstore](https://chrome.google.com/webstore/detail/brave-talk-for-google-cal/nimfmkdcckklbkhjjkmbjfcpaiifgamg).

# For Developers Only

Build this extension:

    npm install
    npm run build

Go to "brave://extensions",
enable Developer Mode,
click on "Load unpacked",
navigate to the `dist` directory created by `npm run build`.
and click on 'Select`.

Now go to [Google Calendar](https://calendar.google.com/) and start the creation process for an appointment.
Towards the bottom of the pop-up window, you should see a button with the icon to add a meeting".
