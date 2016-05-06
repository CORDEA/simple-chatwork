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
content.ignoreRoomList = undefined;

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
    content.hideRooms_();
    content.hideRoomIcons_();
    content.hideUnreadBadge_();
}

content.hideRooms_ = function() {
    content.getBlackListRooms_(function(hideRooms) {
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
    }, constants.BlackListType.HIDE);
}

content.hideUnreadBadge_ = function() {
    content.getBlackListRooms_(function(ignoreRooms) {
        if (ignoreRooms.length === 0) {
            return;
        }
        var rooms = content.getRooms_();
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
    }, constants.BlackListType.IGNORE);
}

content.getBlackListRooms_ = function(func, type) {
    var HIDE = constants.BlackListType.HIDE;
    var IGNORE = constants.BlackListType.IGNORE;
    switch (type) {
        case HIDE:
            if (content.hideRoomList !== undefined) {
                func(content.hideRoomList);
                return;
            }
            break;
        case IGNORE:
            if (content.ignoreRoomList !== undefined) {
                func(content.ignoreRoomList);
                return;
            }
            break;
    }
    
    var c = constants;
    var get = {};
    get[c.HIDE_LIST_KEY] = "";
    get[c.IGNORE_LIST_KEY] = "";

    chrome.storage.sync.get(get
            , function(items) {
                var hideListString = items[c.HIDE_LIST_KEY];
                var ignoreListString = items[c.IGNORE_LIST_KEY];
                var hideList = hideListString.split("\n");
                var ignoreList = ignoreListString.split("\n");
                content.hideRoomList = hideList;
                content.ignoreRoomList = ignoreList;

                switch (type) {
                    case HIDE:
                        func(hideList);
                        break;
                    case IGNORE:
                        func(ignoreList)
                        break;
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
        if (icon.length > 0) {
            icon[0].style = "display: none";
        }
        if (meta.length > 0) {
            meta[0].className = "";
        }
    }
}

content.fixTimelineLayout_ = function() {
    var timelines = document.getElementById("_timeLine").childNodes;
    for (var i in timelines) {
        var timeline = timelines[i];
        var name = timeline.className;
        if (name !== undefined && name.includes("chatTimeLineMessage")) {
            var avator = timeline.getElementsByClassName("avatarSpeaker");
            var nameContainer = timeline.getElementsByClassName("_speakerName chatName");
            var org = timeline.getElementsByClassName("chatNameOrgname");
            var message = timeline.getElementsByClassName("chatTimeLineMessageArea");
            if (avator.length > 0) {
                avator[0].style = "height: 0px; width: 0px";
                var image = avator[0].getElementsByTagName("img");
                image[0].style = "height: 0px; width: 0px";
            }
            var span = nameContainer[0].getElementsByTagName("span");
            if (org.length > 0) {
                org[0].style = "display: none";
            }
            message[0].style = "padding: 0px";
            if (timeline.className.includes("chatTimeLineMessageMine")) {
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
            } else {
                if (span.length > 0) {
                    span[0].style = "color: black";
                }
            }
        }
    }
}

content.fixRoomLayout_ = function(mutations) {
    mutations.forEach(function(mutation) {
        var nodes = mutation.addedNodes;
        if (nodes.length > 0) {
            if (nodes[0].className.includes("_roomTitleText")) {
                nodes[0].style = "font-size: small";
            }
        }
    });
}

content.init_();
