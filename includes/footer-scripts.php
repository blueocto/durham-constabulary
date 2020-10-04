<script type="text/javascript">
//<![CDATA[
var _spFormDigestRefreshInterval = 1440000;
window.g_updateFormDigestPageLoaded = new Date();
window.g_updateFormDigestPageLoaded.setDate(window.g_updateFormDigestPageLoaded.getDate() - 5);

function EnsureScripts(scriptInfoList, finalFunction) {
	if (scriptInfoList.length == 0) {
		finalFunction();
	} else {
		var scriptInfo = scriptInfoList.shift();
		var rest = function() { EnsureScripts(scriptInfoList, finalFunction); };
		var defd;
		try {
			eval('defd = typeof(' + scriptInfo[1] + ');');
		} catch (e) {
			defd = 'undefined';
		}
		if (scriptInfo[2]) {
			EnsureScript(scriptInfo[0], defd, null);
			ExecuteOrDelayUntilScriptLoaded(rest, scriptInfo[0]);
		} else {
			EnsureScript(scriptInfo[0], defd, rest);
		}
	}
}

function PublishingRibbonUpdateRibbon() {
	var pageManager = SP.Ribbon.PageManager.get_instance();
	if (pageManager) {
		pageManager.get_commandDispatcher().executeCommand('appstatechanged', null);
	}
}
var _fV4UI = true;

function _RegisterWebPartPageCUI() {
	var initInfo = { editable: false, isEditMode: false, allowWebPartAdder: false, listId: "{6ec5c06b-988d-4ee8-8627-89b3c2c8b06e}", itemId: 1, recycleBinEnabled: true, enableMinorVersioning: true, enableModeration: false, forceCheckout: true, rootFolderUrl: "\u002fPages", itemPermissions: { High: 16, Low: 65633 } };
	SP.Ribbon.WebPartComponent.registerWithPageManager(initInfo);
	var wpcomp = SP.Ribbon.WebPartComponent.get_instance();
	var hid;
	hid = document.getElementById("_wpSelected");
	if (hid != null) {
		var wpid = hid.value;
		if (wpid.length > 0) {
			var zc = document.getElementById(wpid);
			if (zc != null)
				wpcomp.selectWebPart(zc, false);
		}
	}
	hid = document.getElementById("_wzSelected");
	if (hid != null) {
		var wzid = hid.value;
		if (wzid.length > 0) {
			wpcomp.selectWebPartZone(null, wzid);
		}
	}
}
ExecuteOrDelayUntilScriptLoaded(_RegisterWebPartPageCUI, "sp.ribbon.js");
var __wpmExportWarning = 'This Web Part Page has been personalized. As a result, one or more Web Part properties may contain confidential information. Make sure the properties contain information that is safe for others to read. After exporting this Web Part, view properties in the Web Part description file (.WebPart) by using a text editor such as Microsoft Notepad.';
var __wpmCloseProviderWarning = 'You are about to close this Web Part.  It is currently providing data to other Web Parts, and these connections will be deleted if this Web Part is closed.  To close this Web Part, click OK.  To keep this Web Part, click Cancel.';
var __wpmDeleteWarning = 'You are about to permanently delete this Web Part.  Are you sure you want to do this?  To delete this Web Part, click OK.  To keep this Web Part, click Cancel.'; //]]>
</script>
<script type="text/javascript">
// <![CDATA[
// ]]>
</script>
<script type="text/javascript">
RegisterSod("sp.core.js", "\u002f_layouts\u002fsp.core.js?rev=7ByNlH\u00252BvcgRJg\u00252BRCctdC0w\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("sp.res.resx", "\u002f_layouts\u002fScriptResx.ashx?culture=en\u00252Dus\u0026name=SP\u00252ERes\u0026rev=b6\u00252FcRx1a6orhAQ\u00252FcF\u00252B0ytQ\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("sp.ui.dialog.js", "\u002f_layouts\u002fsp.ui.dialog.js?rev=IuXtJ2CrScK6oX4zOTTy\u00252BA\u00253D\u00253D");
RegisterSodDep("sp.ui.dialog.js", "sp.core.js");
RegisterSodDep("sp.ui.dialog.js", "sp.res.resx");
</script>
<script type="text/javascript">
RegisterSod("core.js", "\u002f_layouts\u002f1033\u002fcore.js?rev=thUAOrLfyaU\u00252Fgyxy0eiMiw\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("sp.runtime.js", "\u002f_layouts\u002fsp.runtime.js?rev=9sKdsC9N6p2BiRk3313M7Q\u00253D\u00253D");
RegisterSodDep("sp.runtime.js", "sp.core.js");
RegisterSodDep("sp.runtime.js", "sp.res.resx");
</script>
<script type="text/javascript">
RegisterSod("sp.js", "\u002f_layouts\u002fsp.js?rev=SpGB4\u00252FzYmCWpwoPWNG2dsg\u00253D\u00253D");
RegisterSodDep("sp.js", "sp.core.js");
RegisterSodDep("sp.js", "sp.runtime.js");
RegisterSodDep("sp.js", "sp.ui.dialog.js");
RegisterSodDep("sp.js", "sp.res.resx");
</script>
<script type="text/javascript">
RegisterSod("cui.js", "\u002f_layouts\u002fcui.js?rev=k\u00252B4HtUzT9\u00252B3mSycgD7gPaQ\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("inplview", "\u002f_layouts\u002finplview.js?rev=ZfVDYd30Z2D01DIRRl8ETA\u00253D\u00253D");
RegisterSodDep("inplview", "core.js");
RegisterSodDep("inplview", "sp.js");
</script>
<script type="text/javascript">
RegisterSod("ribbon", "\u002f_layouts\u002fsp.ribbon.js?rev=F\u00252BUEJ66rbXzSvpf7nN69wQ\u00253D\u00253D");
RegisterSodDep("ribbon", "core.js");
RegisterSodDep("ribbon", "sp.core.js");
RegisterSodDep("ribbon", "sp.js");
RegisterSodDep("ribbon", "cui.js");
RegisterSodDep("ribbon", "sp.res.resx");
RegisterSodDep("ribbon", "sp.runtime.js");
RegisterSodDep("ribbon", "inplview");
</script>
<script type="text/javascript">
RegisterSod("sp.publishing.resources.resx", "\u002f_layouts\u002fScriptResx.ashx?culture=en\u00252Dus\u0026name=SP\u00252EPublishing\u00252EResources\u0026rev=q6nxzZIVVXE5X1SPZIMD3A\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("sp.ui.pub.ribbon.js", "\u002f_layouts\u002fsp.ui.pub.ribbon.js?rev=RGQSBI9Dm0E345iq\u00252FxUpHg\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("msstring.js", "\u002f_layouts\u002f1033\u002fmsstring.js?rev=QtiIcPH3HV7LgVSO7vONFg\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSod("browserScript", "\u002f_layouts\u002f1033\u002fnon_ie.js?rev=EVTj1bu32\u00252FMla6SDN\u00252FsNTA\u00253D\u00253D");
</script>
<script type="text/javascript">
RegisterSodDep("browserScript", "msstring.js");
</script>
<script type="text/javascript">
//<![CDATA[
Sys.Application.initialize();
//]]>
</script>