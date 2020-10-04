<!-- page manager -->
<!-- unified logging service -->
<!-- required for some scrolling? -->
<script type="text/javascript">
// <![CDATA[
var _fV4UI = true;
function FixRibbonAndWorkspaceDimensions() {
	ULSxSy:;
	g_frl = true;
	var elmRibbon = GetCachedElement("s4-ribbonrow");
	var elmWorkspace = GetCachedElement("s4-workspace");
	var elmTitleArea = GetCachedElement("s4-titlerow");
	var elmBodyTable = GetCachedElement("s4-bodyContainer");
	if (!elmRibbon || !elmWorkspace || !elmBodyTable) {
		return;
	}
	if (!g_setWidthInited) {
		var setWidth = true;
		if (elmWorkspace.className.indexOf("s4-nosetwidth") > -1)
			setWidth = false;
		g_setWidth = setWidth;
		g_setWidthInited = true;
	} else {
		var setWidth = g_setWidth;
	}
	var baseRibbonHeight = RibbonIsMinimized() ? 44 : 135;
	var ribbonHeight = baseRibbonHeight + g_wpadderHeight;
	if (GetCurrentEltStyle(elmRibbon, "visibility") == "hidden") {
		ribbonHeight = 0;
	}
	// Override default resizing behavior
	// -- adds padding to the top of the "s4-workspace" <div> if the ribbon exists and has content
	// -- allows the ribbon to be positioned using CSS instead of JavaScript (more accessible)
	// -- checks to see if the page is inside a "no-ribbon" dialog
	if (elmRibbon.children.length > 0 && document.getElementsByTagName("html")[0].className.indexOf('ms-dialog-nr') == -1) {
		elmWorkspace.style.paddingTop = ribbonHeight + 'px';
	}
}
// ]]>
</script>

<!-- load SharePoint javascript -->
<script type="text/javascript">
// <![CDATA[
document.write('<script type="text/javascript" src="/_layouts/1033/init.js?rev=lEi61hsCxcBAfvfQNZA%2FsQ%3D%3D"></' + 'script>');
document.write('<script type="text/javascript" src="/ScriptResource.axd?d=Ht1_arwafpCwM2FjkVBIsOc8L_ddcDO8Dps-qMSv2TYHFWj5wezD3-Zr6FJbAcipRjR_O-RmUN04QzKBQvqW7UBmx76Ko5wWHnfYz_66eZW3AAByoyzTzP2ih1ICxBJQVQeGUP-FGyI3y7USFi-TEXmnpqI1&amp;t=3f4a792d"></' + 'script>');
document.write('<script type="text/javascript" src="/_layouts/blank.js?rev=QGOYAJlouiWgFRlhHVlMKA%3D%3D"></' + 'script>');
// ]]>
</script>

<!-- javascript to override the active-x message in ie 
// See support.microsoft.com/default.aspx/kb/931509 for info on the issue
// Remove if the IM pressence icons are needed in SharePoint
-->
<script type="text/javascript">
function ProcessImn() {}
function ProcessImnMarkers() {}
</script>

<!-- additional header delegate control -->
<!-- _lcid="1033" _version="14.0.6136" _dal="1" -->
<!-- _LocalBinding -->
<span id="ctl00_ctl21_iprRibbon">
	<span></span>
</span>

<!-- additional header placeholder - overridden by asp:content on pages or page layouts -->
<script type="text/javascript" src="https://ajax.microsoft.com/ajax/jquery/jquery-1.4.2.js"></script>
<script type="text/javascript" src="https://ajax.microsoft.com/ajax/jquery.cycle/2.88/jquery.cycle.all.js"></script>
<script type="text/javascript" src="/style%20library/scripts/thickbox.js"></script>

<script src="/Style%20Library/js/jquery.readmore.js" type="text/javascript"></script>
<!-- Text Size Scripts -->
