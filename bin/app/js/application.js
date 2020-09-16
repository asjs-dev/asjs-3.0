var NS={};var ASJSUtils={};c1(ASJSUtils,"Language",ASJS.AbstractModel,function(d){get(d,"supportedLanguages",function(){return d.get("supportedLanguages")});get(d,"selectedLanguage",function(){return d.get("selectedLanguage")});get(d,"defaultLanguage",function(){return d.get("defaultLanguage")});d.getText=function(k,o){var i=d.get("elements")[k];if(!emp(i)&&(!emp(i[d.selectedLanguage])||!emp(i[d.defaultLanguage]))){var b=i[d.selectedLanguage]||i[d.defaultLanguage];if(o){map(o,function(a,c){b=b.replace("{{"+a+"}}",c)})};return b};console.warn("Missing translation:",k);return k}});c1(ASJSUtils,"Config",ASJS.AbstractModel);c0(ASJSUtils,"LoadJSONServiceCommand",ASJS.AbstractCommand,function(c,d){var b=new ASJS.Promise();var f=new ASJS.Loader();c.new=function(){f.responseType="json";f.compressed=!0;f.method=ASJS.RequestMethod.GET;f[on](ASJS.LoaderEvent.LOAD,e);f[on](ASJS.LoaderEvent.ERROR,g)};c.execute=function(a){f.load(a+"?v=200916142203");return b};ovrd(c,d,"destruct");c.destruct=function(){f.destruct();b.destruct();f=b=null;d.destruct()};function e(){b.resolve(f.content);c.destruct()};function g(){b.reject(f.content);c.destruct()}});c0(ASJSUtils,"LoadStartupDataCommand",ASJS.AbstractCommand,function(d,e){var b;d.new=function(){b=new ASJS.Promise()};d.execute=function(){i();return b};ovrd(d,e,"destruct");d.destruct=function(){b.destruct();b=null;e.destruct()};function i(){g("config.dat",function(f){ASJSUtils.Config.instance.data=f;k()})};function k(){g("language.dat",function(f){ASJSUtils.Language.instance.data=f;l()})};function l(){b.resolve();d.destruct()};function g(a,h){(new ASJSUtils.LoadJSONServiceCommand()).execute("data/"+a).then(h).catch(j)};function j(c){b.reject();d.destruct();throw new Error("JSON load error")}});c1(ASJSUtils,"URLParser",BaseClass,function(e){var p=null;var n=null;e.getUrlParams=function(){return o()};e.getQueryParams=function(){return o().query};e.getHashParams=function(){return o().hash};e.getQueryParam=function(d){return e.getQueryParams()[d]};e.getHashParam=function(d){return e.getHashParams()[d]};e.getParsedPath=function(){return o().base.split("/")};e.setUrlParams=function(l,j){var h=l.base;if(Object.keys(l.query).length>0)h+="?"+t(l.query);if(Object.keys(l.hash).length>0)h+="#"+t(l.hash);if(j)_w.location.href=h;else _w.history.pushState("","",h)};e.setQueryParams=function(r,j){var l=o();l.query=r;e.setUrlParams(l,j)};e.setHashParams=function(q,j){var l=o();l.hash=q;e.setUrlParams(l,j)};function t(l){var s="";for(var k in l)s+=(s!==""?"&":"")+k+"="+l[k];return s};function o(){if(n===null||p!==decodeURIComponent(location.href)){p=decodeURIComponent(location.href);n={"base":"","hash":{},"query":{}};var c="base";var a="";var m=!1;var f=p.split(/([\?#=&])/g);for(var i=0,l=f.length;i<l;++i){var b=f[i];var g=i+1>=l;if(["&","?","#"].indexOf(b)>-1&&!g){if(b==="?")c="query";else if(b==="#")c="hash";if(c!=="base"){a=f[++i];m=a.length>=3&&a.indexOf("[]")===a.length-2;if(m)a=a.slice(0,a.length-2)}}else if(c==="base")n[c]+=b;else if(b==="="&&!g){if(m){if(n[c][a]===undefined)n[c][a]=[];n[c][a].push(f[++i])}else n[c][a]=f[++i]}}};return clone(n)}});c3(ASJSUtils,"Cookies");rof(ASJSUtils.Cookies,"createCookie",function(n,v,d){if(d){var b=new Date();b.setTime(b.getTime()+(d*86400000));var f="; expires="+b.toGMTString()}else var f="";_d.cookie=n+"="+v+f+"; path=/";try{!emp(Storage)&&localStorage.setItem(n,v)}catch(e){trc(e)}});rof(ASJSUtils.Cookies,"readCookie",function(n){var e=n+"=";var a=_d.cookie.split(';');var i=-1;var l=a.length;while(++i<l){var c=a[i];while(c.charAt(0)===' ')c=c.substring(1,c.length);if(c.indexOf(e)===0)return c.substring(e.length,c.length)};try{if(!emp(Storage))return localStorage.getItem(n)}catch(e){trc(e)};return null});rof(ASJSUtils.Cookies,"eraseCookie",function(n){_scope.createCookie(n,"",-1);try{!emp(Storage)&&localStorage.removeItem(n)}catch(e){trc(e)}});c0(NS,"EnvironmentCommand",ASJS.AbstractCommand,function(b,c){var f=ASJSUtils.Language.instance;var e=ASJSUtils.Cookies;var d=ASJSUtils.Config.instance;var g=ASJSUtils.URLParser.instance;b.execute=function(){i();h()};function i(){function k(a){return emp(a)||!f.supportedLanguages.has(a)?null:a};var l=k(g.getQueryParam('lang'))||k(e.readCookie('language'))||k((navigator.language||navigator.userLanguage).split("-")[0])||f.selectedLanguage;f.set("selectedLanguage",l);e.createCookie('language',f.selectedLanguage);_d.title=f.getText("title")};function h(){stage[on](ASJS.Stage.RESIZE,j)};var j=tf(function(){c.prot.sendNotification(ASJS.Stage.RESIZE)})});c0(ASJSUtils,"AbstractAnimatedView",ASJS.AbstractView,function(c,d){var h;ovrd(c,d,"new");c.new=function(){d.new();c[on](ASJS.Stage.ADDED_TO_STAGE,e);c[on](ASJS.AnimationEvent.TRANSITION_END,f);c.addClass("abstract-view animate")};d.prot.animateTo=function(a,g){h=g;c.alpha=bw(0,1,a)};c.hide=d.prot.animateTo.bind(c,0);ovrd(c,d,"destruct");c.destruct=function(){h=null;d.destruct()};function e(b){if(b.target!==c.el)return;c.alpha=0;requestAnimationFrame(function(){d.prot.animateTo(1)})};function f(b){if(b.target!==c.el)return;h&&h();h=null}});c0(NS,"ExternalApplicationView",ASJSUtils.AbstractAnimatedView,function(a,b){var e=ASJSUtils.Language.instance;var c=ASJS.Mouse.instance;var f=new ASJS.Sprite();var d=new ASJS.Label();var g=new ASJS.DisplayObject();var k=new ASJS.Sprite();var j;ovrd(a,b,"new");a.new=function(){b.new();a.addClass("external-application-view");a.setCSS("position","fixed");f.addClass("container");a.addChild(f);d.addClass("title-label");f.addChild(d);g.addClass("close-button");g[on](ASJS.MouseEvent.CLICK,h);f.addChild(g);k.addClass("external-application-container");f.addChild(k)};set(a,"title",function(v){d.text=v});a.addExternalApplication=function(i){a.removeExternalApplication();j=new i();j[on](ASJS.LoaderEvent.LOAD,function(){j[off](ASJS.LoaderEvent.LOAD);a.title=j.title});k.addChild(j);a.render()};a.removeExternalApplication=function(){if(!j)return;k.removeChild(j);j.destruct();j=null};function h(){b.prot.animateTo(0,function(){a[de](NS.ExternalApplicationMediator.CLOSE)})}});c0(NS,"ExternalApplicationMediator",ASJS.AbstractViewMediator,function(c,d){var b=d.prot.view=new NS.ExternalApplicationView();var h=new ASJS.ScriptLoader();ovrd(c,d,"new");c.new=function(a){d.new(a);d.prot.addHandler(NS.ExternalApplicationMediator.SHOW,f);d.prot.addHandler(NS.ExternalApplicationMediator.HIDE,g);b[on](NS.ExternalApplicationMediator.CLOSE,i);h[on](ASJS.LoaderEvent.LOAD,l);h[on](ASJS.LoaderEvent.PROGRESS,m)};function f(){d.prot.show();j()};function g(){d.prot.hide();k()};var i=g;function j(){k();h.compressed=!0;h.load("external/application.dat?v=200916142203")};function k(){b.removeExternalApplication();h.cancel();h.unload()};function l(e){b.addExternalApplication(h.content);h.unload()};function m(e){b.title=((e.detail.loaded/e.detail.total)*100)+"%"}});msg(NS.ExternalApplicationMediator,"SHOW");msg(NS.ExternalApplicationMediator,"HIDE");msg(NS.ExternalApplicationMediator,"CLOSE");c0(NS,"NotificationWindowView",ASJSUtils.AbstractAnimatedView,function(c,d){var p={};var f=new ASJS.Scale9Grid();var j=new ASJS.Sprite();var e=new ASJS.Sprite();var g=new ASJS.Sprite();var i=new ASJS.Button();var m=new ASJS.Button();var k=new ASJS.ScrollBar();ovrd(c,d,"new");c.new=function(){d.new();c.addClass("notification-window-view");f.addClass("window");f.init("images/window.png?v=200916142203",ASJS.Rectangle.create(13,60,4,7));c.addChild(f);j.addClass("container");c.addChild(j);e.addClass("title-label");j.addChild(e);g.addClass("content-label");k.addClass("scrollbar");k.horizontalAngle=k.verticalAngle=-1;k.scrollSpeed=0.15;k.container.addClass("animate");k.container.addChild(g);k.verticalScrollBar.addClass("animate scrollbar-vertical");k.horizontalScrollBar.addClass("animate scrollbar-horizontal");j.addChild(k);i[on](ASJS.MouseEvent.CLICK,function(){c.hideWindow();!emp(p['okCallback'])&&p['okCallback']()});i.addClass("ok-button button");m[on](ASJS.MouseEvent.CLICK,function(){c.hideWindow();!emp(p['cancelCallback'])&&p['cancelCallback']()});m.addClass("cancel-button button")};c.hideWindow=function(){d.prot.animateTo(0,function(){c[de](NS.NotificationWindowMediator.HIDE);h();l()&&c.removeChild(i);n()&&c.removeChild(m)})};c.showWindow=function(o){h();p=o;if(tis(p.title,"string"))e.html=p.title;else if(is(p.title,ASJS.Tag))e.addChild(p.title);if(tis(p.content,"string"))g.html=p.content;else if(is(p.content,ASJS.Tag))g.addChild(p.content);if(p['showOk']){i.label=p['okLabel'];!l()&&j.addChild(i)}else l()&&j.removeChild(i);if(p['showCancel']){m.label=p['cancelLabel'];!n()&&j.addChild(m)}else n()&&j.removeChild(m)};c.render=function(){f.setSize(bw(150,stage.stageWidth,p.width),bw(150,stage.stageHeight,p.height));j.setSize(f.width,f.height);k.setSize(j.width-k.x*2,(j.height-k.y)-(l()||n()?(i.height+20):0)-25);b(p.title)&&p.title.render&&p.title.render();b(p.content)&&p.content.render&&p.content.render();requestAnimationFrame(k.update);if(l()){i.x=n()?j.width*0.5-10-i.width:((j.width-i.width)*0.5)};if(n()){m.x=l()?j.width*0.5+10:((j.width-m.width)*0.5)}};function l(){return j.contains(i)};function n(){return j.contains(m)};function h(){if(p){b(p.title)&&e.removeChild(p.title);b(p.content)&&g.removeChild(p.content)};e.text=g.text=i.label=m.label=""};function b(a){return tis(a,"object")&&is(a,ASJS.Tag)}});c0(NS,"NotificationWindowMediator",ASJS.AbstractViewMediator,function(e,f){var c=f.prot.view=new NS.NotificationWindowView();var j=ASJSUtils.Language.instance;var d=[];var i=!1;var m="";var o="";ovrd(e,f,"new");e.new=function(b){f.new(b);f.prot.addHandler(NS.NotificationWindowMediator.SHOW,g);c[on](NS.NotificationWindowMediator.HIDE,h);m=j.getText('notification_ok_button');o=j.getText('notification_cancel_button')};function g(a){if(emp(a))a=new NS.NotificationDataVo();if(!a.okLabel)a.okLabel=m;if(!a.cancelLabel)a.cancelLabel=o;d.push(a);if(!i)l()};function h(){d.length>0?l():k()};function k(){f.prot.hide();i=!1};function l(){var n=d.shift();i=!0;c.showWindow(n);f.prot.show()}});msg(NS.NotificationWindowMediator,"SHOW");msg(NS.NotificationWindowMediator,"HIDE");c3(NS,"NotificationWindowData");rof(NS.NotificationWindowData,"create",function(){return{"title":"","content":"","showOk":!0,"showCancel":!1,"okCallback":null,"cancelCallback":null,"okLabel":null,"cancelLabel":null,"width":500,"height":200}});c0(NS,"Box",ASJS.Sprite,function(a,b){var e=ASJSUtils.Language.instance;var c=new ASJS.Label();var d=new ASJS.Button();ovrd(a,b,"new");a.new=function(){b.new();a.addClass("box");c.text=e.getText("new_asjs_base_site");c.addClass("label");a.addChild(c);d.label=e.getText("show_notification_window");d.addClass("button show-notification-button");d[on](ASJS.MouseEvent.CLICK,f);a.addChild(d)};get(a,"label",function(){return c});function f(){a[de](NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW)}});c0(NS,"ContentView",ASJSUtils.AbstractAnimatedView,function(c,d){var g=ASJSUtils.Language.instance;var e=ASJS.Mouse.instance;var h=new ASJS.DisplayObject();var a=new NS.Box();var n=new ASJS.Button();var i=new ASJS.BlurFilter();ovrd(c,d,"new");c.new=function(){d.new();c.addClass("content-view");c[on](ASJS.Stage.ADDED_TO_STAGE,j);c[on](ASJS.Stage.REMOVED_FROM_STAGE,l);h.addClass("background");c.addChild(h);c.addChild(a);n.label=g.getText("show_external_application_button_label");n.addClass("button show-external-application-button");n[on](ASJS.MouseEvent.CLICK,o);c.addChild(n)};function j(b){if(b.target!==c.el)return;stage[on](ASJS.MouseEvent.MOUSE_MOVE+" "+ASJS.MouseEvent.TOUCH_MOVE,m);c[on](ASJS.MouseEvent.CLICK,k)};function l(){stage[off]([ASJS.MouseEvent.MOUSE_MOVE,ASJS.MouseEvent.TOUCH_MOVE],m);c[off](ASJS.MouseEvent.CLICK,k)};function m(){i.value=(_m.max(0,stage.stageHeight/(stage.stageHeight-e.mouseY))/10);h.filters=[i]};function k(){var f=a.hitTest(ASJS.Point.create(e.mouseX,e.mouseY));a.label.text=g.getText(f?"hit_test_inside":"hit_test_outside")};function o(){c[de](NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION)}});c0(NS,"ContentMediator",ASJS.AbstractViewMediator,function(c,d){var b=d.prot.view=new NS.ContentView();var f=ASJSUtils.Language.instance;ovrd(c,d,"new");c.new=function(a){d.new(a);d.prot.addHandler(NS.ContentMediator.SHOW,e);b[on](NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,g);b[on](NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION,i)};function e(){d.prot.show()};function g(){var h=NS.NotificationWindowData.create();h.title=f.getText("notification_title");h.content=f.getText("notification_content");h.height=230;d.prot.sendNotification(NS.NotificationWindowMediator.SHOW,h)};function i(){d.prot.sendNotification(NS.ExternalApplicationMediator.SHOW)}});msg(NS.ContentMediator,"SHOW");msg(NS.ContentMediator,"ON_SHOW_EXTERNAL_APPLICATION");msg(NS.ContentMediator,"ON_SHOW_NOTIFICATION_WINDOW");c0(NS,"ViewPrepCommand",ASJS.AbstractCommand,function(b,c){b.execute=function(a){new NS.ContentMediator(a);new NS.ExternalApplicationMediator(a);new NS.NotificationWindowMediator(a);c.prot.sendNotification(NS.ContentMediator.SHOW);b.destruct()}});c0(NS,"StartupCommand",ASJS.AbstractCommand,function(b){b.execute=function(a){(new ASJSUtils.LoadStartupDataCommand()).execute().then(c.bind(b,a))};function c(a){(new NS.EnvironmentCommand()).execute();(new NS.ViewPrepCommand()).execute(a);b.destruct()}});c0(NS,"Application",BaseClass,function(a){a.new=function(){stage.clear();trc("<AS/JS> Application 3.2.0.200916142203");(new NS.StartupCommand()).execute(stage)}});ASJS.start(NS.Application);