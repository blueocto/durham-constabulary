       function loadcssfile(filename) {
    var $ = document; // shortcut

    //if (!$.getElementById(cssId)) {
        var head = $.getElementsByTagName('head')[0];
        var link = $.getElementById('ctl00_textsize'); //$.createElement('link');
        //link.id = cssId;
        //link.rel = 'stylesheet';
        //link.type = 'text/css';
        link.href = filename;
        //link.media = 'all';
        //head.appendChild(link);
    //} 
   
}



function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setsize(size) {
    
    setCookie("textsize", size, 30);
    loadCSS(size);
    
    

}

function loadCSS(size) {
    switch (size) {
        case "1":
            setActive(size);
            loadcssfile("/style%20library/css/small_text.css");
            break;
        case "2":
           setActive(size);
            loadcssfile("/style%20library/css/medium_text.css");
            break;

        case "3":
         setActive(size);
            loadcssfile("/style%20library/css/large_text.css");
            break;
       
    }

}

 function setActive(size){
        var lid = '#ts' + size;

        $("#ts1").removeClass('active');
        $("#ts2").removeClass('active');
        $("#ts3").removeClass('active');
        
        $(lid).addClass('active');
        

    }


function removeCSS(css) {
    var $ = document;
    var head = $.getElementsByTagName('head')[0];
    head.removeChild(css);
    
   // document.getElementsByTagName('link')[css].disabled = true;

}

function removeAllCSS() {

    removeCSS("small");
    removeCSS("medium");
    removeCSS("large");
    

}

function clear() {
    setCookie("textsize", 1, -1);
}

//removeCSS("hide");

if (getCookie("textsize") == null) {
    
    setActive('1');
    loadcssfile("/style%20library/css/small_text.css");
}
else {
    loadCSS(getCookie("textsize"));    
}


