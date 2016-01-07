Jidesha
=======

A Chrome extension for Desktop Sharing in Jitsi Meet

Note: this extension relies on the Chrome [chooseDesktopMedia](https://developer.chrome.com/extensions/desktopCapture) API which requires HTTPS.

## How to create your own extension for your Jitsi Meet installation

Each Jitsi Meet installation needs a customised extension.
There is only one small JSON file to adapt. You have
to create the extension and distribute it, either through
Google's Chrome Web Store or by telling your users how to
install the CRX file.

### Create the extension

Edit the `manifest.json` file. You must adapt the `externally_connectable`
URL:

    "matches": [
        "*://your.server.com/*"
    ]

Do not include any port information.

You might also want to edit the name, the description, the version or
to replace the icons.

Then, according to https://developer.chrome.com/extensions/packaging ,
go inside Chrome to "chrome://extensions", click on the Developer Mode,
and "Pack extension". The result is a CRX file and, if you do this for
the first time, a private key used for later updates.

### Install your own extension

Install your own extension into your Chrome. One way is to drag the
CRX file into the "chrome://extensions" window.

When Chrome shows it among your installed extensions,
you will also see its *hash ID*.

### Enter your extension's hash ID into your Jitsi Meet installation 

You have to write the hash ID into the `desktopSharingChromeExtId`
property of your `/etc/jitsi/meet/<your.server.com>-config.js`.
This way, Jitsi Meet knows what to look for when the user clicks
the "Share screen" button.

Browser caches might need to be refreshed afterwards.

### Distribute your extension manually to your users

You can send the CRX file to your users and tell them how to
install it. For example, you might want to put it
directly onto your Jitsi Meet server (webroot in `/usr/share/jitsi-meet`).
This would only be helpful for downloading the extension, as
Chrome will not allow a direct installation from your site.
