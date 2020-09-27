
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.debug.js" />
/// <reference path="jquery-1.9.0.js" />
/// <reference path="metrogridcore.js" />

//=========================================

metroGrid.globals.fn_spsvs_getalltiles = function (webUrl, oTile) {

    var camlquery = "";

    if (!!oTile.mgwpid) {
        camlquery = "<Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"TRUE\"></FieldRef></OrderBy><Where><Eq><FieldRef Name=\"mgwpid\" /><Value Type=\"Text\">" + oTile.mgwpid + "</Value></Eq></Where></Query>";
    }
    else {
        camlquery = "<Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"TRUE\"></FieldRef></OrderBy></Query>";
    }

    var getItemsPromise = jqmg().SPServices.SPGetListItemsJson({
        webURL: webUrl,
        listName: oTile.listname,
        CAMLViewName: "",
        CAMLQuery: camlquery,
        CAMLViewFields: "<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"mgcolor\" /><FieldRef Name=\"mgdescr\" /><FieldRef Name=\"mgfliptextcolor\" /><FieldRef Name=\"mgimgbg\" /><FieldRef Name=\"mgimgbgalt\" /><FieldRef Name=\"mgimgsize\" /><FieldRef Name=\"mglabelpos\" /><FieldRef Name=\"mgnewwin\" /><FieldRef Name=\"mgpos\" /><FieldRef Name=\"mgtilespan\" /><FieldRef Name=\"mgurl\" /><FieldRef Name=\"mgwpid\" /></ViewFields>",
        CAMLRowLimit: "",
        CAMLQueryOptions: "",
        changeToken: "",
        contains: "",
        mapping: null,
        mappingOverrides: null,
        debug: false
    });

    jqmg.when(getItemsPromise).done(function () {

        var tiles = [];

        for (var i = 0; i < this.data.length; i++) {

            var tile = new metroGrid.classes.MetroGridTile();

            tile.itemid = "MetroGridSquare_" + (this.data[i].ID || "");
            tile.mgcolor = this.data[i].mgcolor || "sky";
            tile.mgimgbg = this.data[i].mgimgbg || "";
            tile.mgimgbgalt = this.data[i].mgimgbgalt || "";
            tile.mgimgsize = this.data[i].mgimgsize || "";
            tile.mgurl = this.data[i].mgurl || "#";
            tile.title = this.data[i].Title || " ";
            tile.mgdescr = this.data[i].mgdescr || " ";
            tile.mgnewwin = this.data[i].mgnewwin || "0";
            tile.mgfliptextcolor = this.data[i].mgfliptextcolor || "0";
            tile.mgtilespan = this.data[i].mgtilespan || "1";
            tile.mglabelpos = this.data[i].mglabelpos || "7";

            tiles.push(tile);
        }

        metroGrid.globals.fn_csom_getalltiles_after(tiles, oTile.mgwpid, oTile.gswidth, oTile.gspadding);
				
    });
}
