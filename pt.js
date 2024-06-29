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
            xhr.open("GET", url);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    callback(xhr.readyState, xhr.responseText);
                }
            };
            xhr.send(null);
        };

        this.post = function(url, data, callback, form_has_files_to_upload) {
            xhr.open("POST", url, true);
            if ((false == form_has_files_to_upload) || !form_has_files_to_upload) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                data = new URLSearchParams(data);
            }
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    callback(xhr.readyState, xhr.responseText);
                }
            };
            xhr.send(data);
        };
    };
    var _Ajax = new _AjaxHelper();

    
    function get_default_event_based_on_input_type(elm) {
        if ((elm.nodeName == "INPUT") || (elm.nodeName == "TEXTAREA") || (elm.nodeName == "SELECT")) {
            return "change";
        } else {
            return "click";
        }
    }

    function is_default_clickable_element(elm) {
        if ((elm.nodeName == "INPUT") || (elm.nodeName == "TEXTAREA") || (elm.nodeName == "SELECT")) {
            return false;
        } else {
            return true;
        }
    }

    function generate_uri_from_data_set(uri, data) {
        var result = uri;
        if (uri) {
            const url_params = new URLSearchParams(data);
            if (uri.indexOf("?") == -1) {
                result += "?" + url_params;
            } else {
                result += "&" + url_params;
            }
        }

        return result;
    }

    function send_http_request_from_info_set(infos, form_has_files_to_upload = false) {
        if (infos.indicator) {
            infos.indicator.classList.add("pt-request");
        }

        if (infos.request_type == "get") {           
            _Ajax.get(infos.uri, function(request, res) {
                if (request == XMLHttpRequest.DONE) {
                    infos.target.classList.add("pt-replace");
                    infos.target[infos.replace_method] = res;
                } else {
                    if (infos.indicator) {
                        infos.indicator.classList.add("pt-request");
                    }
                }
            });
        } else if (infos.request_type == "post") {
            _Ajax.post(infos.uri, infos.data_to_send, function(request, res) {
                if (request == XMLHttpRequest.DONE) {
                    infos.target.classList.add("pt-replace");
                    infos.target[infos.replace_method] = res;
                } else {
                    if (infos.indicator) {
                        infos.indicator.classList.add("pt-request");
                    }
                }
            }, form_has_files_to_upload);
        }
    }

    function register_event_handler(elm, infos, used_event) {
        elm.used_infos_set = infos;
        elm.addEventListener(used_event, function(e) {
            send_http_request_from_info_set(elm.used_infos_set);
        });
    }

    function extract_value_unit(str) {
        var arr = str.match(/(-?[\d.]+)([a-z%]*)/);
        return {value: parseInt(arr[1]), unit: arr[2]};
    }

    function get_delay_amount(str) {
        const every_amount = extract_value_unit(str.substring("refresh".length, str.length));
        var delay = every_amount.value;
        if (every_amount.unit == "s") {
            delay = delay * 1000;
        } else if (every_amount.unit == "m") {
            delay = delay * 1000 * 60;
        }

        return delay;
    }

    function get_infos_set(elem) {
        const infos = {
            request_type: null,
            uri: null,
            target: elem,
            replace_method: "innerHTML",
            indicator: null,
            include: null,
            data_to_send: {},
        };

        if (elem.hasAttribute("pt-get") || elem.hasAttribute("data-pt-get")) {
            infos.request_type = "get";
            infos.uri = elem.dataset.ptGet || elem.getAttribute("pt-get");
        } else if (elem.hasAttribute("pt-post") || elem.hasAttribute("data-pt-post")) {
            infos.request_type = "post";
            infos.uri = elem.dataset.ptPost || elem.getAttribute("pt-post");
        }

        infos.target         = document.querySelector(elem.dataset.ptTarget || elem.getAttribute("pt-target")) || elem || document.querySelector(elem.getAttribute("id"));
        infos.replace_method = elem.dataset.ptReplace || elem.getAttribute("pt-replace") || "innerHTML";
        infos.indicator      = document.querySelector(elem.dataset.ptIndicator || elem.getAttribute("pt-indicator")) || null;

        if (elem.hasAttribute("pt-include") || elem.hasAttribute("data-pt-include")) {
            const selector = elem.dataset.ptInclude || elem.getAttribute("pt-include");
            if (selector == "") {
                infos.include = elem;
            } else {
                infos.include = document.querySelector(selector);
            }
        }

        if (infos.include) {
            if (infos.include.nodeName == "INPUT" || infos.include.nodeName == "TEXTAREA") {
                if (infos.include.name && (infos.include.name != "")) {
                    infos.data_to_send = {};
                    infos.data_to_send[infos.include.name] = infos.include.value;

                    // @note: only for get
                    if (infos.request_type == "get") {
                        infos.uri = generate_uri_from_data_set(infos.uri, infos.data_to_send);
                    }

                } else {
                    console.error("Error: Your input has no name field");
                    console.error("Error: ", infos.include);
                    console.error("From: ", elem);
                }
            } else {
                console.error("Error: Your pt-include input is not a valid input element");
                console.error("Error: ", infos.include);
                console.error("From: ", elem);
            }
        }

        return infos;
    }

    function process_element(elm) {
        const infos = get_infos_set(elm);
        send_http_request_from_info_set(infos);
    }


    // major events
    htm.onchange = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        const default_event_based_on_input_type = get_default_event_based_on_input_type(elem);
        const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
        if (used_event == default_event_based_on_input_type) {
            process_element(elem);
        } else {
            // default event of element has changed let's register it
            register_event_handler(elem, get_infos_set(elem), used_event);
        }
    };

    htm.oninput = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
        if (used_event == "input") {
            process_element(elem);
        }
    };

    htm.onclick = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        const default_event_based_on_input_type = get_default_event_based_on_input_type(elem);
        const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || default_event_based_on_input_type;
        if (is_default_clickable_element(elem)) {
            if (used_event == default_event_based_on_input_type) {
                process_element(elem);
            }
        }
    };

    htm.onmouseover = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
        if (used_event == "mouseover") {
            process_element(elem);
        }
    };

    htm.onmouseout = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName == "FORM") {
            return;
        }

        const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
        if (used_event == "mouseout") {
            process_element(elem);
        }
    };

    htm.onsubmit = function(e) {
        e = e || window.event;
        lct = e.target || e.srcElement;

        var elem      = nearest(lct);
        if (!elem || elem.nodeName != "FORM") {
            return;
        }

        const infos = get_infos_set(elem);
        if (!infos.uri) return;

        const fd = new FormData(e.target);
        const form_has_files_to_upload = e.target.querySelector("input[type=file]") != null;
        
        infos.data_to_send = fd;
        if (infos.request_type == "get") {
            infos.uri = generate_uri_from_data_set(infos.uri, infos.data_to_send);
        }
        send_http_request_from_info_set(infos, form_has_files_to_upload);

        return false;
    };

    // add css
    {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        const my_css = `.pt-indicator {
                opacity: 0;
                transition: opacity 500ms ease-in;
            }
            .pt-request .pt-indicator {
                opacity: 1;
            }
            .pt-request.pt-indicator{
                opacity: 1;
            }`;

        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = my_css;
        } else {                // the world
            s.appendChild(document.createTextNode(my_css));
        }
        head.appendChild(s);
    }

    document.onreadystatechange = function(e) {
        if (document.readyState == "interactive") {
            // get on load elements
            {
                const _lls = doc.querySelectorAll("[pt-event='load']");
                for (var i = 0; i < _lls.length; ++i) {
                    process_element(_lls[i]);
                }
                const _dlls = doc.querySelectorAll("[data-pt-event='load']");
                for (var i = 0; i < _dlls.length; ++i) {
                    process_element(_dlls[i]);
                }
            }

            // get refreshable elements
            {
                const _rls = doc.querySelectorAll("[pt-event*='refresh']");
                for (var i = 0; i < _rls.length; ++i) {
                    const elem = _rls[i];
                    const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
                    if (used_event.indexOf("refresh", 0) == 0) {
                        const delay = get_delay_amount(used_event);
                        const infos = get_infos_set(elem);

                        // @todo: should we fire the event for the first time and then
                        // wait for a delay ?
                        setInterval(function(){
                            send_http_request_from_info_set(infos);
                        }, delay);
                    } else {
                        console.error("Error: Unknown event '" + used_event + "'");
                    }
                }
                const _drls = doc.querySelectorAll("[data-pt-event*='refresh']");
                for (var i = 0; i < _drls.length; ++i) {
                    const elem = _drls[i];
                    const used_event = elem.dataset.ptEvent || elem.getAttribute("pt-event") || get_default_event_based_on_input_type(elem);
                    if (used_event.indexOf("refresh", 0) == 0) {
                        const delay = get_delay_amount(used_event);
                        const infos = get_infos_set(elem);

                        // @todo: should we fire the event for the first time and then
                        // wait for a delay ?
                        setInterval(function(){
                            send_http_request_from_info_set(infos);
                        }, delay);
                    } else {
                        console.error("Error: Unknown event '" + used_event + "'");
                    }
                }
            }
        }
    };
}();