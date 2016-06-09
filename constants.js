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

var constants = {};

constants.StorageType = {
    HIDE: 0,
    IGNORE: 1,
    HIDE_ROOM: 2,
    HIDE_USER: 3,
    USER_COLOR: 4,
    OWN_POST: 5,
    COMPRESS_ROOMS: 6
};

constants.DEFAULT_TITLE = "Chatwork";

constants.HIDE_LIST_KEY = "HideList";
constants.IGNORE_LIST_KEY = "IgnoreList";
constants.HIDE_USER_ICON_KEY = "HideUserIcon";
constants.HIDE_ROOM_ICON_KEY = "HideRoomIcon";
constants.USER_NAME_COLOR_KEY = "UserNameColor";
constants.GRAY_OWN_POST_KEY = "GrayOwnPost";
constants.COMPRESS_ROOMS_KEY = "CompressRooms";

constants.getDefaultValues = function() {
    var defaults = {};
    defaults[constants.HIDE_LIST_KEY] = ""
    defaults[constants.IGNORE_LIST_KEY] = ""
    defaults[constants.HIDE_ROOM_ICON_KEY] = false;
    defaults[constants.HIDE_USER_ICON_KEY] = false;
    defaults[constants.GRAY_OWN_POST_KEY] = false;
    defaults[constants.USER_NAME_COLOR_KEY] = "";
    defaults[constants.COMPRESS_ROOMS_KEY] = false;
    return defaults;
}
