var NS={};var ASJSUtils={};createClass(ASJSUtils,"LoadJSONServiceCommand",ASJS.AbstractCommand,function(v2){v2.execute=function(v1){var v0=new ASJS.Promise();var v3=new ASJS.Loader();v3.responseType="json";v3.compressed=!0;v3.method=ASJS.RequestMethod.GET;v3.addEventListener(ASJS.LoaderEvent.LOAD,function(e){v0.resolve(v3.content);v3.unload();});v3.addEventListener(ASJS.LoaderEvent.ERROR,function(e){v0.reject(v3.content);v3.unload();});v3.load(v1+"?v=190614071330");return v0;}});createSingletonClass(ASJSUtils,"Language",ASJS.AbstractModel,function(v2){get(v2,"supportedLanguages",function(){return v2.get("supportedLanguages");});get(v2,"selectedLanguage",function(){return v2.get("selectedLanguage");});get(v2,"defaultLanguage",function(){return v2.get("defaultLanguage");});v2.getText=function(k,o){var i=v2.get("elements")[k];if(!emp(i)&&(!emp(i[v2.selectedLanguage])||!emp(i[v2.defaultLanguage]))){var v0=i[v2.selectedLanguage]||i[v2.defaultLanguage];if(o){map(o,function(id,v1){v0=v0.replace("{{"+id+"}}",v1);});};return v0;};console.warn("Missing translation:",k);return k;}});createSingletonClass(ASJSUtils,"Config",ASJS.AbstractModel);createSingletonClass(ASJSUtils,"URLParser",ASJS.BaseClass,function(v4){var v6;v4.getQueryParam=function(v2){if(!v6||!v6[v2]){var v7=decodeURIComponent(location.href);var v0=v7.indexOf("?");var v5=v7.substring(v0+1).split("&");v6={};var v1;while(v1=v5.shift()){var v3=v1.split("=");v6[v3[0]]=v3[1];}};return v6[v2];};v4.parseURL=function(){return decodeURIComponent(location.href).split("/");}});createUtility(ASJSUtils,"Cookies");rof(ASJSUtils.Cookies,"createCookie",function(n,v,d){if(d){var v0=new Date();v0.setTime(v0.getTime()+(d*86400000));var v2="; expires="+v0.toGMTString();}else var v2="";document.cookie=n+"="+v+v2+"; path=/";try{if(!emp(Storage))localStorage.setItem(n,v);}catch(e){trc(e);}});rof(ASJSUtils.Cookies,"readCookie",function(n){var v1=n+"=";var ca=document.cookie.split(';');var i=-1;var l=ca.length;while(++i<l){var c=ca[i];while(c.charAt(0)===' ')c=c.substring(1,c.length);if(c.indexOf(v1)===0)return c.substring(v1.length,c.length);};try{if(!emp(Storage))return localStorage.getItem(n);}catch(e){trc(e);};return null;});rof(ASJSUtils.Cookies,"eraseCookie",function(n){_scope.createCookie(n,"",-1);try{if(!emp(Storage))localStorage.removeItem(n);}catch(e){trc(e);}});createClass(NS,"EnvironmentCommand",ASJS.AbstractCommand,function(v0){var v3=ASJSUtils.Language.instance;var v2=ASJSUtils.Cookies;var v1=ASJSUtils.Config.instance;var v5=ASJSUtils.URLParser.instance;var v9;v0.execute=function(){v7();v6();};function v7(){function va(sl){return emp(sl)||v3.supportedLanguages.indexOf(sl)===-1?null:sl;};var vb=va(v5.getQueryParam('lang'))||va(v2.readCookie('language'))||va((navigator.language||navigator.userLanguage).split("-")[0])||v3.selectedLanguage;v3.set("selectedLanguage",vb);v2.createCookie('language',v3.selectedLanguage);document.title=v3.getText("title");};function v6(){stage.addEventListener(ASJS.Stage.RESIZE,v8);};function v8(){v9=clearTimeout(v9);v9=setTimeout(v4,v1.get("resizeInterval"));};function v4(){v9=clearTimeout(v9);requestAnimationFrame(function(){v0.sendNotification(ASJS.Stage.RESIZE);});}});createClass(ASJSUtils,"AbstractResizeMediator",ASJS.AbstractMediator,function(v2,v3){v3.prot.forceResize=!0;v2.new=function(v0){v3.new(v0);v3.prot.addHandler(ASJS.Stage.RESIZE,v3.prot.onResize);};v2.destruct=function(){v3.prot.removeHandler(ASJS.Stage.RESIZE,v3.prot.onResize);v3.destruct();};v3.prot.showView=function(){if(v3.prot.forceResize)v3.prot.onResize();};v3.prot.onResize=function(){v3.prot.forceResize=!0;var v1=v3.prot.view.getChildAt(0);if(emp(v1))return;v1.render();v3.prot.forceResize=!1;}});createClass(ASJSUtils,"AbstractView",ASJS.Sprite,function(v0,v1){var v6;v0.new=function(){v1.new();v0.addEventListener(ASJS.Stage.ADDED_TO_STAGE,v3);v0.addEventListener(ASJS.AnimationEvent.TRANSITION_END,v4);v0.addClass("animate");};v1.prot.animateTo=function(to,v5){v6=v5;v0.alpha=bw(0,1,to);};v0.hide=function(v2){v1.prot.animateTo(0,v2);};function v3(){v0.alpha=0;requestAnimationFrame(function(){v1.prot.animateTo(1);});};function v4(){v6&&v6();v6=null;}});createClass(NS,"ExternalApplicationView",ASJSUtils.AbstractView,function(v0,v1){var v4=ASJSUtils.Language.instance;var v2=ASJS.Mouse.instance;var v5=new ASJS.Sprite();var v3=new ASJS.Label();var v6=new ASJS.DisplayObject();var v9;v0.new=function(){v1.new();v0.addClass("external-application-view");v0.setCSS("position","fixed");v5.addClass("container");v0.addChild(v5);v3.addClass("title-label");v5.addChild(v3);v6.addClass("close-button");v6.addEventListener(ASJS.MouseEvent.CLICK,v7);v5.addChild(v6);requestAnimationFrame(v0.render);};set(v0,"title",function(v){v3.text=v;});v0.render=function(){v0.setSize(stage.stageWidth,stage.stageHeight);v5.setSize(v0.width-v5.x*2,v0.height-v5.y*2);v6.x=v5.width-v6.width-10;v3.width=v6.x-v3.x*2;if(v9&&v5.contains(v9)){v9.move(10,v6.y*2+v6.height);v9.setSize(v5.width-v9.x*2,v5.height-v9.y-v6.y);}};v0.addExternalApplication=function(v8){v0.removeExternalApplication();v9=new v8();v9.addEventListener(ASJS.LoaderEvent.LOAD,function(){v9.addEventListener(ASJS.LoaderEvent.LOAD);v0.title=v9.title;});v5.addChild(v9);v0.render();};v0.removeExternalApplication=function(){if(!v9)return;v5.removeChild(v9);v9.destruct();v9=null;};function v7(){v1.prot.animateTo(0,function(){v0.dispatchEvent(NS.ExternalApplicationMediator.CLOSE);});}});createClass(NS,"ExternalApplicationMediator",ASJSUtils.AbstractResizeMediator,function(v2,v3){var v1=new NS.ExternalApplicationView();var v6=new ASJS.ScriptLoader();v2.new=function(v0){v3.new(v0);v3.prot.addHandler(NS.ExternalApplicationMediator.SHOW,v4);v3.prot.addHandler(NS.ExternalApplicationMediator.HIDE,v5);v1.addEventListener(NS.ExternalApplicationMediator.CLOSE,v7);v6.addEventListener(ASJS.LoaderEvent.LOAD,va);v6.addEventListener(ASJS.LoaderEvent.PROGRESS,vb);};function v4(){if(!v3.prot.view.contains(v1))v3.prot.view.addChild(v1);v8();v3.prot.showView();};function v5(){if(v3.prot.view.contains(v1))v3.prot.view.removeChild(v1);v9();};function v7(){v5();};function v8(){v9();v6.compressed=!0;v6.load("external/application.dat?v=190614071330");};function v9(){v1.removeExternalApplication();v6.cancel();v6.unload();};function va(e){v1.addExternalApplication(v6.content);v6.unload();};function vb(e){v1.title=((e.detail.loaded/e.detail.total)*100)+"%";}});msg(NS.ExternalApplicationMediator,"SHOW");msg(NS.ExternalApplicationMediator,"HIDE");msg(NS.ExternalApplicationMediator,"CLOSE");createClass(NS,"NotificationWindowView",ASJSUtils.AbstractView,function(v0,v1){var va={};var v3=new ASJS.Scale9Grid();var v2=new ASJS.Sprite();var v4=new ASJS.Sprite();var v5=new ASJS.Button();var v7=new ASJS.Button();v0.new=function(){v1.new();v0.addClass("notification-window-view");v0.setCSS("position","fixed");v3.rect=new ASJS.Rectangle(13,60,4,7);v3.backgroundImage="images/window.png?v=190614071330";v0.addChild(v3);v2.addClass("title-label");v0.addChild(v2);v4.addClass("content-label");v0.addChild(v4);v5.addEventListener(ASJS.MouseEvent.CLICK,function(){v0.hideWindow();if(!emp(va['okCallback']))va['okCallback']();});v5.addClass("button");v7.addEventListener(ASJS.MouseEvent.CLICK,function(){v0.hideWindow();if(!emp(va['cancelCallback']))va['cancelCallback']();});v7.addClass("button");};v0.hideWindow=function(){v1.prot.animateTo(0,function(){v0.dispatchEvent(NS.NotificationWindowMediator.HIDE);v2.html="";v4.html="";if(v6())v0.removeChild(v5);v5.label="";if(v8())v0.removeChild(v7);v7.label="";});};v0.showWindow=function(v9){va=v9;v2.html=va.title;v4.html=va.content;if(va['showOk']){v5.label=va['okLabel'];if(!v6())v0.addChild(v5);}else if(v6())v0.removeChild(v5);if(va['showCancel']){v7.label=va['cancelLabel'];if(!v8())v0.addChild(v7);}else if(v8())v0.removeChild(v7);};v0.render=function(){v0.setSize(stage.stageWidth,stage.stageHeight);v3.setSize(bw(150,stage.stageWidth,va.width),bw(150,stage.stageHeight,va.height));v3.move((stage.stageWidth-v3.width)*0.5,Math.max(0,(stage.stageHeight-v3.height)*0.5));v3.render();v2.move(v3.x+25,v3.y+10);v2.width=v3.width-50;v4.move(v2.x,v2.y+v2.height+25);v4.setSize(v2.width,v3.height-v2.height-55-(v6()||v8()?60:0));if(v4.render)v4.render();v5.width=v3.width*0.5-20;if(v6()){v5.x=v3.x+(v8()?v3.width*0.5-10-v5.width:((v3.width-v5.width)*0.5));v5.y=v3.y+v3.height-v5.height-30;};v7.width=v5.width;if(v8()){v7.x=v3.x+(v6()?v3.width*0.5+10:((v3.width-v7.width)*0.5));v7.y=v3.y+v3.height-v7.height-30;}};function v6(){return v0.contains(v5);};function v8(){return v0.contains(v7);}});createClass(NS,"NotificationWindowMediator",ASJSUtils.AbstractResizeMediator,function(v5,v6){var v9=ASJSUtils.Language.instance;var v3=[];var v8=!1;var vc="";var ve="";var v4=new NS.NotificationWindowView();v5.new=function(v1){v6.new(v1);v6.prot.addHandler(NS.NotificationWindowMediator.SHOW,v7);v4.addEventListener(NS.NotificationWindowMediator.HIDE,v2);vc=v9.getText('notification_ok_button');ve=v9.getText('notification_cancel_button');};function v7(v0){if(emp(v0))v0=new NS.NotificationDataVo();if(!v0.okLabel)v0.okLabel=vc;if(!v0.cancelLabel)v0.cancelLabel=ve;v3.push(v0);if(!v8)vb();};function v2(){if(v3.length>0)vb();else va();};function va(){v6.prot.view.removeChild(v4);v8=!1;};function vb(){var vd=v3[0];v3.shift();v8=!0;v4.showWindow(vd);if(!v6.prot.view.contains(v4))v6.prot.view.addChild(v4);v6.prot.showView();}});msg(NS.NotificationWindowMediator,"SHOW");msg(NS.NotificationWindowMediator,"HIDE");createClass(NS,"NotificationWindowDataVo",ASJS.BaseClass,function(v0){v0.new=function(){v0.title="";v0.content="";v0.showOk=!0;v0.showCancel=!1;v0.okCallback=null;v0.cancelCallback=null;v0.okLabel=null;v0.cancelLabel=null;v0.width=500;v0.height=200;}});createClass(NS,"Box",ASJS.Sprite,function(v0,v1){var v4=ASJSUtils.Language.instance;var v2=new ASJS.Label();var v3=new ASJS.Button();v0.new=function(){v1.new();v0.addClass("box");v2.text=v4.getText("new_asjs_base_site");v2.addClass("label");v0.addChild(v2);v3.label=v4.getText("show_notification_window");v3.addClass("button show-notification-button");v3.addEventListener(ASJS.MouseEvent.CLICK,v5);v0.addChild(v3);};get(v0,"label",function(){return v2;});function v5(){v0.dispatchEvent(NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW);}});createClass(NS,"ContentView",ASJSUtils.AbstractView,function(v2,v4){var v6=ASJSUtils.Language.instance;var v3=ASJS.Mouse.instance;var v8=new ASJS.DisplayObject();var v0=new NS.Box();var vj=new ASJS.Button();var vc=new ASJS.DisplayObject();var v1=!1;var v9=new ASJS.BlurFilter();v2.new=function(){v4.new();v2.addClass("content-view");v2.addEventListener(ASJS.Stage.ADDED_TO_STAGE,vb);v2.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE,vd);v8.addClass("background");v8.setCSS("position","fixed");v8.alpha=0.5;v2.addChild(v8);v2.addChild(v0);vc.move(10,10);v2.addChild(vc);vc.addEventListener(ASJS.MouseEvent.CLICK,vg);vc.addEventListener(ASJS.MouseEvent.MOUSE_DOWN+" "+ASJS.MouseEvent.TOUCH_START,vi);vj.label=v6.getText("show_external_application_button_label");vj.addClass("button show-external-application-button");vj.addEventListener(ASJS.MouseEvent.CLICK,vk);v2.addChild(vj);requestAnimationFrame(v2.render);};v2.render=function(){v8.setSize(stage.stageWidth,stage.stageHeight);vj.x=v0.x=(stage.stageWidth-v0.width)*0.5;};function vb(){stage.addEventListener(ASJS.MouseEvent.MOUSE_UP+" "+ASJS.MouseEvent.TOUCH_END,v7);stage.addEventListener(ASJS.MouseEvent.MOUSE_LEAVE,v7);stage.addEventListener(ASJS.MouseEvent.MOUSE_MOVE+" "+ASJS.MouseEvent.TOUCH_MOVE,ve);v2.addEventListener(ASJS.MouseEvent.CLICK,va);vh();};function vd(){stage.removeEventListener([ASJS.MouseEvent.MOUSE_UP,ASJS.MouseEvent.TOUCH_END],v7);stage.removeEventListener(ASJS.MouseEvent.MOUSE_LEAVE,v7);stage.removeEventListener([ASJS.MouseEvent.MOUSE_MOVE,ASJS.MouseEvent.TOUCH_MOVE],ve);v2.removeEventListener(ASJS.MouseEvent.CLICK,va);};function vf(){if(!vc)return;vc.setSize(256,128);vc.removeClass("animation-fireworks");vc.addClass("animation-explode");};function vh(){if(!vc)return;vc.setSize(200,200);vc.removeClass("animation-explode");vc.addClass("animation-fireworks");};function vg(){if(vc.hasClass("animation-fireworks"))vf();else vh();};function vi(){v1=!0;};function v7(){v1=!1;};function ve(){v9.value=(Math.max(0,stage.stageHeight/(stage.stageHeight-v3.mouseY))/10);v8.filters=[v9];if(!v1)return;vc.move(v3.mouseX-vc.width*0.5,v3.mouseY-vc.height*0.5);};function va(){var v5=v0.hitTest(new ASJS.Point(v3.mouseX,v3.mouseY));v0.label.text=v6.getText(v5?"hit_test_inside":"hit_test_outside");};function vk(){v2.dispatchEvent(NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION);}});createClass(NS,"ContentMediator",ASJSUtils.AbstractResizeMediator,function(v2,v3){var v5=ASJSUtils.Language.instance;var v1=new NS.ContentView();v2.new=function(v0){v3.new(v0);v3.prot.addHandler(NS.ContentMediator.SHOW,v4);v1.addEventListener(NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,v6);v1.addEventListener(NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION,v7);};function v4(){v3.prot.showView();if(!v3.prot.view.contains(v1))v3.prot.view.addChild(v1);};function v6(){var v8=new NS.NotificationWindowDataVo();v8.title=v5.getText("notification_title");v8.content=v5.getText("notification_content");v8.height=230;v2.sendNotification(NS.NotificationWindowMediator.SHOW,v8);};function v7(){v2.sendNotification(NS.ExternalApplicationMediator.SHOW);}});msg(NS.ContentMediator,"SHOW");msg(NS.ContentMediator,"ON_SHOW_EXTERNAL_APPLICATION");msg(NS.ContentMediator,"ON_SHOW_NOTIFICATION_WINDOW");createClass(NS,"ViewPrepCommand",ASJS.AbstractCommand,function(v1){v1.execute=function(v0){new NS.ContentMediator(v0);new NS.ExternalApplicationMediator(v0);new NS.NotificationWindowMediator(v0);v1.sendNotification(NS.ContentMediator.SHOW);v1.destruct();}});createClass(NS,"StartupCommand",ASJS.AbstractCommand,function(v4){var v2;v4.execute=function(v1){v2=v1;v8();};function v8(){v6("config.dat",function(v5){ASJSUtils.Config.instance.data=v5;va();});};function va(){v6("language.dat",function(v5){ASJSUtils.Language.instance.data=v5;vb();});};function vb(){(new NS.EnvironmentCommand()).execute();(new NS.ViewPrepCommand()).execute(v2);v4.destruct();};function v6(v0,v7){(new ASJSUtils.LoadJSONServiceCommand()).execute("data/"+v0).then(v7).catch(v9);};function v9(v3){throw new Error("JSON load error");}});createClass(NS,"Application",ASJS.Sprite,function(v0,v1){v0.new=function(){v1.new();trc("<AS/JS> Application 3.2.0.190614071330");(new NS.StartupCommand()).execute(v0);}});ASJS.start(NS.Application);