# Jidesha

A Chrome extension for calendar integration (Google Calendar and Office 365).

**THIS FILE IS FOR DEVELOPERS, NOT USERS!**

## How to create your own extension for your Jitsi Meet installation

Each Jitsi Meet installation needs a customised extension.
There are two files you want to edit,
in addition to updating the icon assets.

You have
to create the extension and distribute it, either through
Google Chrome's Web Store or by telling your users how to
install the CRX file.

### Create the extension

Edit the `manifest.json` file. You must adapt the `externally_connectable`
URL, e.g.,

    "matches": [
        "*://talk.brave.com/*"
    ]

Do not include any port information.

In addition,
you probably want to edit `name`, `description`, and `default_title` properties.

Then edit the `meet-calendar.js` file to update the `BASE_DOMAIN` and `APP_NAME` properties.

Finally, you may wish to replace the `.png` and `.svg` media assets.

### Test the Extension

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

### Pack the Extension

Then, according to the [documentation](https://developer.chrome.com/extensions/packaging),
go inside the Brave Browser to "brave://extensions", enable Developer Mode,
and "Pack extension".
Under "Extension root directory",
once again navigate to the directory containing `manifest.json`.

If you are _not_ modifying the extension, leave the second field ("Private key file") blank.
Otherwise, navigate and select the `calendar.pem` file that was created when you first created the `.crx` file.

You can now drag the `.crx` file onto the "brave://extensions" tab.
(Be sure to remove the extension if you previously did "Load unpacked".)

When the Brave Browser shows it among your installed extensions,
you will also see its _hash ID_.

### Distribute your extension manually to your users

You can send the CRX file to your users and tell them how to
install it. For example, you might want to put it
directly onto your Jitsi Meet server, along with a link on the home page.
This would only be helpful for downloading the extension, as
the Brave Browser will not allow a direct installation from your site.
