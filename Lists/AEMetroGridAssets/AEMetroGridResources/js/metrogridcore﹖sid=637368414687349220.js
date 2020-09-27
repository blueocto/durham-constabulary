
if (typeof metroGrid == 'undefined') {
    var metroGrid = {};
    metroGrid.globals = {};
    metroGrid.classes = {};
}


// init global vars
metroGrid.globals.setting_id = "";

metroGrid.globals.setting_icon_data = "data:image/gif;base64,R0lGODlhEAAQANUAAP////39/PT3+O7x9u/v7uLn6+Pn6+Dn7d3l7d3j6Nzh5Nfg6N7f39rd4tLb5dHZ49PY39HZ4dPV2MXN1r/Gzb7FzLrE0bnCybS+yLa8wbi8v6uxt6mwtqissJ2su6Sor6CnrpujrJagqZCcqYiVoYOQnIOPmYCNmXeDkHeDjniDjnR+iXJ9iXN9h3B7h2x5hGZtd2NsdlNgaVNeaVBdZ01WYExWYUVPWUJNVy87Ri45RCg0PygzPv///wAAAAAAACH5BAEHAD0ALAAAAAAQABAAAAavwJ5wSCqVSMOk0Ng7AQCnHjNpqgxQqMMBO6iIhjTKQCB4PskDikwoG3gghMLjUSBAPIM1m8GwpHQ6KRZ8eiosLxIXIzdCNSMXEi8sKi5PGhMzSTMTGk8uKwsLHQmZQzMJHaErOTw2HxkfpTOvHzY8OUI2ESEKsbMKIRE2QzsRBhEgDRsbDSDGETtCOxwRGNUICNbWHNHSLRE4MdgxOBEt3cTRMA4OMD076Erv8PFCQQA7";

metroGrid.globals.def_slider_idx_image = 0;
metroGrid.globals.def_slider_idx_color = 0; // sky
metroGrid.globals.def_slider_idx_size = 5; // 112px

metroGrid.globals.$txtImageAlt = null;
metroGrid.globals.$txtMetroLabel = null;
metroGrid.globals.$txtMetroUrl = null;
metroGrid.globals.$txtMetroDescr = null;
metroGrid.globals.$txtMetroTileSpan = null;
metroGrid.globals.$chkMetroOpenInNew = null;
metroGrid.globals.$chkMetroFlipText = null;
metroGrid.globals.$modal = null;

metroGrid.globals.$mg_slider_size = null;
metroGrid.globals.$mg_slider_image = null;
metroGrid.globals.$mg_slider_color = null;

metroGrid.globals.gridSquareTemplate = "<li mg-attr-id=\"{{tileid}}\" class=\"{{color}}\" style=\"{{liStyle}}\" mg-attr-mgimgsize=\"{{mgimgsize}}\"><a href=\"{{url}}\" {{openInNew}} class=\"{{labelpos}} {{fliptextcolor}}\">{{label}}</a><div class=\"metro_description\"><div class=\"metro_description_content\">{{descr}}</div></div><div class=\"metro_grid_edit\"><a href=\"javascript:;\" class=\"{{settingCss}}\"><img src=\"{{settingIconData}}\" alt=\"\" title=\"\" /></a></div></li>";

metroGrid.classes.MetroGridTile = function () {
    this.listname = "";
    this.itemid = "";
    this.title = "";

    this.gswidth = "";
    this.gspadding = "";

    // the following have same names as internal field names
    this.mgcolor = "";
    this.mgimgbg = "";
    this.mgimgbgalt = "";
    this.mgurl = "";
    this.mgdescr = "";
    this.mgnewwin = "";
    this.mgpos = "";
    this.mgwpid = "";
    this.mgtilespan = "";
    this.mgfliptextcolor = "";
    this.mglabelpos = "";
    this.mgimgsize = "";
};

metroGrid.globals.arImages = metroGrid.globals.arImages || [];


metroGrid.globals.fn_IsIE8orLower = function () {
    // determine if browser is IE and version 8.x or less
    // this is needed due to css3 background-size not being supported
    // when browser mode is bumped down to IE8 because of master page, same effect.
    try {
        if (document.addEventListener) {
            return false
        }
        else {
            return true;
        }
    }
    catch (err) {
        return false;
    }
};


metroGrid.globals.fn_FixIEBgResizeIssue = function () {
    // update each tile found on page: fix IE8 background-size issue, not supported
    // plan: instead of using background-image on <li>, create a div and center it, add <img> using the same background-image, and change its size

    jqmg("div.metro_container li").each(function () {
        var $this = jqmg(this);

        // extract bgimage from tile
        var bgimage = "";
        if ($this.attr("mg-attr-bgimg")) {
            bgimage = $this.attr("mg-attr-bgimg");
        }
        else {
            bgimage = $this.css("background-image");
            bgimage = bgimage.substr(0, bgimage.length - 2);
            bgimage = bgimage.substr(5);

            // update tile with custom attribute, saving image path
            $this.attr("mg-attr-bgimg", bgimage);
        }

        // if not using a builtin icon, then skip this, external images are never resized, they are used as-is, centered in div/tile.
        if (bgimage.indexOf('Lists/AEMetroGridPicLib/') < 0){
            return;
        }

        // extract image size from html
        var mgimgsize = $this.attr("mg-attr-mgimgsize").replace("px", "");

        $this.find("div.mg_ie_bg_div").remove();

        $this.css("background-image", "none");

        // create and add new div for bg image (as regular image so it can be resized)
        var new_div = "<div class=\"mg_ie_bg_div\" style=\"width: {mgimgsize}px; height: {mgimgsize}px;\"><img src=\"{bgimage}\" style=\"width: {mgimgsize}px; border: 0;\" /></div>";
        new_div = new_div.replace(/{mgimgsize}/g, mgimgsize);
        new_div = new_div.replace(/{bgimage}/g, bgimage);

        $this.prepend(new_div);

        // make the new div clickable
        $this.find(".mg_ie_bg_div").on("click", function () {
            var $a = jqmg(this).siblings("a");

            var href = $a.attr("href");
            var target = $a.attr("target");

            if (!!target)
                window.open(href, target);
            else
                window.location = href;
        });
    });

    // BUG: the new div sits on top of <a> element, but won't see this issue if the bgimage is smaller and doesn't extend behind <a> element
};


// configure hover text
metroGrid.globals.fn_init_hovertext = function () {

    jqmg('div.metro_description').each(function () {
        jqmg(this).css('opacity', 0);
        jqmg(this).css('display', 'block');
    });

    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1 || metroGrid.globals.roleIsDeleter) {
        jqmg('div.metro_grid_edit').each(function () {
            jqmg(this).css('opacity', 0);
            jqmg(this).css('display', 'block');
        });
    }
    else {
        jqmg('div.metro_grid_edit').each(function () {
            jqmg(this).css('display', 'none');
        });
    }

    jqmg('ul.metro_sortable li').hover(function () {
        jqmg(this).children('.metro_description').stop().fadeTo(500, 0.9);
        if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1 || metroGrid.globals.roleIsDeleter) {
            jqmg(this).children('.metro_grid_edit').stop().fadeTo(500, 0.9);
        }
    }, function () {
        jqmg(this).children('.metro_description').stop().fadeTo(500, 0);
        if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1 || metroGrid.globals.roleIsDeleter) {
            jqmg(this).children('.metro_grid_edit').stop().fadeTo(500, 0);
        }
    });

    jqmg('div.metro_description').each(function () {

        var $curDiv = jqmg(this);
        $curDiv.unbind();
        $curDiv.bind("click", function (e) {
            e.preventDefault();

            var $curA = jqmg(this).siblings("a");
            var href = $curA.attr("href");
            var target = $curA.attr("target");

            if (!!target)
                window.open(href, target);
            else
                window.location = href;
        });

    });

};


// validate modal controls
metroGrid.globals.fn_validate_modal_controls = function () {

    var curTxtMetroLabel = metroGrid.globals.$txtMetroLabel.val();
    var curTxtMetroUrl = metroGrid.globals.$txtMetroUrl.val();
    var curTxtMetroDescr = metroGrid.globals.$txtMetroDescr.val();
    var curTxtMetroTileSpan = metroGrid.globals.$txtMetroTileSpan.val();

    if (!!curTxtMetroLabel == false || jqmg.trim(curTxtMetroLabel).length <= 0) {
        alert("Label is required.");
        return false;
    }

    if (!!curTxtMetroUrl == false || jqmg.trim(curTxtMetroUrl).length <= 0) {
        alert("Url is required.");
        return false;
    }

    if (!!curTxtMetroDescr == false || jqmg.trim(curTxtMetroDescr).length <= 0) {
        alert("Description is required.");
        return false;
    }

    if (!!curTxtMetroTileSpan == false || jqmg.trim(curTxtMetroTileSpan).length <= 0) {
        alert("Tile Span is required.");
        return false;
    } else {
        if (isNaN(curTxtMetroTileSpan) || parseInt(curTxtMetroTileSpan) <= 0) {
            alert("Tile Span must be an integer greater than zero.");
            return false;
        }
        else if (parseInt(curTxtMetroTileSpan) > 50) {
            alert("Hey! Keep the tile span reasonable!");
            return false;
        }
    }

    if (metroGrid.globals.fn_cbalign_getcheckedbox() == -1) {
        alert("Please choose a label alignment.");
        return false;
    }

    return true;
};


// called in 2 places: either add to body and list (new tile), or just body (on page load, get all tiles)
metroGrid.globals.fn_create_new_gridsquare = function (
    newLiId, color, imgBg, imgBgAlt, imgSize, url, mglabel, descr, openInNew, fliptextcolor, tilespan, labelpos,
    mgwpid, gswidth, gspadding) {

    var settingCss = "metro_hidden";
    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1 || metroGrid.globals.roleIsDeleter) {
        settingCss = "";
    }

    imgBg = !!imgBgAlt ? "" : imgBg;
    imgBgAlt = !!imgBgAlt ? imgBgAlt : "";

    var openInNewWinString = "";
    if (openInNew == 1) {
        openInNewWinString = 'target="_blank"';
    }

    var custLabelPos = "mg_label_" + labelpos.toString();

    var custFlipTextColor = "";
    if (fliptextcolor == 1)
        custFlipTextColor = "mg_flip_text_color";

    var custTileSpan = metroGrid.globals.fn_build_tilespan_markup(tilespan, gswidth, gspadding);

    var liStyle = "";
    if (!!imgBgAlt)
        liStyle += "background-image: url('" + imgBgAlt + "'); ";
    else
        liStyle += "background-image: url('" + imgBg + "'); ";
    liStyle += "background-size: " + (!!imgBgAlt ? "auto" : imgSize + "px") + "; ";
    liStyle += custTileSpan;

    if (!!newLiId == false) {
        // create new tile in db
        var tile = new metroGrid.classes.MetroGridTile();

        tile.listname = metroGrid.globals.listName;
        tile.mgwpid = metroGrid.globals.webPartGuid;
        tile.mgcolor = color;
        tile.mgimgbg = imgBg;
        tile.mgimgbgalt = imgBgAlt;
        tile.mgimgsize = imgSize;
        tile.mgurl = url;
        tile.title = mglabel;
        tile.mgdescr = descr;
        tile.mgnewwin = openInNew;
        tile.mgfliptextcolor = fliptextcolor;
        tile.mgtilespan = tilespan;
        tile.mglabelpos = labelpos;

        if (metroGrid.globals.stopAjaxOps != 0) return;
        metroGrid.globals.fn_csom_createitem(tile, liStyle, openInNewWinString, custFlipTextColor, settingCss, custLabelPos);

    }
    else {
        // add existing tile to body
        var tmpString = metroGrid.globals.gridSquareTemplate;
        tmpString = tmpString.replace(/{{id}}/g, newLiId);
        tmpString = tmpString.replace(/{{tileid}}/g, newLiId);
        tmpString = tmpString.replace(/{{color}}/g, color);
        tmpString = tmpString.replace(/{{liStyle}}/g, liStyle);
        tmpString = tmpString.replace(/{{url}}/g, url);
        tmpString = tmpString.replace(/{{openInNew}}/g, openInNewWinString);
        tmpString = tmpString.replace(/{{fliptextcolor}}/g, custFlipTextColor);
        tmpString = tmpString.replace(/{{label}}/g, mglabel);
        tmpString = tmpString.replace(/{{descr}}/g, descr);
        tmpString = tmpString.replace(/{{settingCss}}/g, settingCss);
        tmpString = tmpString.replace(/{{settingIconData}}/g, metroGrid.globals.setting_icon_data);
        tmpString = tmpString.replace(/{{labelpos}}/g, custLabelPos);
        tmpString = tmpString.replace(/{{mgimgsize}}/g, imgSize);

        // add tile to specific div
        jqmg("div[mg-attr-wpid='" + mgwpid + "']").find("ul").append(tmpString);
    }

};


metroGrid.globals.fn_csom_createitem_after = function (newTileId, color, liStyle, url, openInNewWinString, custFlipTextColor, mglabel, descr, settingCss, custLabelPos, imgSize) {

    var tmpString = metroGrid.globals.gridSquareTemplate;
    tmpString = tmpString.replace(/{{id}}/g, "MetroGridSquare_" + newTileId);
    tmpString = tmpString.replace(/{{tileid}}/g, "MetroGridSquare_" + newTileId);
    tmpString = tmpString.replace(/{{color}}/g, color);
    tmpString = tmpString.replace(/{{liStyle}}/g, liStyle);
    tmpString = tmpString.replace(/{{url}}/g, url);
    tmpString = tmpString.replace(/{{openInNew}}/g, openInNewWinString);
    tmpString = tmpString.replace(/{{fliptextcolor}}/g, custFlipTextColor);
    tmpString = tmpString.replace(/{{label}}/g, mglabel);
    tmpString = tmpString.replace(/{{descr}}/g, descr);
    tmpString = tmpString.replace(/{{settingCss}}/g, settingCss);
    tmpString = tmpString.replace(/{{settingIconData}}/g, metroGrid.globals.setting_icon_data);
    tmpString = tmpString.replace(/{{labelpos}}/g, custLabelPos);
    tmpString = tmpString.replace(/{{mgimgsize}}/g, imgSize);

    jqmg("ul.metro_sortable").append(tmpString);

    metroGrid.globals.fn_init_hovertext();
    metroGrid.globals.fn_init_opensetting();

    metroGrid.globals.fn_showhide_status();

    if (metroGrid.globals.fn_IsIE8orLower()) {
        metroGrid.globals.fn_FixIEBgResizeIssue();
    }

};


metroGrid.globals.fn_build_tilespan_markup = function (tilespan, gswidth, gspadding) {
    // return style string
    var custTileSpan = "";

    var custWidth = metroGrid.globals.fn_build_tilespan_width(tilespan, gswidth, gspadding);
    if (custWidth > 0) {
        custTileSpan = "width: " + custWidth + "px; ";
    }

    return custTileSpan;
};


metroGrid.globals.fn_build_tilespan_width = function (tilespan, gswidth/*optional*/, gspadding/*optional*/) {
    // return integer
    var custWidth = 0;

    if (!isNaN(tilespan) && parseInt(tilespan) > 1) {
        var w = metroGrid.globals.gridSquareWidth;
        if (!!gswidth) {
            w = gswidth;
        }

        var p = metroGrid.globals.gridSquarePadding;
        if (!!gspadding) {
            p = gspadding;
        }

        var n = parseInt(tilespan);
        custWidth = w * n + p * (n - 1);
    }

    return custWidth;
};


// update existing grid square
metroGrid.globals.fn_update_gridsquare = function ($curLi, color, imgBg, imgBgAlt, imgSize, url, mglabel, descr, openInNew, fliptextcolor, tilespan, labelpos) {

    // update ui first
    $curLi.attr("class", color);

    imgBg = !!imgBgAlt ? "" : imgBg;
    imgBgAlt = !!imgBgAlt ? imgBgAlt : "";

    if (!!imgBgAlt)
        $curLi.css("backgroundImage", "url('" + imgBgAlt + "')");
    else
        $curLi.css("backgroundImage", "url('" + imgBg + "')");

    $curLi.css("backgroundSize", !!imgBgAlt ? "auto" : imgSize + "px");

    $curLi.find("div.metro_description_content").html(descr);

    var custWidth = metroGrid.globals.fn_build_tilespan_width(tilespan);
    if (custWidth > 0) {
        $curLi.css("width", custWidth + "px");
    }
    else {
        $curLi.css("width", "");
    }

    var custLabelPos = "mg_label_" + labelpos.toString();

    var custFlipTextColor = "";
    if (fliptextcolor == 1)
        custFlipTextColor = "mg_flip_text_color";

    var $curA = $curLi.find("a:first");
    $curA.attr({ "href": url }).html(mglabel);

	
    $curA.removeAttr("target");
    if (openInNew == 1)
        $curA.attr("target", "_blank");

    $curA.attr("class", custLabelPos + " " + custFlipTextColor);

    var itemid = $curLi.attr("mg-attr-id").replace(/MetroGridSquare_/g, "");

    // update listitem using csom
    var tile = new metroGrid.classes.MetroGridTile();

    tile.listname = metroGrid.globals.listName;
    tile.mgwpid = metroGrid.globals.webPartGuid;
    tile.mgcolor = color;
    tile.mgimgbg = imgBg;
    tile.mgimgbgalt = imgBgAlt;
    tile.mgimgsize = imgSize;
    tile.mgurl = url;
    tile.title = mglabel;
    tile.mgdescr = descr;
    tile.itemid = itemid;
    tile.mgnewwin = openInNew;
    tile.mgfliptextcolor = fliptextcolor;
    tile.mgtilespan = tilespan;
    tile.mglabelpos = labelpos;

    if (metroGrid.globals.stopAjaxOps != 0) return;
    metroGrid.globals.fn_csom_updateitem(tile);

    if (metroGrid.globals.fn_IsIE8orLower()) {
        metroGrid.globals.fn_FixIEBgResizeIssue();
    }

};




metroGrid.globals.fn_init_opensetting = function () {
    jqmg(".metro_grid_edit a").unbind();
    jqmg(".metro_grid_edit a").bind("click", function (e) {
        e.preventDefault();

        var id = jqmg(this).closest("li").attr("mg-attr-id");
        metroGrid.globals.setting_id = id;

        metroGrid.globals.fn_init_modal_ondemand(metroGrid.globals.fn_opensettings_click);
    });
};


metroGrid.globals.fn_opensettings_click = function () {
    var tile = new metroGrid.classes.MetroGridTile();

    tile.listname = metroGrid.globals.listName;
    tile.mgwpid = metroGrid.globals.webPartGuid;
    tile.itemid = metroGrid.globals.setting_id.replace(/MetroGridSquare_/g, "");

    if (metroGrid.globals.stopAjaxOps != 0) return;
    metroGrid.globals.fn_csom_getsingleitem(tile);
};


metroGrid.globals.fn_csom_getsingleitem_after = function (tile) {

    var tmpImg = jqmg.trim(tile.mgimgbgalt) == "" ? tile.mgimgbg : tile.mgimgbgalt;
    var imgPos = jqmg.inArray(tmpImg, metroGrid.globals.arImages);

    if (imgPos >= 0) {
        // is image from imagelib
        metroGrid.globals.$mg_slider_image.slider("option", "value", jqmg.inArray(tmpImg, metroGrid.globals.arImages));
        metroGrid.globals.$mg_slider_size.slider("option", "value", jqmg.inArray(tile.mgimgsize.toString(), metroGrid.globals.arSizes));
        metroGrid.globals.$txtImageAlt.val("");
    }
    else {
        // is NOT image from imagelib
        metroGrid.globals.$mg_slider_image.slider("option", "value", metroGrid.globals.def_slider_idx_image);
        metroGrid.globals.$mg_slider_size.slider("option", "value", metroGrid.globals.def_slider_idx_size);
        metroGrid.globals.$txtImageAlt.val(tmpImg);
    }

    metroGrid.globals.$mg_slider_color.slider("option", "value", jqmg.inArray(tile.mgcolor, metroGrid.globals.arColors));

    metroGrid.globals.$txtMetroLabel.val(tile.title);
    metroGrid.globals.$txtMetroUrl.val(tile.mgurl);
    metroGrid.globals.$txtMetroDescr.val(tile.mgdescr);
    metroGrid.globals.$txtMetroTileSpan.val(tile.mgtilespan);

    metroGrid.globals.fn_cbalign_setcheckedbox(tile.mglabelpos);

    metroGrid.globals.$chkMetroOpenInNew.prop("checked", (tile.mgnewwin == "1"));
    metroGrid.globals.$chkMetroFlipText.prop("checked", (tile.mgfliptextcolor == "1"));

    metroGrid.globals.update_demo_image(-1, -1, -1);

    jqmg(".dialog-form-metrogrid").dialog("open");

    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsDeleter == 1) {
        jqmg(".btnGridDelete").show();
    } else {
        jqmg(".btnGridDelete").hide();
    }

    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1) {
        jqmg(".btnGridSave").show();
    } else {
        jqmg(".btnGridSave").hide();
    }

};


// reset modal inputs to defaults
metroGrid.globals.fn_reset_modal_inputs = function () {
    metroGrid.globals.$mg_slider_size.slider("option", "value", metroGrid.globals.def_slider_idx_size);
    metroGrid.globals.$mg_slider_image.slider("option", "value", metroGrid.globals.def_slider_idx_image);
    metroGrid.globals.$mg_slider_color.slider("option", "value", metroGrid.globals.def_slider_idx_color);
    metroGrid.globals.$txtImageAlt.val("");
    metroGrid.globals.$txtMetroLabel.val("");
    metroGrid.globals.$txtMetroUrl.val("");
    metroGrid.globals.$txtMetroDescr.val("");
    metroGrid.globals.$txtMetroTileSpan.val("1");
    metroGrid.globals.fn_cbalign_setcheckedbox(7);
    metroGrid.globals.$chkMetroOpenInNew.prop("checked", false);
    metroGrid.globals.$chkMetroFlipText.prop("checked", false);
};


// update demo image in modal window
metroGrid.globals.update_demo_image = function (idx_size, idx_image, idx_color) {

    var sliderSize = "", sliderImage = "", sliderColor = "";

    if (idx_size >= 0)
        sliderSize = metroGrid.globals.arSizes[idx_size];
    else
        sliderSize = metroGrid.globals.arSizes[parseInt(metroGrid.globals.$mg_slider_size.slider("value"))];

    if (idx_image >= 0)
        sliderImage = metroGrid.globals.arImages[idx_image];
    else
        sliderImage = metroGrid.globals.arImages[parseInt(metroGrid.globals.$mg_slider_image.slider("value"))];

    if (idx_color >= 0)
        sliderColor = metroGrid.globals.arColors[idx_color];
    else
        sliderColor = metroGrid.globals.arColors[parseInt(metroGrid.globals.$mg_slider_color.slider("value"))];

    var altbg = metroGrid.globals.$txtImageAlt.val();

    var bg_width = sliderSize + "px";

    if (!!altbg) {
        sliderImage = altbg;
        bg_width = "auto";

        jqmg("table.form-metrogrid-table tr:eq(0)").hide();
        jqmg("table.form-metrogrid-table tr:eq(1)").hide();
    }
    else {
        jqmg("table.form-metrogrid-table tr:eq(0)").show();
        jqmg("table.form-metrogrid-table tr:eq(1)").show();
    }

    jqmg(".div_metro_img_demo")
        .css({
            "backgroundImage": "url('" + sliderImage + "')",
            "backgroundSize": bg_width
        })
        .attr("class", "div_metro_img_demo mg_" + sliderColor);

};


// configure sortable jquery ui settings
metroGrid.globals.init_sortable = function () {

    jqmg(".metro_sortable").sortable({
        //delay: 75, // in IE8, this causes sorting to be buggy
        handle: "a",
        stop: function (e, ui) {

            // send to server the new tab order (ex. id=1&id=2&id=3&)
            var arIDs = [];
            jqmg(ui.item).parent("ul").find("li").each(function () {
                arIDs.push(jqmg(this).attr("mg-attr-id").replace(/MetroGridSquare_/g, ""));
            });

            var tile = new metroGrid.classes.MetroGridTile();

            tile.mgwpid = metroGrid.globals.webPartGuid;
            tile.listname = metroGrid.globals.listName;

            if (metroGrid.globals.stopAjaxOps != 0) return;
            metroGrid.globals.fn_csom_sortitems(tile, arIDs);

        }

    }).disableSelection();

};


// load grid squares from datasource
metroGrid.globals.load_grid_squares = function (wpid, gswidth, gspadding, listname) {

    var info = new metroGrid.classes.MetroGridTile();
    info.listname = listname;
    info.mgwpid = wpid;
    info.gswidth = gswidth;
    info.gspadding = gspadding;

    if (metroGrid.globals.stopAjaxOps != 0) return;

    if (metroGrid.globals.userNotFound) {
        // userId not found, public anon site is being used, use SPServices to get listItems
        metroGrid.globals.fn_spsvs_getalltiles(_spPageContextInfo.siteServerRelativeUrl, info);
    }
    else {
        metroGrid.globals.fn_csom_getalltiles(info);
    }

};


metroGrid.globals.fn_csom_getalltiles_after = function (tiles, mgwpid, gswidth, gspadding) {

    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];

        metroGrid.globals.fn_create_new_gridsquare(
            tile.itemid, tile.mgcolor, tile.mgimgbg, tile.mgimgbgalt, tile.mgimgsize, tile.mgurl, tile.title,
            tile.mgdescr, tile.mgnewwin, tile.mgfliptextcolor, tile.mgtilespan, tile.mglabelpos,
            mgwpid, gswidth, gspadding);
    }

    metroGrid.globals.fn_init_hovertext();
    metroGrid.globals.fn_init_opensetting();

    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsUpdater == 1) {
        metroGrid.globals.init_sortable();
    }

    if (metroGrid.globals.fn_IsIE8orLower()) {
        metroGrid.globals.fn_FixIEBgResizeIssue();
    }

};


// delete a grid square
metroGrid.globals.fn_delete_gridsquare = function (itemId) {

    var tile = new metroGrid.classes.MetroGridTile();

    tile.listname = metroGrid.globals.listName;
    tile.mgwpid = metroGrid.globals.webPartGuid;
    tile.itemid = itemId.replace(/MetroGridSquare_/g, "");

    if (metroGrid.globals.stopAjaxOps != 0) return;
    metroGrid.globals.fn_csom_deleteitem(tile);

};


// show status message after updates made
metroGrid.globals.fn_showhide_status = function () {
    jqmg("span.metro_gridsquareupdated").fadeIn('slow').delay(800).fadeOut('slow');
};


metroGrid.globals.fn_save_on_enter = function (e) {
    var keycode = (e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode));
    if (keycode == 13) {
        // cancel char event, execute save function
        e.preventDefault();
        metroGrid.globals.fn_modal_save_button();
        return false;
    }
};


// create or update a grid square
metroGrid.globals.fn_modal_save_button = function () {

    if (!metroGrid.globals.fn_validate_modal_controls()) {
        return;
    }

    var size = metroGrid.globals.arSizes[parseInt(metroGrid.globals.$mg_slider_size.slider("value"))];
    var imgBg = metroGrid.globals.arImages[parseInt(metroGrid.globals.$mg_slider_image.slider("value"))];
    var color = metroGrid.globals.arColors[parseInt(metroGrid.globals.$mg_slider_color.slider("value"))];

    var imgBgAlt = metroGrid.globals.$txtImageAlt.val();

    var url = metroGrid.globals.$txtMetroUrl.val();
    var mglabel = metroGrid.globals.$txtMetroLabel.val();
    var descr = metroGrid.globals.$txtMetroDescr.val();
    var tilespan = metroGrid.globals.$txtMetroTileSpan.val();

    var labelpos = metroGrid.globals.fn_cbalign_getcheckedbox();

    var openinnew = (metroGrid.globals.$chkMetroOpenInNew.prop("checked") ? 1 : 0);
    var fliptextcolor = (metroGrid.globals.$chkMetroFlipText.prop("checked") ? 1 : 0);

    if (metroGrid.globals.setting_id == "") {
        // create new grid square
        metroGrid.globals.fn_create_new_gridsquare("", color, imgBg, imgBgAlt, size, url, mglabel, descr, openinnew, fliptextcolor, tilespan, labelpos, null, null, null);

    }
    else {
        // edit grid square
        var $curLi = jqmg("ul.metro_sortable li[mg-attr-id='" + metroGrid.globals.setting_id + "']");

        metroGrid.globals.fn_update_gridsquare($curLi, color, imgBg, imgBgAlt, size, url, mglabel, descr, openinnew, fliptextcolor, tilespan, labelpos);

        metroGrid.globals.setting_id = "";
    }

    metroGrid.globals.fn_reset_modal_inputs();

    metroGrid.globals.$modal.dialog("close");

};


metroGrid.globals.fn_cbalign_uncheckall = function () {
    jqmg("div.mg-label-align input[type='checkbox']:checked").each(function (i, o) {
        jqmg(o).prop('checked', false);
    });
};


metroGrid.globals.fn_cbalign_getcheckedbox = function () {
    var $o = jqmg("div.mg-label-align input[type='checkbox']:checked");
    if (!!$o == false)
        return -1;

    var id = $o.attr("class");
    if (!!id == false)
        return -1;

    if (id.length != 15)
        return -1;

    id = id.substring(14);

    return id;
};


metroGrid.globals.fn_cbalign_setcheckedbox = function (pos) {
    metroGrid.globals.fn_cbalign_uncheckall();
    jqmg(".chkMetroAlign_" + pos.toString()).prop("checked", true);
};


metroGrid.globals.fn_show_wptooltip = function (title, text) {
    jqmg("div.mg-wptooltip span").text(title);
    jqmg("div.mg-wptooltip div").text(text);
    jqmg("div.mg-wptooltip").show();
};


metroGrid.globals.fn_init_modal_ondemand = function (fn_next) {
    // this will load the images from the image list ondemand, fill the image array (if any found), and init slider controls that use the image array
    // fn_next: this is the function that should be called next, either immediately or after ajax loading of images
    // this function is only called in 2 places: "add link" button clicked, tile "settings" button clicked
    // it only does the ajax image load if 1st time loaded, since filling global array
    // subsequent calls to function immediately skip to fn_next
    // spservices implementation for anon sites not needed, since web part will be in read only mode and "add link"/"settings" buttons will be disabled.
    
    if (typeof metroGrid.globals.imagesloaded == "undefined") {
        metroGrid.globals.imagesloaded = 1;

        metroGrid.globals.fn_csom_getallimages(metroGrid.globals.imageListName, fn_next);
    }
    else {
        fn_next();
    }
};


metroGrid.globals.fn_csom_getallimages_after = function (imgs, fn_next) {
    // fill global var with images, init sliders and slider events, and then call the fn_next function
    metroGrid.globals.arImages = imgs;

    // configure sliders
    metroGrid.globals.$mg_slider_size = jqmg(".mg_slider_size").slider({
        max: metroGrid.globals.arSizes.length - 1,
        min: 0,
        step: 1,
        value: metroGrid.globals.def_slider_idx_size,
        slide: function (e, ui) {
            metroGrid.globals.update_demo_image(ui.value, -1, -1);
        }
    });

    metroGrid.globals.$mg_slider_image = jqmg(".mg_slider_image").slider({
        max: metroGrid.globals.arImages.length - 1,
        min: 0,
        step: 1,
        value: metroGrid.globals.def_slider_idx_image,
        slide: function (e, ui) {
            metroGrid.globals.update_demo_image(-1, ui.value, -1);
        }
    });

    metroGrid.globals.$mg_slider_color = jqmg(".mg_slider_color").slider({
        max: metroGrid.globals.arColors.length - 1,
        min: 0,
        step: 1,
        value: metroGrid.globals.def_slider_idx_color,
        slide: function (e, ui) {
            metroGrid.globals.update_demo_image(-1, -1, ui.value);
        }
    });

    // slider events
    jqmg(".mg_slider_size_left").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_size.slider("value"));

        if (idx > 0) {
            idx--;
            metroGrid.globals.$mg_slider_size.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(idx, -1, -1);
        }
    });

    jqmg(".mg_slider_image_left").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_image.slider("value"));

        if (idx > 0) {
            idx--;
            metroGrid.globals.$mg_slider_image.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(-1, idx, -1);
        }
    });

    jqmg(".mg_slider_color_left").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_color.slider("value"));

        if (idx > 0) {
            idx--;
            metroGrid.globals.$mg_slider_color.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(-1, -1, idx);
        }
    });

    jqmg(".mg_slider_size_right").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_size.slider("value"));

        if (idx < metroGrid.globals.arSizes.length - 1) {
            idx++;
            metroGrid.globals.$mg_slider_size.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(idx, -1, -1);
        }
    });

    jqmg(".mg_slider_image_right").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_image.slider("value"));

        if (idx < metroGrid.globals.arImages.length - 1) {
            idx++;
            metroGrid.globals.$mg_slider_image.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(-1, idx, -1);
        }
    });

    jqmg(".mg_slider_color_right").click(function (e) {
        e.preventDefault();
        var idx = parseInt(metroGrid.globals.$mg_slider_color.slider("value"));

        if (idx < metroGrid.globals.arColors.length - 1) {
            idx++;
            metroGrid.globals.$mg_slider_color.slider("option", "value", idx);
            metroGrid.globals.update_demo_image(-1, -1, idx);
        }
    });

    fn_next();

};


metroGrid.globals.fn_new_tile_link_clicked = function () {
    metroGrid.globals.fn_reset_modal_inputs();

    metroGrid.globals.setting_id = "";

    metroGrid.globals.update_demo_image(
        metroGrid.globals.def_slider_idx_size,
        metroGrid.globals.def_slider_idx_image,
        metroGrid.globals.def_slider_idx_color);

    jqmg(".dialog-form-metrogrid").dialog("open");

    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsCreator == 1) {
        jqmg(".btnGridSave").show();
    }
    else {
        jqmg(".btnGridSave").hide();
    }

    jqmg(".btnGridDelete").hide();
};

// ============================================
// ============================================
// ============================================
// on page load
jqmg(document).ready(function () {

    // prevent the main load function from being called multiple times, if web part added to page more than once
    if (typeof metroGrid.globals.loaded == "undefined") {
        metroGrid.globals.loaded = 1;
        //ExecuteOrDelayUntilScriptLoaded(metroGrid.globals.fn_post_csom_load, "sp.js");
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', metroGrid.globals.fn_post_csom_load);
    }

});

metroGrid.globals.fn_post_csom_load = function () {

    // bind global vars
    metroGrid.globals.$txtImageAlt = jqmg(".txtImageAlt");
    metroGrid.globals.$txtMetroLabel = jqmg(".txtMetroLabel");
    metroGrid.globals.$txtMetroUrl = jqmg(".txtMetroUrl");
    metroGrid.globals.$txtMetroDescr = jqmg(".txtMetroDescr");
    metroGrid.globals.$txtMetroTileSpan = jqmg(".txtMetroTileSpan");
    metroGrid.globals.$chkMetroOpenInNew = jqmg(".chkMetroOpenInNew");
    metroGrid.globals.$chkMetroFlipText = jqmg(".chkMetroFlipText");

    // if userId not found, then public anon site is being used
    metroGrid.globals.userNotFound = !_spPageContextInfo.userId;

    // ============================================
    // if more than one metrogrid web part found, make all web parts readonly
    // or, if user not found
    if (jqmg(".metro_container").length > 1 || metroGrid.globals.userNotFound) {
        metroGrid.globals.roleIsCreator = 0;
        metroGrid.globals.roleIsUpdater = 0;
        metroGrid.globals.roleIsDeleter = 0;
        metroGrid.globals.roleIsAdmin = 0;
    }

    // ============================================
    // 1. initialize all editing tools

    jqmg("div.mg-wptooltip a").click(function () {
        jqmg("div.mg-wptooltip").hide();
    });

    jqmg(".mg_a_altimage_clear").click(function () {
        metroGrid.globals.$txtImageAlt.val("");
        metroGrid.globals.update_demo_image(
            metroGrid.globals.def_slider_idx_size,
			metroGrid.globals.def_slider_idx_image,
            -1);
    });

    jqmg(".mg_a_altimage_usetransbg").click(function () {
        metroGrid.globals.$txtImageAlt.val(metroGrid.globals.transbgurl);
        metroGrid.globals.update_demo_image(
            metroGrid.globals.def_slider_idx_size,
			metroGrid.globals.def_slider_idx_image,
            -1);
    });    

    // label alignment checkbox button event
    jqmg("div.mg-label-align input[type='checkbox']").click(function (e) {
        metroGrid.globals.fn_cbalign_uncheckall();
        jqmg(this).prop('checked', true);
    });

    // show button for creating new grid square (hidden by default)
    if (metroGrid.globals.roleIsAdmin == 1 || metroGrid.globals.roleIsCreator == 1) {
        jqmg(".metro_button_holder").show();
    }

    // configure button for creating new grid square
    jqmg(".btnNewMetroGridSquare").click(function (e) {
        e.preventDefault();

        metroGrid.globals.fn_init_modal_ondemand(metroGrid.globals.fn_new_tile_link_clicked);

    });

    // configure modal dialoag using jquery UI
    metroGrid.globals.$modal = jqmg(".dialog-form-metrogrid").dialog({
        autoOpen: false,
        height: jqmg(window).height() - 200,
        width: jqmg(window).width() - 200,
        modal: true,
        buttons: [
            {
                id: "btnGridCancel",
                text: "Cancel",
                click: function () {
                    jqmg(this).dialog("close");
                }
            },
            {
                id: "btnGridDelete",
                text: "Delete",
                click: function () {

                    if (!confirm("Are you sure?")) {
                        return;
                    }

                    if (metroGrid.globals.setting_id != "") {

                        var delId = metroGrid.globals.setting_id;
                        metroGrid.globals.setting_id = "";

                        // remove the grid square
                        var $curLi = jqmg("ul.metro_sortable li[mg-attr-id='" + delId + "']");
                        $curLi.remove();

                        metroGrid.globals.fn_reset_modal_inputs();

                        jqmg(this).dialog("close");

                        metroGrid.globals.fn_delete_gridsquare(delId);

                    }
                    else {
                        alert("Nothing to delete.");
                    }
                }
            },
            {
                id: "btnGridSave",
                text: "Save",
                click: function () {

                    metroGrid.globals.fn_modal_save_button();

                }
            }],
        close: function () { }
    });

    // configure modal events (for instant feedback of changes)
    metroGrid.globals.$txtImageAlt.on("keydown", function (e) {
        metroGrid.globals.fn_save_on_enter(e);
    });
    metroGrid.globals.$txtMetroLabel.on("keydown", function (e) {
        metroGrid.globals.fn_save_on_enter(e);
    });
    metroGrid.globals.$txtMetroUrl.on("keydown", function (e) {
        metroGrid.globals.fn_save_on_enter(e);
    });
    metroGrid.globals.$txtMetroDescr.on("keydown", function (e) {
        metroGrid.globals.fn_save_on_enter(e);
    });
    metroGrid.globals.$txtMetroTileSpan.on("keydown", function (e) {
        metroGrid.globals.fn_save_on_enter(e);
    });

    // update modal demo image
    metroGrid.globals.$txtImageAlt.on("keydown keypress keyup change", function (e) {
        metroGrid.globals.update_demo_image(-1, -1, -1);
    });
    
    // ============================================
    // 2. initialize default grid

    // load grid square from list and render
    jqmg(".metro_container").each(function () {
    


        // get custom attributes
        var $this = jqmg(this);
        var wpid = $this.attr("mg-attr-wpid");
        var gswidth = $this.attr("mg-attr-gswidth");
        var gspadding = $this.attr("mg-attr-gspadding");
        var listname = $this.attr("mg-attr-listname");

        metroGrid.globals.load_grid_squares(wpid, gswidth, gspadding, listname);
        

    });
    
    /*var elem = document.getElementsByTagName('a')[0];

	var html = elem.innerHTML;

	elem.innerHTML = '<span class="red">'+ html + '</span>' ;*/
	
		// returns an array of elements
};
