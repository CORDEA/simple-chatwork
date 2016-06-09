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

content.values = {}

content.init_ = function() {
    var title = document.getElementsByTagName("title")[0];
    title.innerText = constants.DEFAULT_TITLE;
    new MutationObserver(content.fixTitle_)
        .observe(title, {childList: true});

    var timeline = document.getElementById("_timeLine");
    new MutationObserver(content.fixTimelineLayout_)
        .observe(timeline, {childList: true});

    var rooms = document.getElementById("_roomListItems");
    new MutationObserver(content.hideUnnecessaryRoomItems_)
        .observe(rooms, {childList: true});

    var roomTitle = document.getElementById("_roomTitle");
    new MutationObserver(content.fixRoomLayout_)
        .observe(roomTitle, {childList: true});

    content.hideMenuIcon_();
    content.hideUnnecessaryRoomItems_();
    content.hideTopBarContents_();
    content.fixTimelineLayout_();
}

content.fixTitle_ = function(mutations) {
    var target = mutations[0].target;
    target.innerText = constants.DEFAULT_TITLE;
}

content.hideMenuIcon_ = function() {
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
    var contact = document.getElementById("_openContactWindow");
    contact.style = "display: none";
}

content.hideUnnecessaryRoomItems_ = function() {
    content.hideRoomIcons_();
    content.fixRoomListLayout_();
    content.hideRooms_();
}

content.hideRooms_ = function() {
    content.getValueFromStorage_(function(hideRooms) {
        if (hideRooms.length === 0) {
            return;
        }
        var rooms = content.getRooms_();
        for (var i in hideRooms) {
            if (hideRooms[i] in rooms) {
                if (!content.isMention_(rooms[hideRooms[i]])) {
                    rooms[hideRooms[i]].style = "display: none";
                }
            }
        }
    }, constants.StorageType.HIDE);
}

content.fixRoomListLayout_ = function() {
    content.getValueFromStorage_(function(ignoreRooms) {
        var rooms = content.getRooms_();
        content.compressRooms_(rooms, ignoreRooms);
        if (ignoreRooms.length === 0) {
            return;
        }
        for (var i in ignoreRooms) {
            if (ignoreRooms[i] in rooms) {
                var room = rooms[ignoreRooms[i]];
                var badge = room.getElementsByClassName("_unreadBadge unread");
                var mention = room.getElementsByClassName("_mentionLabel");
                if (badge.length > 0) {
                    badge[0].style = "display: none";
                }
                if (mention.length > 0) {
                    mention[0].style = "margin: 0px";
                }
            }
        }
    }, constants.StorageType.IGNORE);
}

content.compressRooms_ = function(rooms, ignoreRooms) {
    content.getValueFromStorage_(function(isCompressRooms) {
        if (!isCompressRooms) {
            return;
        }
        for (var i in rooms) {
            var room = rooms[i];
            room.style = "font-weight: 400; height: 16px; min-height: 0px";
            var pin = room.getElementsByClassName("chatListPin");
            if (pin.length > 0) {
                pin[0].style = "top: 1px";
            }
            var incomp = room.getElementsByClassName("incomplete");
            if (incomp.length > 0) {
                incomp.style = "display: none";
            }

            if (ignoreRooms.indexOf(i) > -1) {
                continue;
            }
            content.changeUnreadBadge_(room);
        }
    }, constants.StorageType.COMPRESS_ROOMS);
}

content.changeUnreadBadge_ = function(room) {
    var badge = room.getElementsByClassName("_unreadBadge unread");
    var mention = room.getElementsByClassName("_mentionLabel");
    var add = "";

    if (badge.length > 0) {
        add = "*";
    }
    if (mention.length > 0) {
        add = "+";
    }
    if (add.length > 0) {
        var incomplete = room.getElementsByClassName("incomplete")[0];
        incomplete.style = "display: none";
    }

    var title = room.getElementsByClassName("chatListTitleArea");
    if (title.length > 0) {
        title[0].innerText = add + title[0].innerText;
    }
}

content.getValueFromStorage_ = function(func, type) {
    var c = constants;

    var HIDE = c.StorageType.HIDE
    var IGNORE = c.StorageType.IGNORE;
    var HIDE_ROOM = c.StorageType.HIDE_ROOM;
    var HIDE_USER = c.StorageType.HIDE_USER;
    var USER_COLOR = c.StorageType.USER_COLOR;
    var OWN_POST = c.StorageType.OWN_POST;
    var COMPRESS_ROOMS = c.StorageType.COMPRESS_ROOMS;

    if (content.values[type] !== undefined) {
        func(content.values[type]);
        return;
    }
    
    var get = c.getDefaultValues();

    chrome.storage.sync.get(get
            , function(items) {
                var hideListString = items[c.HIDE_LIST_KEY];
                var ignoreListString = items[c.IGNORE_LIST_KEY];

                content.values[HIDE] = hideListString.split("\n");
                content.values[IGNORE] = ignoreListString.split("\n");
                content.values[HIDE_USER] = items[c.HIDE_USER_ICON_KEY];
                content.values[HIDE_ROOM] = items[c.HIDE_ROOM_ICON_KEY];
                content.values[USER_COLOR] = items[c.USER_NAME_COLOR_KEY];
                content.values[OWN_POST] = items[c.GRAY_OWN_POST_KEY];
                content.values[COMPRESS_ROOMS] = items[c.COMPRESS_ROOMS_KEY];

                func(content.values[type]);
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
    content.getValueFromStorage_(function(isHideRoom) {
        if (!isHideRoom) {
            return;
        }
        var rooms = content.getRooms_();
        for (var k in rooms) {
            var room = rooms[k];
            var icon = room.getElementsByClassName("roomIcon");
            var meta = room.getElementsByClassName("chatListMeta");
            if (icon.length > 0) {
                icon[0].style = "display: none";
            }
            if (meta.length > 0) {
                meta[0].className = "";
            }
        }
    }, constants.StorageType.HIDE_ROOM);
}

content.fixTimelineLayout_ = function() {
    var timelines = document.getElementById("_timeLine").childNodes;
    for (var i in timelines) {
        var timeline = timelines[i];
        var name = timeline.className;
        if (name !== undefined && name.includes("chatTimeLineMessage")) {
            var nameContainer = timeline.getElementsByClassName("_speakerName chatName");
            content.hideUserIcon_(timeline);
            var org = timeline.getElementsByClassName("chatNameOrgname");
            var span = nameContainer[0].getElementsByTagName("span");
            if (org.length > 0) {
                org[0].style = "display: none";
            }
            if (timeline.className.includes("chatTimeLineMessageMine")) {
                content.changeGrayOfOwnPosts_(timeline, span);
            } else {
                content.changeNameColor_(span);
            }
        }
    }
}

content.hideUserIcon_ = function(timeline) {
    content.getValueFromStorage_(function(isHideUser) {
        if (!isHideUser) {
            return;
        }
        var message = timeline.getElementsByClassName("chatTimeLineMessageArea");
        var avator = timeline.getElementsByClassName("avatarSpeaker");
        if (avator.length > 0) {
            avator[0].style = "height: 0px; width: 0px";
            var image = avator[0].getElementsByTagName("img");
            image[0].style = "height: 0px; width: 0px";
        }
        message[0].style = "padding: 0px";
    }, constants.StorageType.HIDE_USER);
}

content.changeGrayOfOwnPosts_ = function(timeline, span) {
    content.getValueFromStorage_(function(isOwnPost) {
        if (!isOwnPost) {
            content.changeNameColor_(span);
            return;
        }
        if (span.length > 0) {
            span[0].style = "color: gray";
        }
        var pre = timeline.getElementsByTagName("pre");
        if (pre.length > 0) {
            pre[0].style = "color: gray";
            var repDiv = pre[0].getElementsByClassName("chatTimeLineReply _replyMessage");
            if (repDiv.length > 0) {
                repDiv[0].style = "background: gray";
            }
            var toSpan = pre[0].getElementsByClassName("chatTimeLineTo");
            if (toSpan.length > 0) {
                toSpan[0].style = "background: gray";
            }
        }
    }, constants.StorageType.OWN_POST);
}

content.changeNameColor_ = function(span) {
    content.getValueFromStorage_(function(userColor) {
        if (!userColor.startsWith("#")) {
            return;
        }
        if (span.length > 0) {
            span[0].style = "color: " + userColor;
        }
    }, constants.StorageType.USER_COLOR);
}

content.fixRoomLayout_ = function(mutations) {
    mutations.forEach(function(mutation) {
        var nodes = mutation.addedNodes;
        if (nodes.length > 0) {
            if (nodes[0].className.includes("_roomTitleText")) {
                nodes[0].style = "font-size: small";
            }
            if (nodes[1].className.includes("_pin")) {
                nodes[1].style = "display: none";
            }
        }
    });
}

content.init_();
