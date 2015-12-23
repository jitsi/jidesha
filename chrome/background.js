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

// Listens for external messages coming from pages that match url pattern defined in manifest.json
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log("Got request", request, sender);
        if(request.getVersion) {
            sendResponse({ version: chrome.runtime.getManifest().version});
            return false; // Dispose of sendResponse
        } else if(request.getStream) {
            // Desktop video stream sources
            var sources = ["screen", "window"];
            if (request.sources) {
                // Default
                sources = request.sources;
            }
            // External URL (iFrame embedding)
            // Extract the allowed external URL from request, otherwise
            // build external URL from sender.url.
            var externalURL = '';
			if (request.url) {
				externalURL = request.url;
			} else {
				externalURL = 'https://' + sender.url.split('/',3)[2];
			}
			sender.tab.url = externalURL
			console.log("Using external URL: " + externalURL);
            // Gets chrome media stream token and returns it in the response.
            chrome.desktopCapture.chooseDesktopMedia(
                sources, sender.tab,
                function(streamId) {
                    sendResponse({ streamId: streamId});
                });
            return true; // Preserve sendResponse for future use
        } else {
            console.error("Unknown request");
            sendResponse({ error : "Unknown request" });
            return false;
        }
    }
);
