var NS={};var ASJSUtils={};c1(ASJSUtils,"Language",ASJS.AbstractModel,function(d){get(d,"supportedLanguages",function(){return d.get("supportedLanguages")});get(d,"selectedLanguage",function(){return d.get("selectedLanguage")});get(d,"defaultLanguage",function(){return d.get("defaultLanguage")});d.getText=function(k,o){var i=d.get("elements")[k];if(!emp(i)&&(!emp(i[d.selectedLanguage])||!emp(i[d.defaultLanguage]))){var b=i[d.selectedLanguage]||i[d.defaultLanguage];if(o){map(o,function(a,c){b=b.replace("{{"+a+"}}",c)})};return b};console.warn("Missing translation:",k);return k}});c1(ASJSUtils,"Config",ASJS.AbstractModel);c0(ASJSUtils,"LoadJSONServiceCommand",ASJS.AbstractCommand,function(c,d){var b=new ASJS.Promise();var f=new ASJS.Loader();c.new=function(){f.responseType="json";f.compressed=!0;f.method=ASJS.RequestMethod.GET;f[on](ASJS.LoaderEvent.LOAD,e);f[on](ASJS.LoaderEvent.ERROR,g)};c.execute=function(a){f.load(a+"?v=200309070929");return b};c.destruct=function(){f.destruct();b.destruct();f=null;b=null;d.destruct()};function e(){b.resolve(f.content);c.destruct()};function g(){b.reject(f.content);c.destruct()}});c0(ASJSUtils,"LoadStartupDataCommand",ASJS.AbstractCommand,function(d,e){var b;d.new=function(){b=new ASJS.Promise()};d.execute=function(){i();return b};d.destruct=function(){b.destruct();b=null;e.destruct()};function i(){g("config.dat",function(f){ASJSUtils.Config.instance.data=f;k()})};function k(){g("language.dat",function(f){ASJSUtils.Language.instance.data=f;l()})};function l(){b.resolve();d.destruct()};function g(a,h){(new ASJSUtils.LoadJSONServiceCommand()).execute("data/"+a).then(h).catch(j)};function j(c){b.reject();d.destruct();throw new Error("JSON load error")}});c1(ASJSUtils,"URLParser",ASJS.BaseClass,function(f){var j;f.getQueryParams=function(){return j};f.getQueryParam=function(d){m();return j[d]};f.parseURL=function(){return decodeURIComponent(location.href).split("/")};f.createUrlParams=function(g,h){var a="";for(var k in g){if(a!=="")a+="&";a+=k+"="+g[k]};var i=_w.location.href.split("?")[0]+"?"+a;if(h)_w.location.href=i;else _w.history.pushState("","",i)};function m(){if(!j){var l=decodeURIComponent(location.href);var b=l.indexOf("?");var g=l.substring(b+1).split("&");j={};var c;while(c=g.shift()){var e=c.split("=");j[e[0]]=e[1]}}}});c3(ASJSUtils,"Cookies");rof(ASJSUtils.Cookies,"createCookie",function(n,v,d){if(d){var b=new Date();b.setTime(b.getTime()+(d*86400000));var f="; expires="+b.toGMTString()}else var f="";_d.cookie=n+"="+v+f+"; path=/";try{!emp(Storage)&&localStorage.setItem(n,v)}catch(e){trc(e)}});rof(ASJSUtils.Cookies,"readCookie",function(n){var e=n+"=";var a=_d.cookie.split(';');var i=-1;var l=a.length;while(++i<l){var c=a[i];while(c.charAt(0)===' ')c=c.substring(1,c.length);if(c.indexOf(e)===0)return c.substring(e.length,c.length)};try{if(!emp(Storage))return localStorage.getItem(n)}catch(e){trc(e)};return null});rof(ASJSUtils.Cookies,"eraseCookie",function(n){_scope.createCookie(n,"",-1);try{!emp(Storage)&&localStorage.removeItem(n)}catch(e){trc(e)}});c0(NS,"EnvironmentCommand",ASJS.AbstractCommand,function(b,c){var f=ASJSUtils.Language.instance;var e=ASJSUtils.Cookies;var d=ASJSUtils.Config.instance;var h=ASJSUtils.URLParser.instance;var l;b.execute=function(){j();i()};function j(){function m(a){return emp(a)||f.supportedLanguages.indexOf(a)===-1?null:a};var n=m(h.getQueryParam('lang'))||m(e.readCookie('language'))||m((navigator.language||navigator.userLanguage).split("-")[0])||f.selectedLanguage;f.set("selectedLanguage",n);e.createCookie('language',f.selectedLanguage);_d.title=f.getText("title")};function i(){stage[on](ASJS.Stage.RESIZE,k)};function k(){l=clearTimeout(l);l=setTimeout(g,d.get("resizeInterval"))};function g(){l=clearTimeout(l);requestAnimationFrame(function(){c.prot.sendNotification(ASJS.Stage.RESIZE)})}});c0(ASJSUtils,"AbstractView",ASJS.AbstractView,function(b,c){var g;b.new=function(){c.new();b[on](ASJS.Stage.ADDED_TO_STAGE,d);b[on](ASJS.AnimationEvent.TRANSITION_END,e);b.addClass("abstract-view animate")};c.prot.animateTo=function(a,f){g=f;b.alpha=bw(0,1,a)};b.hide=c.prot.animateTo.bind(b,0);b.destruct=function(){g=null;c.destruct()};function d(){b.alpha=0;requestAnimationFrame(function(){c.prot.animateTo(1)})};function e(){g&&g();g=null}});c0(NS,"ExternalApplicationView",ASJSUtils.AbstractView,function(a,b){var e=ASJSUtils.Language.instance;var c=ASJS.Mouse.instance;var f=new ASJS.Sprite();var d=new ASJS.Label();var g=new ASJS.DisplayObject();var k=new ASJS.Sprite();var j;a.new=function(){b.new();a.addClass("external-application-view");a.setCSS("position","fixed");f.addClass("container");a.addChild(f);d.addClass("title-label");f.addChild(d);g.addClass("close-button");g[on](ASJS.MouseEvent.CLICK,h);f.addChild(g);k.addClass("external-application-container");f.addChild(k)};set(a,"title",function(v){d.text=v});a.addExternalApplication=function(i){a.removeExternalApplication();j=new i();j[on](ASJS.LoaderEvent.LOAD,function(){j[off](ASJS.LoaderEvent.LOAD);a.title=j.title});k.addChild(j);a.render()};a.removeExternalApplication=function(){if(!j)return;k.removeChild(j);j.destruct();j=null};function h(){b.prot.animateTo(0,function(){a[de](NS.ExternalApplicationMediator.CLOSE)})}});c0(NS,"ExternalApplicationMediator",ASJS.AbstractViewMediator,function(c,d){var b=d.prot.view=new NS.ExternalApplicationView();var h=new ASJS.ScriptLoader();c.new=function(a){d.new(a);d.prot.addHandler(NS.ExternalApplicationMediator.SHOW,f);d.prot.addHandler(NS.ExternalApplicationMediator.HIDE,g);b[on](NS.ExternalApplicationMediator.CLOSE,i);h[on](ASJS.LoaderEvent.LOAD,l);h[on](ASJS.LoaderEvent.PROGRESS,m)};function f(){d.prot.show();j()};function g(){d.prot.hide();k()};var i=g;function j(){k();h.compressed=!0;h.load("external/application.dat?v=200309070929")};function k(){b.removeExternalApplication();h.cancel();h.unload()};function l(e){b.addExternalApplication(h.content);h.unload()};function m(e){b.title=((e.detail.loaded/e.detail.total)*100)+"%"}});msg(NS.ExternalApplicationMediator,"SHOW");msg(NS.ExternalApplicationMediator,"HIDE");msg(NS.ExternalApplicationMediator,"CLOSE");c0(NS,"NotificationWindowView",ASJSUtils.AbstractView,function(a,b){var l={};var d=new ASJS.Scale9Grid();var g=new ASJS.Sprite();var c=new ASJS.Sprite();var e=new ASJS.Sprite();var f=new ASJS.Button();var i=new ASJS.Button();a.new=function(){b.new();a.addClass("notification-window-view");d.addClass("notification-window");d.rect=new ASJS.Rectangle(13,60,4,7);d.backgroundImage="images/window.png?v=200309070929";a.addChild(d);g.addClass("notification-window-container");a.addChild(g);c.addClass("title-label");g.addChild(c);e.addClass("content-label");g.addChild(e);f[on](ASJS.MouseEvent.CLICK,function(){a.hideWindow();if(!emp(l['okCallback']))l['okCallback']()});f.addClass("ok-button button");i[on](ASJS.MouseEvent.CLICK,function(){a.hideWindow();if(!emp(l['cancelCallback']))l['cancelCallback']()});i.addClass("cancel-button button")};a.hideWindow=function(){b.prot.animateTo(0,function(){a[de](NS.NotificationWindowMediator.HIDE);c.html="";e.html="";if(h())a.removeChild(f);f.label="";if(j())a.removeChild(i);i.label=""})};a.showWindow=function(k){l=k;c.html=l.title;e.html=l.content;if(l['showOk']){f.label=l['okLabel'];!h()&&g.addChild(f)}else h()&&g.removeChild(f);if(l['showCancel']){i.label=l['cancelLabel'];!j()&&g.addChild(i)}else j()&&g.removeChild(i)};a.render=function(){d.setSize(bw(150,stage.stageWidth,l.width),bw(150,stage.stageHeight,l.height));d.render();g.setSize(d.width,d.height);e.height=(g.height-e.y)-(h()||j()?(f.height+20):0)-25;e.render&&e.render();if(h()){f.x=j()?g.width*0.5-10-f.width:((g.width-f.width)*0.5)};if(j()){i.x=h()?g.width*0.5+10:((g.width-i.width)*0.5)}};function h(){return g.contains(f)};function j(){return g.contains(i)}});c0(NS,"NotificationWindowMediator",ASJS.AbstractViewMediator,function(e,f){var c=f.prot.view=new NS.NotificationWindowView();var j=ASJSUtils.Language.instance;var d=[];var i=!1;var m="";var o="";e.new=function(b){f.new(b);f.prot.addHandler(NS.NotificationWindowMediator.SHOW,g);c[on](NS.NotificationWindowMediator.HIDE,h);m=j.getText('notification_ok_button');o=j.getText('notification_cancel_button')};function g(a){if(emp(a))a=new NS.NotificationDataVo();if(!a.okLabel)a.okLabel=m;if(!a.cancelLabel)a.cancelLabel=o;d.push(a);if(!i)l()};function h(){d.length>0?l():k()};function k(){f.prot.hide();i=!1};function l(){var n=d.shift();i=!0;c.showWindow(n);f.prot.show()}});msg(NS.NotificationWindowMediator,"SHOW");msg(NS.NotificationWindowMediator,"HIDE");c0(NS,"NotificationWindowDataVo",ASJS.BaseClass,function(a){a.new=function(){a.title="";a.content="";a.showOk=!0;a.showCancel=!1;a.okCallback=null;a.cancelCallback=null;a.okLabel=null;a.cancelLabel=null;a.width=500;a.height=200}});c0(NS,"Box",ASJS.Sprite,function(a,b){var e=ASJSUtils.Language.instance;var c=new ASJS.Label();var d=new ASJS.Button();a.new=function(){b.new();a.addClass("box");c.text=e.getText("new_asjs_base_site");c.addClass("label");a.addChild(c);d.label=e.getText("show_notification_window");d.addClass("button show-notification-button");d[on](ASJS.MouseEvent.CLICK,f);a.addChild(d)};get(a,"label",function(){return c});function f(){a[de](NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW)}});c0(NS,"ContentView",ASJSUtils.AbstractView,function(c,e){var g=ASJSUtils.Language.instance;var d=ASJS.Mouse.instance;var i=new ASJS.DisplayObject();var a=new NS.Box();var t=new ASJS.Button();var m=new ASJS.DisplayObject();var b=!1;var j=new ASJS.BlurFilter();c.new=function(){e.new();c.addClass("content-view");c[on](ASJS.Stage.ADDED_TO_STAGE,l);c[on](ASJS.Stage.REMOVED_FROM_STAGE,n);i.addClass("background");c.addChild(i);c.addChild(a);m.addClass("animated-sprite");c.addChild(m);m[on](ASJS.MouseEvent.CLICK,q);m[on](ASJS.MouseEvent.MOUSE_DOWN+" "+ASJS.MouseEvent.TOUCH_START,s);t.label=g.getText("show_external_application_button_label");t.addClass("button show-external-application-button");t[on](ASJS.MouseEvent.CLICK,u);c.addChild(t)};function l(){stage[on](ASJS.MouseEvent.MOUSE_UP+" "+ASJS.MouseEvent.TOUCH_END,h);stage[on](ASJS.MouseEvent.MOUSE_LEAVE,h);stage[on](ASJS.MouseEvent.MOUSE_MOVE+" "+ASJS.MouseEvent.TOUCH_MOVE,o);c[on](ASJS.MouseEvent.CLICK,k);r()};function n(){stage[off]([ASJS.MouseEvent.MOUSE_UP,ASJS.MouseEvent.TOUCH_END],h);stage[off](ASJS.MouseEvent.MOUSE_LEAVE,h);stage[off]([ASJS.MouseEvent.MOUSE_MOVE,ASJS.MouseEvent.TOUCH_MOVE],o);c[off](ASJS.MouseEvent.CLICK,k)};function p(){if(!m)return;m.setSize(256,128);m.removeClass("animation-fireworks");m.addClass("animation-explode")};function r(){if(!m)return;m.setSize(200,200);m.removeClass("animation-explode");m.addClass("animation-fireworks")};function q(){if(m.hasClass("animation-fireworks"))p();else r()};function s(){b=!0};function h(){b=!1};function o(){j.value=(_m.max(0,stage.stageHeight/(stage.stageHeight-d.mouseY))/10);i.filters=[j];if(!b)return;m.move(d.mouseX-m.width*0.5,d.mouseY-m.height*0.5)};function k(){var f=a.hitTest(new ASJS.Point(d.mouseX,d.mouseY));a.label.text=g.getText(f?"hit_test_inside":"hit_test_outside")};function u(){c[de](NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION)}});c0(NS,"ContentMediator",ASJS.AbstractViewMediator,function(c,d){var b=d.prot.view=new NS.ContentView();var f=ASJSUtils.Language.instance;c.new=function(a){d.new(a);d.prot.addHandler(NS.ContentMediator.SHOW,e);b[on](NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,g);b[on](NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION,h)};function e(){d.prot.show()};function g(){var i=new NS.NotificationWindowDataVo();i.title=f.getText("notification_title");i.content=f.getText("notification_content");i.height=230;d.prot.sendNotification(NS.NotificationWindowMediator.SHOW,i)};function h(){d.prot.sendNotification(NS.ExternalApplicationMediator.SHOW)}});msg(NS.ContentMediator,"SHOW");msg(NS.ContentMediator,"ON_SHOW_EXTERNAL_APPLICATION");msg(NS.ContentMediator,"ON_SHOW_NOTIFICATION_WINDOW");c0(NS,"ViewPrepCommand",ASJS.AbstractCommand,function(b,c){b.execute=function(a){new NS.ContentMediator(a);new NS.ExternalApplicationMediator(a);new NS.NotificationWindowMediator(a);c.prot.sendNotification(NS.ContentMediator.SHOW);b.destruct()}});c0(NS,"StartupCommand",ASJS.AbstractCommand,function(b){b.execute=function(a){(new ASJSUtils.LoadStartupDataCommand()).execute().then(c.bind(b,a))};function c(a){(new NS.EnvironmentCommand()).execute();(new NS.ViewPrepCommand()).execute(a);b.destruct()}});c0(NS,"Application",ASJS.BaseClass,function(a){a.new=function(){stage.clear();trc("<AS/JS> Application 3.2.0.200309070929");(new NS.StartupCommand()).execute(stage)}});ASJS.start(NS.Application);