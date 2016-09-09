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
 * date  : 2016-05-02
 */

var options = {};

options.restore_ = function() {
    var c = constants;
    var get = c.getDefaultValues();

    chrome.storage.sync.get(get
            , function(items) {
                document.getElementById("hide-list").value = items[c.HIDE_LIST_KEY];
                document.getElementById("ignore-list").value = items[c.IGNORE_LIST_KEY];
                document.getElementById("hide-room-icon").checked = items[c.HIDE_ROOM_ICON_KEY];
                document.getElementById("hide-user-icon").checked = items[c.HIDE_USER_ICON_KEY];
                document.getElementById("gray-own-post").checked = items[c.GRAY_OWN_POST_KEY];
                document.getElementById("user-name-color").value = items[c.USER_NAME_COLOR_KEY];
                document.getElementById("compress-rooms").checked = items[c.COMPRESS_ROOMS_KEY];
                document.getElementById("ng-word-list").value = items[c.NG_WORD_LIST_KEY];
            });
}

options.save_ = function() {
    var hideList = document.getElementById("hide-list").value;
    var ignoreList = document.getElementById("ignore-list").value;
    var ngWordList = document.getElementById("ng-word-list").value;
    var isHideRoomIcon = document.getElementById("hide-room-icon").checked;
    var isHideUserIcon = document.getElementById("hide-user-icon").checked;
    var isGrayOwnPost = document.getElementById("gray-own-post").checked;
    var userNameColor = document.getElementById("user-name-color").value;
    var isCompressRooms = document.getElementById("compress-rooms").checked;
    var c = constants;

    var set = {};
    set[c.HIDE_LIST_KEY] = hideList;
    set[c.IGNORE_LIST_KEY] = ignoreList;
    set[c.NG_WORD_LIST_KEY] = ngWordList;
    set[c.HIDE_ROOM_ICON_KEY] = isHideRoomIcon;
    set[c.HIDE_USER_ICON_KEY] = isHideUserIcon;
    set[c.GRAY_OWN_POST_KEY] = isGrayOwnPost;
    set[c.USER_NAME_COLOR_KEY] = userNameColor;
    set[c.COMPRESS_ROOMS_KEY] = isCompressRooms;

    chrome.storage.sync.set(set
            , function() {
                document.getElementById("submit").value = "Saved";
                options.restore_();
            });
}

options.windowOnLoad_ = function() {
    options.restore_();
    document.getElementById("submit").addEventListener("click",options.save_);
}

options.initialize_ = function() {
    window.addEventListener("load", options.windowOnLoad_);
}

options.initialize_();
