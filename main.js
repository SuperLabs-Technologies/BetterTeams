function getElementByTid(dataTid) {
    return document.querySelector('[data-tid="' + dataTid + '"]');
}


/* Load teams components */
var topBarElement = getElementByTid("app-header-bar"); /* The top bar background */
var topBarSearchElement = getElementByTid("headerSearchInput"); /* The top bar search box */

var navigationElement = getElementByTid("app-bar"); /* The left navigation bar */

var chatsElement = getElementByTid("left-rail").parentElement; /* The left chat list */
var getChatElements = function() { return document.getElementsByClassName("recipient-group-list-item"); } /* Gets chat cards from the left chat list */

var messageAreaElement = getElementByTid("app-layout-area--main");


/* Initializing potential themes */
function InitializeTheme() {
    topBarElement.style.backgroundColor = "#161b22";

    navigationElement.style.backgroundColor = "#0d1117";
    topBarSearchElement.style.backgroundColor = "transparent";
    topBarSearchElement.style.border = "solid 1px #30363d";
    topBarSearchElement.style.placeholder = "#c9d1d9";

    chatsElement.style.backgroundColor = "#0d1117";

    var chats = getChatElements()
    for(i = 0; i < chats.length; i++)
    {
        chats[i].style.backgroundColor = "transparent";
        chats[i].style.border = "solid 1px #30363d";
        chats[i].style.borderRadius = "8px";
        chats[i].childNodes[0].style.color = "#FFFFFF";
    }
}
InitializeTheme();


/* Initialize client */
function InitializeUI() {
    var extensionsBarElement = document.querySelector('[data-tid="newMessageCommands-expand-compose"]').parentElement;
    var extensionButton = document.createElement('button');
    extensionsBarElement.insertAdjacentElement('afterbegin', extensionButton);
    extensionButton.outerHTML = '<button title="Manage extensions" onclick="ToggleUIStatus()" style="cursor: pointer; border: solid transparent; background-color: transparent; display: flex; justify-content: center; align-items: center; padding-top: 2px;" width="32" height="32"> <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14"> <path d="M7,0H4A4,4,0,0,0,0,4V7a4,4,0,0,0,4,4H7a4,4,0,0,0,4-4V4A4,4,0,0,0,7,0ZM9,7A2,2,0,0,1,7,9H4A2,2,0,0,1,2,7V4A2,2,0,0,1,4,2H7A2,2,0,0,1,9,4Z" fill="#424242"/> <path d="M7,13H4a4,4,0,0,0-4,4v3a4,4,0,0,0,4,4H7a4,4,0,0,0,4-4V17A4,4,0,0,0,7,13Zm2,7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V17a2,2,0,0,1,2-2H7a2,2,0,0,1,2,2Z" fill="#424242"/> <path d="M20,13H17a4,4,0,0,0-4,4v3a4,4,0,0,0,4,4h3a4,4,0,0,0,4-4V17A4,4,0,0,0,20,13Zm2,7a2,2,0,0,1-2,2H17a2,2,0,0,1-2-2V17a2,2,0,0,1,2-2h3a2,2,0,0,1,2,2Z" fill="#424242"/> <path d="M14,7h3v3a1,1,0,0,0,2,0V7h3a1,1,0,0,0,0-2H19V2a1,1,0,0,0-2,0V5H14a1,1,0,0,0,0,2Z" fill="#424242"/> </svg></button>';

    var aboveChatBoxElement = document.querySelector('[aria-labelledby="chat-pane-compose-message-text"]');
    var extensionsPanel = document.createElement('div');
    aboveChatBoxElement.insertAdjacentElement('afterbegin', extensionsPanel);
    extensionsPanel.outerHTML = '<div id="teamsextension"><h1>Better Teams</h1>' + '<div style="display: flex; justify-content: space-between;"><p>Colon to use emojis (example; :smile:)</p><p>Enabled</p></div></div>';
}

InitializeUI();

var extensionUI = document.getElementById('teamsextension');
function ToggleUIStatus() {
    extensionUI.style.visibility = "hidden";
}


/* RELEASE */
var chatBoxElement = document.querySelector(
    'div[data-tid="ckeditor"]',
);
chatBoxElement.innerHTML = ""; // Converting body to text
// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
const emojis = await fetch(
    "https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json",
).then((response) => response.json());
chatBoxElement.addEventListener("input", function (e) {
    var pRemove = chatBoxElement.innerHTML.replace("<p>", "").replace("</p>", "");
    var semRemove = pRemove.replace(
            /<semantic-object data-mutation-id=\".*\">/g,
            "",
    ).replace("</semantic-object>", "");
    var words = semRemove.split(" ");
    for (const word of words) {
            if (word.startsWith(":") && word.endsWith(":")) {
                    const tmpWord = word.substring(1);
                    const requestedEmoji = tmpWord.substring(0, tmpWord.length - 1);
                    const emoji = emojis[requestedEmoji];
                    if (emoji) {
                            chatBoxElement.innerHTML = chatBoxElement.innerHTML.replace(
                                    word,
                                    emoji,
                            );
                            setEndOfContenteditable(chatBoxElement);
                    }
            }
    }
});
// https://stackoverflow.com/a/44806604
function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) { //Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange(); //Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection(); //get the selection object (allows you to change selection)
            selection.removeAllRanges(); //remove any selections already made
            selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) { //IE 8 and lower
            range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
            range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
            range.select(); //Select the range (make it the visible selection
    }
}
