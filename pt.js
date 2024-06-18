/*

    pt(papatwitch) advanced framework:
    
    get rid of javascript and send http requests to your backend 
    directly using html!

    less to write and a simpler system

    inspired by primer.js

    written by Mohamed Touiti (papatwitch)

*/
!function(){
    var doc = document,
        htm = doc.documentElement,
        lct = null, // last click target
        nearest = function(elm) {
            while (true) {
                if (!elm) break;
                if (elm.hasAttribute("pt-get")) break;
                if (elm.hasAttribute("data-pt-get")) break;
                if (elm.hasAttribute("pt-post")) break;
                if (elm.hasAttribute("data-pt-post")) break;

                elm = elm.parentElement;
            }

            return elm;
        };

    const _AjaxHelper = function() {
        const xhr = new XMLHttpRequest();
        
        this.get = function(url, callback) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };
            xhr.open("GET", url);
            xhr.send();
        };

        this.post = function(url, data, callback) {
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(data);
        };
    };
    var _Ajax = new _AjaxHelper();

    
    htm.onclick = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        href      = elem.dataset.ptGet || elem.getAttribute("pt-get"),
        post_href = elem.dataset.ptPost || elem.getAttribute("pt-post"),
        target    = document.querySelector(elem.dataset.ptTarget || elem.getAttribute("pt-target")) || elem,
        replace   = elem.dataset.ptReplace || elem.getAttribute("pt-replace") || "innerHTML";

        if (href) {
            _Ajax.get(href, function(data){
                target[replace] = data;
            });
        } else if (post_href) {
            const data_to_send = {};
            var include = elem.dataset.ptInclude || elem.getAttribute("pt-include");
            if (include) {
                var include_input = document.querySelector(include);
                if (!include_input) {
                    console.error("Failed to retreive the input: " + include);
                } else {
                    const include_name = include_input.name;
                    if (!include_name) {
                        console.error("Failed to get input name (probably you didn't set the name of the input you want to process).\nHint: " + include);
                    } else {
                        data_to_send[include_name] = include_input.value;
                    }
                }
            }
            
            _Ajax.post(post_href, new URLSearchParams(data_to_send), function(data){
                target[replace] = data;
            });
        }
    };

    htm.onsubmit = function(e) {
        e = e || window.event;
        var elem      = e.target || e.srcElement,
            href      = elem.dataset.ptGet || elem.getAttribute("pt-get"),
            post_href = elem.dataset.ptPost || elem.getAttribute("pt-post");

        if (!elem || elem.nodeName != "FORM" || (!href && !post_href)) {
            return;
        }

        var target  = document.querySelector(elem.dataset.ptTarget || elem.getAttribute("pt-target")) || elem,
            replace = elem.dataset.ptReplace || elem.getAttribute("pt-replace") || "innerHTML";

        const fd = new FormData(e.target);
        // Turn the data object into an array of URL-encoded key/value pairs.
        const data_to_send = {};
        fd.forEach(function(val, key){
            data_to_send[key] = val;
        });
        
        const url_params = new URLSearchParams(data_to_send);
        if (href) {
            var full_url = href;
            if (href.indexOf("?") == -1) {
                full_url += "?" + url_params;
            } else {
                full_url += "&" + url_params;
            }

            _Ajax.get(full_url, function(data){
                target[replace] = data;
            });
        } else if (post_href) {            
            _Ajax.post(post_href, url_params, function(data){
                target[replace] = data;
            });
        }

        return false;
    };
}();