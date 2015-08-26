/*
 * Copyright @ 2015 Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var domains = "JIDESHA_DOMAINS".split(' ');

function startup(data, reason) { 
    if (reason === ADDON_INSTALL || reason === ADDON_ENABLE)
        addDomains();
}

function shutdown(data, reason) { 
    if (reason === ADDON_UNINSTALL || reason === ADDON_DISABLE)
        removeDomains();
}

function install(data, reason) {
}

function uninstall(data, reason) {
}

function addDomains() {
    console.log("Jidesha: adding our domains to the screen sharing whitelist: " + domains);

    var prefsService = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);
    var prefs = prefsService.getBranch("media.getusermedia.screensharing.");

    var allowedDomains = prefs.getCharPref("allowed_domains").split(',');
    domains.forEach(function (domain) {
        if (allowedDomains.indexOf(domain) == -1) {
            allowedDomains.push(domain);
        }
    });

    prefs.setCharPref("allowed_domains", allowedDomains.join(','));
    prefsService.savePrefFile(null);
}

function removeDomains() {
    console.log("Jidesha: removing our domains from the screen sharing whitelist: " + domains);

    var prefsService = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);

    var prefs = prefsService.getBranch("media.getusermedia.screensharing.");
    var allowedDomains = prefs.getCharPref("allowed_domains").split(',');

    var defaultPrefs = prefsService.getDefaultBranch("media.getusermedia.screensharing.");
    var defaultAllowedDomains = defaultPrefs.getCharPref("allowed_domains").split(',');

    domains.forEach(function (domain) {
        // Keep the whitelisted-by-default domains, even if we have them.
        if (defaultAllowedDomains.indexOf(domain) == -1) {
            var idx = allowedDomains.indexOf(domain);
            if (idx != -1) {
                allowedDomains.splice(idx, 1);
                console.log("Jidesha: removing domain", domain);
            }
        }
    });

    prefs.setCharPref("allowed_domains", allowedDomains.join(','));
    prefsService.savePrefFile(null);
}
