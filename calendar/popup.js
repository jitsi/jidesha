function click(e) {
    meetingId = generateRoomWithoutSeparator();
	locationText = LOCATION_TEXT + ' - ' + BASE_URL + meetingId;
	inviteText = "Click the following link to join the meeting " +
                "from your computer: " + BASE_URL + meetingId;
    dateNow = new Date().toISOString();
    destination = e.target.href;

    destination = destination.replace( "{MEET_LOCATION}", locationText );
    destination = destination.replace( "{MEET_DESCRIPTION}", inviteText );
    destination = destination.replace( "{MEET_DATETIME}", dateNow );

    chrome.tabs.create({ url: destination });

    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    var anchors = document.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', click);
    }
});
