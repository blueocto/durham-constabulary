
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\MicrosoftAjax.js" />
/// <reference path="C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\14\TEMPLATE\LAYOUTS\SP.debug.js" />
/// <reference path="jquery-1.9.0.js" />
/// <reference path="metrogridcore.js" />

//=========================================


metroGrid.globals.fn_csom_getallimages = function (imageListName, fn_next) {

    var ctx = new SP.ClientContext.get_current();
    var list = ctx.get_site().get_rootWeb().get_lists().getByTitle(imageListName);

    var caml = new SP.CamlQuery();

    caml.set_viewXml("<View Scope=\"Recursive\"><Query><OrderBy><FieldRef Name=\"FileLeafRef\" Ascending=\"TRUE\"></FieldRef></OrderBy></Query></View>");

    var items = list.getItems(caml);
    ctx.load(items, "Include(FileRef)");

    ctx.executeQueryAsync(
    	Function.createDelegate(this, function () { metroGrid.globals.fn_csom_getallimages_P2(items, fn_next); }),
    	Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));
};

metroGrid.globals.fn_csom_getallimages_P2 = function (items, fn_next) {
    var imgs = [];
    var listItemEnumerator = items.getEnumerator();
    while (listItemEnumerator.moveNext()) {
        var li = listItemEnumerator.get_current();

        imgs.push(li.get_item('FileRef'));
    }

    metroGrid.globals.fn_csom_getallimages_after(imgs, fn_next);
};

//=========================================

metroGrid.globals.fn_csom_sortitems = function (oTile, arIDs) {

    this.ctx = new SP.ClientContext.get_current();

    this.list = this.ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    var arItems = [];

    for (var i = 0; i < arIDs.length; i++) {
        var itemId = arIDs[i];

        arItems[i] = this.list.getItemById(itemId);
        arItems[i].set_item('mgpos', i + 1);
        arItems[i].update();
    }

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_sortitems_P2), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_sortitems_P2 = function () {
    metroGrid.globals.fn_showhide_status();
};

//=========================================

metroGrid.globals.fn_csom_getalltiles = function (oTile) {

    var ctx = new SP.ClientContext.get_current();
    var list = ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    var caml = new SP.CamlQuery();

    if (!!oTile.mgwpid) {
        caml.set_viewXml("<View Scope=\"Recursive\"><Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"TRUE\"></FieldRef></OrderBy><Where><Eq><FieldRef Name=\"mgwpid\"></FieldRef><Value Type=\"Text\">" + oTile.mgwpid + "</Value></Eq></Where></Query></View>");
    }
    else {
        caml.set_viewXml("<View Scope=\"Recursive\"><Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"TRUE\"></FieldRef></OrderBy></Query></View>");
    }

    var items = list.getItems(caml);
    ctx.load(items);

    ctx.executeQueryAsync(
    	Function.createDelegate(this, function () { metroGrid.globals.fn_csom_getalltiles_P2(items, oTile); }),
    	Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));
};

metroGrid.globals.fn_csom_getalltiles_P2 = function (items, oTile) {
    var tiles = [];
    var listItemEnumerator = items.getEnumerator();
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();

        var tile = new metroGrid.classes.MetroGridTile();

        tile.itemid = "MetroGridSquare_" + oListItem.get_id();
        tile.mgcolor = oListItem.get_item('mgcolor').toString() || "sky";
        tile.mgimgbg = oListItem.get_item('mgimgbg');
        tile.mgimgbgalt = oListItem.get_item('mgimgbgalt');
        tile.mgimgsize = oListItem.get_item('mgimgsize');
        tile.mgurl = oListItem.get_item('mgurl').toString() || "#";
        tile.title = oListItem.get_item('Title') || " ";
        tile.mgdescr = oListItem.get_item('mgdescr').toString() || " ";
        tile.mgnewwin = oListItem.get_item('mgnewwin').toString() || "0";
        tile.mgfliptextcolor = oListItem.get_item('mgfliptextcolor').toString() || "0";
        tile.mgtilespan = oListItem.get_item('mgtilespan').toString() || "1";
        tile.mglabelpos = oListItem.get_item('mglabelpos').toString() || "7";

        tiles.push(tile);
    }

    metroGrid.globals.fn_csom_getalltiles_after(tiles, oTile.mgwpid, oTile.gswidth, oTile.gspadding);
};

//=========================================

metroGrid.globals.fn_csom_getsingleitem = function (oTile) {

    this.ctx = new SP.ClientContext.get_current();

    this.list = this.ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    this.item = this.list.getItemById(oTile.itemid);

    this.ctx.load(this.item);

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_getsingleitem_P2), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_getsingleitem_P2 = function () {

    var tile = new metroGrid.classes.MetroGridTile();

    tile.mgimgbgalt = this.item.get_item("mgimgbgalt");
    tile.mgimgbg = this.item.get_item("mgimgbg");
    tile.mgimgsize = this.item.get_item("mgimgsize");
    tile.mgcolor = this.item.get_item("mgcolor") || "sky";
    tile.title = this.item.get_item("Title") || " ";
    tile.mgurl = this.item.get_item("mgurl") || "/";
    tile.mgdescr = this.item.get_item("mgdescr") || " ";
    tile.mgtilespan = this.item.get_item("mgtilespan").toString() || "1";
    tile.mglabelpos = this.item.get_item("mglabelpos").toString() || "7";
    tile.mgnewwin = this.item.get_item("mgnewwin").toString() || "0";
    tile.mgfliptextcolor = this.item.get_item("mgfliptextcolor").toString() || "0";

    metroGrid.globals.fn_csom_getsingleitem_after(tile);

};

//=========================================

metroGrid.globals.fn_csom_createitem = function (oTile, liStyle, openInNewWinString, custFlipTextColor, settingCss, custLabelPos) {

    this.oTile = oTile;
    this.liStyle = liStyle;
    this.openInNewWinString = openInNewWinString;
    this.custFlipTextColor = custFlipTextColor;
    this.settingCss = settingCss;
    this.custLabelPos = custLabelPos;

    this.ctx = new SP.ClientContext.get_current();

    this.list = this.ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    // get largest pos
    var caml = new SP.CamlQuery();

    if (!!oTile.mgwpid) {
        caml.set_viewXml("<View Scope=\"Recursive\"><Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"FALSE\"></FieldRef></OrderBy><Where><Eq><FieldRef Name=\"mgwpid\"></FieldRef><Value Type=\"Text\">" + oTile.mgwpid + "</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>");
    }
    else {
        caml.set_viewXml("<View Scope=\"Recursive\"><Query><OrderBy><FieldRef Name=\"mgpos\" Ascending=\"FALSE\"></FieldRef></OrderBy></Query><RowLimit>1</RowLimit></View>");
    }

    this.items = this.list.getItems(caml);
    this.ctx.load(this.items);

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_createitem_P2), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_createitem_P2 = function () {

    var listItemEnumerator = this.items.getEnumerator();

    var pos = null;

    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        pos = oListItem.get_item('mgpos');
        break;
    }

    if (pos == null) {
        pos = 1;
    }
    else {
        pos = parseInt(pos) + 1;
    }

    // create new item, using largest pos
    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.newItem = this.list.addItem(itemCreateInfo);

    this.newItem.set_item('mgwpid', this.oTile.mgwpid);
    this.newItem.set_item('mgcolor', this.oTile.mgcolor);
    this.newItem.set_item('mgimgbg', this.oTile.mgimgbg);
    this.newItem.set_item('mgimgbgalt', this.oTile.mgimgbgalt);
    this.newItem.set_item('mgimgsize', this.oTile.mgimgsize);
    this.newItem.set_item('mgurl', this.oTile.mgurl);
    this.newItem.set_item('Title', this.oTile.title);
    this.newItem.set_item('mgdescr', this.oTile.mgdescr);
    this.newItem.set_item('mgnewwin', this.oTile.mgnewwin);
    this.newItem.set_item('mgfliptextcolor', this.oTile.mgfliptextcolor);
    this.newItem.set_item('mgtilespan', this.oTile.mgtilespan);
    this.newItem.set_item('mglabelpos', this.oTile.mglabelpos);
    this.newItem.set_item('mgpos', pos);
    this.newItem.set_item('ContentTypeId', '0x010079b93289124c4cbeb03e2f08aaee0ec0');

    this.newItem.update();

    // load new item, to get new id
    this.ctx.load(this.newItem, 'ID');

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_createitem_P3), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_createitem_P3 = function () {

    metroGrid.globals.fn_csom_createitem_after(
        this.newItem.get_id(),
        this.oTile.mgcolor,
        this.liStyle,
        this.oTile.mgurl,
        this.openInNewWinString,
        this.custFlipTextColor,
        this.oTile.title,
        this.oTile.mgdescr,
        this.settingCss,
        this.custLabelPos,
        this.oTile.mgimgsize);
};

//=========================================

metroGrid.globals.fn_csom_deleteitem = function (oTile) {

    this.ctx = new SP.ClientContext.get_current();

    this.list = this.ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    this.item = this.list.getItemById(oTile.itemid);

    this.item.deleteObject();

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_deleteitem_P2), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_deleteitem_P2 = function () {

    metroGrid.globals.fn_showhide_status();
};

//=========================================

metroGrid.globals.fn_csom_updateitem = function (oTile) {

    this.ctx = new SP.ClientContext.get_current();

    this.list = this.ctx.get_site().get_rootWeb().get_lists().getByTitle(oTile.listname);

    this.item = this.list.getItemById(oTile.itemid);

    this.item.set_item('Title', oTile.title);
    this.item.set_item('mgcolor', oTile.mgcolor);
    this.item.set_item('mgimgbg', oTile.mgimgbg);
    this.item.set_item('mgimgbgalt', oTile.mgimgbgalt);
    this.item.set_item('mgurl', oTile.mgurl);
    this.item.set_item('mgdescr', oTile.mgdescr);
    this.item.set_item('mgnewwin', oTile.mgnewwin);
    this.item.set_item('mgwpid', oTile.mgwpid);
    this.item.set_item('mgtilespan', oTile.mgtilespan);
    this.item.set_item('mgfliptextcolor', oTile.mgfliptextcolor);
    this.item.set_item('mglabelpos', oTile.mglabelpos);
    this.item.set_item('mgimgsize', oTile.mgimgsize);

    this.item.update();

    this.ctx.executeQueryAsync(Function.createDelegate(this, metroGrid.globals.fn_csom_updateitem_P2), Function.createDelegate(this, metroGrid.globals.fn_csom_process_error));

};

metroGrid.globals.fn_csom_updateitem_P2 = function () {

    metroGrid.globals.fn_showhide_status();
};

//=========================================

metroGrid.globals.fn_csom_process_error = function (sender, args) {
    alert('SPCOM Request Failed: ' + args.get_message() + '\n' + args.get_stackTrace());
};
