An extension for Firefox which adds domains to the screen sharing whitelist.

## Deprecation
Firefox versions 52 and newer do not have a whitelist for screen sharing, and the jidesha extension is no longer needed. For use with jitsi-meet, we recommend setting ```desktopSharingFirefoxMaxVersionExtRequired=51``` in ```config.js```, which is the new default and which makes the extension required only on Firefox versions which actually need it.

## Building the XPI
Edit ```make.sh``` and set the DOMAINS and EXT_ID variables (see comments in ```make.sh``` for further instructiona). Then run make.sh. This will produce the extension in a file named ```jidesha.xpi```.

## Function
When the extension is installed (or enabled) it adds the configured domains to the whitelist for screen sharing under the following Mozilla preference:
```media.getusermedia.screensharing.allowed_domains```

For each domain an empty png file is included and made accessible. This allows javascript executing in a web page to detect the presence of this extension by loading an image with source:
```chrome://JIDESHA_EXT_ID/content/THE_DOMAIN.png```

Where JIDESHA_EXT_ID is the ID of the extension with the '@' replaces by '.'.
