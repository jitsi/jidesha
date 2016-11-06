An extension for Firefox which adds domains to the screen sharing whitelist.

## Building the XPI
Edit ```make.sh``` and set the DOMAINS and EXT_ID variable. Then run make.sh. This will produce the extension in a file named ```jidesha.xpi```.

## Function
When the extension is installed (or enabled) it adds the configured domains to the whitelist for screen sharing under the following Mozilla preference:
```media.getusermedia.screensharing.allowed_domains```

For each domain an empty png file is included and made accessible. This allows javascript executing in a web page to detect the presence of this extension by loading an image with source:
```chrome://JIDESHA_EXT_ID/content/THE_DOMAIN.png```

Where JIDESHA_EXT_ID is the ID of the extension with the '@' replaces by '.'.
