function onLoad(e){if(lpdbg("toolstrip","loading toolstrip"),!(e||g_alert&&g_issafari||"undefined"!=typeof safari&&void 0!==safari.extension.globalPage))return void get_data(g_changepw?"toolstripchangepw":"toolstrip",function(){onLoad(!0)});g_generate&&(g_generate_url=getBG().g_generate_url,""!=getBG().g_generate_url&&(getBG().g_generate_url_prev=getBG().g_generate_url),getBG().g_generate_url=""),g_changepw&&(g_changepwnewpw=getBG().g_changepwnewpw,g_changepwtld=getBG().g_changepwtld,g_changepwexcludeid=void 0!==getBG().g_changepwexcludeid?getBG().g_changepwexcludeid:0),L("TS["+g_toolstripid+"] : loaded"),g_ischrome&&sendBG({cmd:"getloginstate"}),g_curmole="lpbutton",addmole("lpbutton"),"undefined"!=typeof onheightmenu&&addmole("lpmenu",onheightmenu,oninitmenu,onshowmenu,onhidemenu),addmole("lpnotify",80,oninitnotify,onshownotify),addmole("lpgeneratecont",300,oninitgenerate,onshowgenerate,onhidegenerate),addmole("lpchooseprofilecc",300,oninitchooseprofilecc,onshowchooseprofilecc,onhidechooseprofilecc),addmole("lpchangepw",300,oninitchangepw,onshowchangepw,onhidechangepw),addmole("lpyubikey",350,oninityubikey,onshowyubikey,onhideyubikey),addmole("lpgoogleauth",350,oninitgoogleauth,onshowgoogleauth,onhidegoogleauth),addmole("lpoutofband",350,oninitoutofband,onshowoutofband,onhideoutofband),addmole("lpsecurityquestion",350,oninitsecurityquestion,onshowsecurityquestion,onhidesecurityquestion),addmole("lpsesame",350,oninitsesame,onshowsesame,onhidesesame),addmole("lpgrid",350,oninitgrid,onshowgrid,onhidegrid),addmole("lpinlinelogin",850,oninitlogin,onshowlogin,onhidelogin);var t;for(t in g_moles)("lpbutton"!=t||g_browseraction)&&$("#"+t).hide(),"function"==typeof g_moles[t].initfunc&&g_moles[t].initfunc();g_browseraction&&(lpdbg("toolstrip","detected browser action"),g_yubikey?(document.title=gs("YubiKey Multifactor Authentication"),openmole("lpyubikey")):g_googleauth?(document.title=gs("Google Authenticator Multifactor Authentication"),openmole("lpgoogleauth")):g_outofband?(document.title=gs("Multifactor Authentication"),openmole("lpoutofband")):g_securityquestion?(document.title=gs("Security Question Multifactor Authentication"),openmole("lpsecurityquestion")):g_sesame?(document.title=gs("Sesame Multifactor Authentication"),openmole("lpsesame")):g_grid?(document.title=gs("LastPass Grid Multifactor Authentication"),openmole("lpgrid")):g_generate?(document.title=gs("Generate Secure Password"),openmole("lpgeneratecont")):g_chooseprofilecc?(document.title=gs("Choose Profile and Credit Card"),openmole("lpchooseprofilecc")):g_changepw?(document.title=gs("Change Password"),openmole("lpchangepw")):null!=getBG()&&null!=getBG().g_badgedata?(lpdbg("toolstrip","have badge data"),receiveBG(getBG().g_badgedata),setTimeout(function(){getBG().clear_badge()},100)):(g_isfirefoxsdk&&(document.getElementById("body").style.backgroundColor="#fff"),(g_ismaxthon||g_isfirefoxsdk)&&(include_language(getBG().g_language),g_menus=[]),g_ismenu=!0,openmenu(),g_ismaxthon&&(window.external.mxGetRuntime().onAppEvent=function(e){"ACTION_HIDE"==e.type&&(document.getElementById("content").style.display="none")}))),toolstrip_loaded(),g_isfirefoxsdk&&dispatch_message("onload_done",{need_data:-1!=document.location.href.indexOf("delay_data=1")})}function onUnload(){g_closed=!0,g_curmole&&"function"==typeof g_moles[g_curmole].hidefunc&&g_moles[g_curmole].hidefunc()}function sendBG(e){try{var t=getBG();if(t)return L("TS -> BG : cmd="+e.cmd),t.receiveTS(g_toolstripid,e);L("TS -> BG : FAILED")}catch(e){L("TS -> BG : FAILED error="+e)}return null}function receiveBG(e){if(lpdbg("toolstrip","received from bg"),void 0===e.cmd)return void L("BG -> TS : INVALIDMSG");switch(L("BG -> TS : "+e.cmd),e.cmd){case"login":$("#lploggedin").show(),$("#lplogin").hide();break;case"logout":case"logoff":"lpmenu"==g_curmole&&closemole(),$("#lploggedin").hide(),$("#lplogin").show();break;case"genpw":document.title=gs("Generate Secure Password"),openmole("lpgeneratecont");break;case"chooseprofilecc":document.title=gs("Choose Profile and Credit Card"),openmole("lpchooseprofilecc");break;case"changepw":g_changepwnewpw=e.newpw,g_changepwtld=e.tld,g_changepwexcludeid=void 0!==e.excludeid?e.excludeid:0,document.title=gs("Change Password"),openmole("lpchangepw");break;case"yubikey":document.title=gs("YubiKey Multifactor Authentication"),openmole("lpyubikey");break;case"googleauth":document.title=gs("Google Authenticator Multifactor Authentication"),openmole("lpgoogleauth");break;case"outofband":document.title=gs("Multifactor Authentication"),openmole("lpoutofband");break;case"securityquestion":document.title=gs("Security Question Multifactor Authentication"),openmole("lpsecurityquestion");break;case"sesame":document.title=gs("Sesame Multifactor Authentication"),openmole("lpsesame");break;case"notification":lpdbg("toolstrip","got notification");var t=e.type;0==getBG().lpGetPref("showNotifications",1)&&"error"!=t&&"upgrade"!=t&&"alert"!=t||(lpdbg("toolstrip","opening lpnotify mole"),openmole("lpnotify"));break;default:return void L("BG -> TS : INVALIDMSG")}}function isloggedin(){return getBG().lploggedin}function openmenu(){if(!isloggedin()&&!g_isfirefoxsdk)return g_ischrome||g_ismaxthon||g_isfirefoxsdk?void openmole("lpinlinelogin"):(closemole(),void getBG().open_login(!0));openmole("lpmenu")}function addmole(e,t,o,n,i){g_moles[e]={height:t,initfunc:o,showfunc:n,hidefunc:i}}function hidemenu(){$("#menucontainer").hide()}function hidemoles(){var e;for(e in g_moles)("lpbutton"!=e||g_browseraction)&&$("#"+e).hide()}function closemole(){if(g_browseraction){if(g_ismaxthon)setTimeout(function(){window.external.mxGetRuntime().getActionByName("lppanel").hide()},0);else{if(g_issafari)return void(g_changepw||"function"!=typeof getBG().closePop?getBG().closecurrenttab(""):getBG().closePop());if(g_isfirefoxsdk)return getBG().closecurrenttab("lp_toolstrip.html"),void dispatch_message("closepop",{})}g_ismenu||"lpnotify"==g_curmole||"lpchangepw"==g_curmole?(setTimeout(function(){window.close()},0),setTimeout(function(){window.close()},1e3),setTimeout(function(){window.close()},1e4)):g_yubikey||g_googleauth||g_outofband||g_securityquestion?setTimeout(function(){getBG().closecurrenttab("lp_toolstrip.html")},0):g_closed||(g_closed=!0,setTimeout(function(){getBG().closecurrenttab(-1!=document.location.href.indexOf("mpwchange.html")?"mpwchange.html":"")},0))}else if($("#body").css("background",""),g_newmole=null,"lpbutton"==g_curmole)return}function openmole(e){if(lpdbg("toolstrip","opening mole "+e),g_browseraction?hidemoles():closemole(),$("#content").show(),g_newmole=e,"lpbutton"==e)$("#lpbutton").show(),"function"==typeof g_moles.lpbutton.showfunc&&g_moles.lpbutton.showfunc();else if("lpinlinelogin"==e)if(g_ismaxthon||is_opera_chromium()||g_isfirefoxsdk){var t=(new Date).getTime();t>g_login_logoff_time+100&&(g_login_logoff_time=t,g_ismaxthon?getBG().open_login(!0):getBG().openURL(getchromeurl("login.html"))),closemole()}else g_issafari&&"undefined"!=typeof SafariExtensionPopover&&parent&&parent.document&&void 0!==parent.showwin?getBG().open_login():document.location.href=getchromeurl("login.html?inline=1");else{if("lpgeneratecont"==e){LP_decimate_children(document.getElementById("lpgeneratecont"));var o=document.createElement("div");o.id="genheader";var n=document.createElement("div");n.id="gentitle",set_innertext(n,gs("Generate")),o.appendChild(n),document.getElementById("lpgeneratecont").appendChild(o),g_generate||(o=document.createElement("div"),o.id="backrow",o.className="backgen",o.appendChild(document.createElement("span")),o.appendChild(document.createTextNode(gs("BACKUPPER"))),document.getElementById("lpgeneratecont").appendChild(o)),document.getElementById("lpgeneratecont").appendChild(createGenerateHtml(document,!0,!0,!0)),stylize_generate_html(document),stylize_ghetto_meter(document,METER_WIDTH),g_issafari&&$(".tooltipgen1").click(function(e){e.preventDefault()});var i=document.createElement("link");i.rel="stylesheet",i.type="text/css",i.href="popupfilltab.css",i.id="popupfilltab_css",document.body.appendChild(i),setup_generate_handlers(),populate_usernames(),g_pointer_stack.push(g_pointer),g_ids.push(e),g_pointer=null,$("#backrow").click(function(e){$("#popupfilltab_css").remove(),$("#lpgeneratecont").hide(),$("#menucontainer").show(),document.getElementById("lpgenerate").style.margin="8px",goback()}),setTimeout(function(){create_combo("password",new Array,!0,document),repopulate_combo("password",getBG().g_genpws),document.getElementById("password_button").style.left="200px",document.getElementById("password_button").style.padding="0px",document.getElementById("password_button").style.top="75px"},100),resize_generate()}lpdbg("toolstrip","not lpbutton"),"lpbutton"==g_curmole?($("#lpbutton").hide(),"function"==typeof g_moles.lpbutton.hidefunc&&g_moles.lpbutton.hidefunc(),g_ischrome?getBG().get_selected_tab(null,function(e){getBG().setcurrenttabid(e.id),getBG().setcurrenturl(getBG().gettaburl(e)),g_browseraction&&toolstrip_expanded()}):(g_issafari||g_isopera||g_ismaxthon||g_isfirefoxsdk)&&toolstrip_expanded()):(lpdbg("toolstrip","curr is not not lpbutton"),g_browseraction&&(lpdbg("toolstrip","is browser action"),toolstrip_expanded()))}}function toolstrip_expanded(){lpdbg("toolstrip","toolstrip expanded"),g_curmole=g_newmole,g_newmole=null,"function"==typeof g_moles[g_curmole].showfunc&&(lpdbg("toolstrip","calling showfunc"),g_moles[g_curmole].showfunc()),$("#"+g_curmole).show()}function toolstrip_loaded(){getBG().allowmultifactortrust||(document.getElementById("lptrustyubi").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip30").style.display="none",document.getElementById("lptrustgoogleauth").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip37").style.display="none",document.getElementById("lptrustoutofband").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip62").style.display="none",document.getElementById("lptrustsecurityquestion").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip56").style.display="none",document.getElementById("lptrustsesame").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip43").style.display="none",document.getElementById("lptrustgrid").style.display="none",document.getElementById("lp_docwrite_lp_toolstrip49").style.display="none"),getBG().hidemultifactordisable&&(document.getElementById("lostkey").style.display="none",document.getElementById("googleauthlostkey").style.display="none",document.getElementById("outofbandlostkey").style.display="none",document.getElementById("sesamelostkey").style.display="none",document.getElementById("lostgrid").style.display="none")}var g_toolstripid=get_random(0,999999999),g_moles={},g_curmole=null,g_newmole=null,g_changepwnewpw="",g_changepwtld="",g_changepwexcludeid=0,g_browseraction=-1!=document.location.href.indexOf("?browseraction=1"),g_yubikey=-1!=document.location.href.indexOf("&yubikey=1"),g_googleauth=-1!=document.location.href.indexOf("&googleauth=1"),g_outofband=-1!=document.location.href.indexOf("&outofband=1"),g_securityquestion=-1!=document.location.href.indexOf("&securityquestion=1"),g_sesame=-1!=document.location.href.indexOf("&sesame=1"),g_grid=-1!=document.location.href.indexOf("&grid=1"),g_generate=-1!=document.location.href.indexOf("&generate=1"),g_chooseprofilecc=-1!=document.location.href.indexOf("&chooseprofilecc=1"),g_changepw=-1!=document.location.href.indexOf("&changepw=1"),g_alert=-1!=document.location.href.indexOf("&alert=1"),g_generate_url="",g_generate_found=!1,g_tabid=null,matches=document.location.href.match(/&tabid=(\d+)/);matches&&(g_tabid=matches[1]);var g_ismenu=!1,g_issafari="undefined"!=typeof safari&&void 0!==safari.self,g_closed=!1;