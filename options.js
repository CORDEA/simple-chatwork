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

options.restore = function() {
    var c = constants;
    var get = {}
    get[c.HIDE_LIST_KEY] = ""
    get[c.IGNORE_LIST_KEY] = ""

    chrome.storage.sync.get(get
            , function(items) {
                document.getElementById("hide-list").value = items[c.HIDE_LIST_KEY];
                document.getElementById("ignore-list").value = items[c.IGNORE_LIST_KEY];
            });
}

options.save = function() {
    var hideList = document.getElementById("hide-list").value;
    var ignoreList = document.getElementById("ignore-list").value;
    var c = constants;

    var set = {};
    set[c.HIDE_LIST_KEY] = hideList;
    set[c.IGNORE_LIST_KEY] = ignoreList;

    chrome.storage.sync.set(set
            , function() {
                document.getElementById("submit").value = "Saved";
                options.restore();
            });
}

options.windowOnLoad_ = function() {
    options.restore();
    document.getElementById("submit").addEventListener("click",options.save);
}

options.initialize_ = function() {
    window.addEventListener("load", options.windowOnLoad_);
}

options.initialize_();
