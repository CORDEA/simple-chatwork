/**
 *
 * Copyright 2016 Yoshihiro Tanaka
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Yoshihiro Tanaka <contact@cordea.jp>
 * date  : 2016-04-28
 */

content = {}

content.hideRoomList = undefined;

content.init_ = function() {
    var timeline = document.getElementById("_timeLine");
    timeline.addEventListener("DOMNodeInserted", content.hideUserIcons_);

    var rooms = document.getElementById("_roomListItems");
    rooms.addEventListener("DOMNodeInserted", content.hideRooms_);
    rooms.addEventListener("DOMNodeInserted", content.hideRoomIcons_);

    var mention = document.getElementById("_chatToUnreadStatus");
    mention.addEventListener("DOMAttrModified", content.showRoomsIfMention_);

    content.hideIcon_();
    content.hideRoomIcons_();
    content.hideRooms_();
    content.hideTopBarContents_();
    content.hideUserIcons_();
}

content.hideIcon_ = function() {
    var chats = document.getElementsByClassName("_message chatTimeLineMessage chatTimeLineMessageAnim clearfix");
    var chatFilterList = document.getElementById("_chatFilterList");
    chatFilterList.className = "cwTextUnselectable _cwBB";
    chatFilterList.style = "position: absolute; top: 6px; left: 40px; right: 40px;"
    var icons = chatFilterList.childNodes;
    icons[0].style = "display: none";
    icons[2].style = "display: none";
    icons[1].style = "width: 100%; border-radius: 3px";
}

content.hideTopBarContents_ = function() {
    var info = document.getElementById("_openInfomation");
    info.style = "display: none";
}

content.showRoomsIfMention_ = function() {
    content.getHideRoomList_(function(hideRooms) {
        var rooms = content.getRooms_();
        for (var i in hideRooms) {
            if (hideRooms[i] in rooms) {
                if (content.isMention_(rooms[hideRooms[i]])) {
                    rooms[hideRooms[i]].style = "";
                }
            }
        }
    });
}

content.hideRooms_ = function() {
    content.getHideRoomList_(function(hideRooms) {
        var rooms = content.getRooms_();
        for (var i in hideRooms) {
            if (hideRooms[i] in rooms) {
                if (!content.isMention_(rooms[hideRooms[i]])) {
                    rooms[hideRooms[i]].style = "display: none";
                }
            }
        }
    });
}

content.getHideRoomList_ = function(func) {
    if (content.hideRoomList !== undefined) {
        func(content.hideRoomList);
        return;
    }
    var c = constants;
    var get = {};
    get[c.HIDE_LIST_KEY] = "";

    chrome.storage.sync.get(get
            , function(items) {
                var listString = items[c.HIDE_LIST_KEY];
                var list = listString.split("\n");
                if (list.length > 0) {
                    content.hideRoomList = list;
                    func(list);
                }
            });
}

content.isMention_ = function(room) {
    var mention = room.getElementsByClassName("_mentionLabel");
    return mention.length > 0;
}

content.getRooms_ = function() {
    var rooms = document.getElementById("_roomListItems").childNodes;
    var validRooms = {};
    for (var i in rooms) {
        var room = rooms[i];
        if (room instanceof HTMLElement) {
            var name = room.getAttribute("aria-label");
            validRooms[name] = room;
        }
    }
    return validRooms;
}

content.hideRoomIcons_ = function() {
    var rooms = content.getRooms_();
    for (var k in rooms) {
        var room = rooms[k];
        var icon = room.getElementsByClassName("roomIcon");
        var meta = room.getElementsByClassName("chatListMeta");
        icon[0].style = "display: none";
        if (meta.length > 0) {
            meta[0].className = "";
        }
    }
}

content.hideUserIcons_ = function() {
    var timelines = document.getElementById("_timeLine").childNodes;
    for (var i in timelines) {
        var timeline = timelines[i];
        var name = timeline.className;
        if (name !== undefined && name.includes("chatTimeLineMessage")) {
            var avator = timeline.getElementsByClassName("avatarSpeaker");
            var message = timeline.getElementsByClassName("chatTimeLineMessageArea");
            if (avator.length > 0) {
                avator[0].style = "display: none";
            }
            message[0].style = "padding: 0px";
        }
    }
}

content.init_();

