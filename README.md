Wayback Machine Firefox Addon
========

This Firefox addon will add a new item to the context menu and the toolbar menu, allowing you to save the current webpage to the [Wayback Machine](http://archive.org/web/). The toolbar button also allows you to save the webpage to [archive.is](archive.is).

Installation
========

This extension is available for installation via [Mozzila's Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/save-url-to-wayback-machine).

To build and install this extension from source, you will first need to install [Mozzila's Add-On SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation). Once that is installed, run the following command in the root directory (where the package.json is stored):

```
jpm xpi
```

This will then create an .xpi file (IE @save-url-to-wayback-machine-firefox-addon-0.0.1.xpi). Once this file is generated, go to Firefox and choose File - Open File and select the .xpi file you generated. Firefox will then ask if you want to install the addon.