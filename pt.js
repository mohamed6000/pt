(function(){
    function create_xml_http_request()
    {
        return new XMLHttpRequest();
    }
    function get_data(url, callback)
    {
        const xhr = create_xml_http_request();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
            {
                callback(xhr.responseText);
            }
        };
        xhr.open("GET", url);
        xhr.send();
    }
    function send_data(url, data, callback)
    {
        const xhr = create_xml_http_request();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
            {
                callback(xhr.responseText);
            }
        };
        xhr.send(data);
    }

    const get_elements = document.querySelectorAll("[pt-get]");
    console.log(get_elements);
    for (var i = 0; i < get_elements.length; ++i)
    {
        const e = get_elements[i];
        const pt_event = "click";
        e.addEventListener(pt_event, function(){
            var pt_target = e;
            if (e.hasAttribute("pt-target"))
            {
                pt_target = document.querySelector(e.getAttribute("pt-target"));
            }
            get_data(e.getAttribute("pt-get"), function(data){
                pt_target.innerHTML = data;
            });
        });
    }

    const post_elements = document.querySelectorAll("[pt-post]");
    console.log(post_elements);
    for (var i = 0; i < post_elements.length; ++i)
    {
        const e = post_elements[i];
        const pt_event = "click";
        e.addEventListener(pt_event, function(){
            var pt_target = e;
            if (e.hasAttribute("pt-target"))
            {
                pt_target = document.querySelector(e.getAttribute("pt-target"));
            }
            var data_to_send = null;
            if (e.nodeName === "FORM")
            {
                e.onsubmit = function(event)
                {
                    event.preventDefault();
                    const fd = new FormData(event.target);

                    // Turn the data object into an array of URL-encoded key/value pairs.
                    data_to_send = {};
                    fd.forEach(function(val, key){
                        data_to_send[key] = val;
                    });
                    
                    send_data(e.getAttribute("pt-post"), JSON.stringify(data_to_send), function(res){
                        pt_target.innerHTML = res;
                    });
                };
            }
            else
            {
                if (e.hasAttribute("pt-data"))
                {
                    data_to_send = document.getElementsByName(e.getAttribute("pt-data"))[0].value;
                    send_data(e.getAttribute("pt-post"), data_to_send, function(res){
                        pt_target.innerHTML = res;
                    });
                }
            }
        });
    }
})();