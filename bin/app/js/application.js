var LoadJSONServiceCommand=c0("LoadJSONServiceCommand",ASJS.AbstractCommand,function(v2){v2.execute=function(v1){var v0=new ASJS.Promise();var v3=new ASJS.Loader();v3.responseType="json";v3.compressed=true;v3.method=ASJS.RequestMethod.GET;v3.addEventListener(ASJS.LoaderEvent.LOAD,function(e){v0.resolve(v3.content);v3.unload();});v3.addEventListener(ASJS.LoaderEvent.ERROR,function(e){v0.reject(v3.content);v3.unload();});v3.load(v1+"?v=180604062251");return v0;}});var Language=c1("Language",ASJS.AbstractModel,function(v2){get(v2,"supportedLanguages",function(){return v2.get("supportedLanguages");});get(v2,"selectedLanguage",function(){return v2.get("selectedLanguage");});get(v2,"defaultLanguage",function(){return v2.get("defaultLanguage");});v2.getText=function(k,o){var i=v2.get("elements")[k];if(!emp(i)&&(!emp(i[v2.selectedLanguage])||!emp(i[v2.defaultLanguage]))){var v0=i[v2.selectedLanguage]||i[v2.defaultLanguage];if(o){map(o,function(id,v1){v0=v0.replace("{{"+id+"}}",v1);});};return v0;};console.warn("Missing translation:",k);return k;}});var Config=c1("Config",ASJS.AbstractModel);var URLParser=c1("URLParser",ASJS.BaseClass,function(v4){var v6;v4.getQueryParam=function(v2){if(!v6||!v6[v2]){var v7=decodeURIComponent(location.href);var v0=v7.indexOf("?");var v5=v7.substring(v0+1).split("&");v6={};var v1;while(v1=v5.shift()){var v3=v1.split("=");v6[v3[0]]=v3[1];}};return v6[v2];};v4.parseURL=function(){return decodeURIComponent(location.href).split("/");}});var Cookies={};rof(Cookies,"createCookie",function(n,v,d){if(d){var v0=new Date();v0.setTime(v0.getTime()+(d*86400000));var v2="; expires="+v0.toGMTString();}else var v2="";document.cookie=n+"="+v+v2+"; path=/";try{if(!emp(Storage))localStorage.setItem(n,v);}catch(e){trc(e);}});rof(Cookies,"readCookie",function(n){var v1=n+"=";var ca=document.cookie.split(';');var i=-1;var l=ca.length;while(++i<l){var c=ca[i];while(c.charAt(0)===' ')c=c.substring(1,c.length);if(c.indexOf(v1)===0)return c.substring(v1.length,c.length);};try{if(!emp(Storage))return localStorage.getItem(n);}catch(e){trc(e);};return null;});rof(Cookies,"eraseCookie",function(n){_scope.createCookie(n,"",-1);try{if(!emp(Storage))localStorage.removeItem(n);}catch(e){trc(e);}});var EnvironmentCommand=c0("EnvironmentCommand",ASJS.AbstractCommand,function(v0){var v4=Language.instance;var v3=Cookies;var v1=ASJS.Cycler.instance;var v2=Config.instance;var v6=URLParser.instance;var v11;v0.execute=function(){v9();v8();v7();};function v9(){function v12(sl){return emp(sl)||v4.supportedLanguages.indexOf(sl)===-1?null:sl;};var v13=v12(v6.getQueryParam('lang'))||v12(v3.readCookie('language'))||v12((navigator.language||navigator.userLanguage).split("-")[0])||v4.selectedLanguage;v4.set("selectedLanguage",v13);v3.createCookie('language',v4.selectedLanguage);document.title=v4.getText("title");};function v8(){v1.fps=v2.get("fps");v1.start();};function v7(){stage.addEventListener(ASJS.Stage.RESIZE,v10);};function v10(){v11=clearTimeout(v11);v11=setTimeout(v5,v2.get("resizeInterval"));};function v5(){v11=clearTimeout(v11);requestAnimationFrame(function(){v0.sendNotification(ASJS.Stage.RESIZE);});}});var AbstractResizeMediator=c0("AbstractMediator",ASJS.AbstractMediator,function(v2,v3){v3.prot.forceResize=true;v2.new=function(v0){v3.new(v0);v3.prot.addHandler(ASJS.Stage.RESIZE,v3.prot.onResize);};v3.prot.showView=function(){if(v3.prot.forceResize)v3.prot.onResize();};v3.prot.onResize=function(){v3.prot.forceResize=true;var v1=v3.prot.view.getChildAt(0);if(emp(v1))return;v1.render();v3.prot.forceResize=false;}});var AbstractView=c0("AbstractView",ASJS.Sprite,function(v0,v1){var v5=[];v0.new=function(){v1.new();v0.addClass("animated");v0.addEventListener(ASJS.Stage.ADDED_TO_STAGE,v2);v0.addEventListener(ASJS.AnimationEvent.TRANSITION_END,v3);};v1.prot.animateTo=function(to,v4){v5.push(v4);v0.alpha=to;};function v2(){v1.prot.animateTo(1);};function v3(){while(v5.length>0){var v4=v5.shift();v4&&v4();}}});var ExternalApplicationView=c0("ExternalApplicationView",AbstractView,function(v0,v1){var v4=Language.instance;var v2=ASJS.Mouse.instance;var v5=new ASJS.Sprite();var v3=new ASJS.Label();var v6=new ASJS.DisplayObject();var v9;v0.new=function(){v1.new();v0.addClass("external-application-view");v0.setCSS("position","fixed");v5.addClass("container");v0.addChild(v5);v3.addClass("title-label");v5.addChild(v3);v6.addClass("close-button");v6.addEventListener(ASJS.MouseEvent.CLICK,v7);v5.addChild(v6);requestAnimationFrame(v0.render);};set(v0,"title",function(v){v3.text=v;});v0.render=function(){v0.setSize(stage.stageWidth,stage.stageHeight);v5.setSize(v0.width-v5.x*2,v0.height-v5.y*2);v6.x=v5.width-v6.width-10;v3.width=v6.x-v3.x*2;if(v9&&v5.contains(v9)){v9.move(10,v6.y*2+v6.height);v9.setSize(v5.width-v9.x*2,v5.height-v9.y-v6.y);}};v0.addExternalApplication=function(v8){v0.removeExternalApplication();v9=new v8();v9.addEventListener(ASJS.LoaderEvent.LOAD,function(){v9.addEventListener(ASJS.LoaderEvent.LOAD);v0.title=v9.title;});v5.addChild(v9);v0.render();};v0.removeExternalApplication=function(){if(!v9)return;v5.removeChild(v9);v9.destruct();v9=null;};function v7(){v1.prot.animateTo(0,function(){v0.dispatchEvent(ExternalApplicationMediator.CLOSE);});}});var ExternalApplicationMediator=c0("ExternalApplicationMediator",AbstractResizeMediator,function(v2,v3){var v1=new ExternalApplicationView();var v6=new ASJS.ScriptLoader();v2.new=function(v0){v3.new(v0);v3.prot.addHandler(ExternalApplicationMediator.SHOW,v4);v3.prot.addHandler(ExternalApplicationMediator.HIDE,v5);v1.addEventListener(ExternalApplicationMediator.CLOSE,v7);v6.addEventListener(ASJS.LoaderEvent.LOAD,v10);v6.addEventListener(ASJS.LoaderEvent.PROGRESS,v11);};function v4(){if(!v3.prot.view.contains(v1))
v3.prot.view.addChild(v1);v8();v3.prot.showView();};function v5(){if(v3.prot.view.contains(v1))
v3.prot.view.removeChild(v1);v9();};function v7(){v5();};function v8(){v9();v6.compressed=true;v6.load("external/application.dat?v=180604062251");};function v9(){v1.removeExternalApplication();v6.cancel();v6.unload();};function v10(e){v1.addExternalApplication(v6.content);v6.unload();};function v11(e){v1.title=((e.detail.loaded/e.detail.total)*100)+"%";}});msg(ExternalApplicationMediator,"SHOW");msg(ExternalApplicationMediator,"HIDE");msg(ExternalApplicationMediator,"CLOSE");var NotificationWindowView=c0("NotificationWindowView",AbstractView,function(v0,v1){var v10={};var v3=new ASJS.Scale9Grid();var v2=new ASJS.Sprite();var v4=new ASJS.Sprite();var v5=new ASJS.Button();var v7=new ASJS.Button();v0.new=function(){v1.new();v0.addClass("notification-window-view");v0.setCSS("position","fixed");v3.rect=new ASJS.Rectangle(13,60,4,7);v3.backgroundImage="images/window.png?v=180604062251";v0.addChild(v3);v2.addClass("title-label");v0.addChild(v2);v4.addClass("content-label");v0.addChild(v4);v5.addEventListener(ASJS.MouseEvent.CLICK,function(){v0.hideWindow();if(!emp(v10['okCallback']))v10['okCallback']();});v5.addClass("button");v7.addEventListener(ASJS.MouseEvent.CLICK,function(){v0.hideWindow();if(!emp(v10['cancelCallback']))v10['cancelCallback']();});v7.addClass("button");};v0.hideWindow=function(){v1.prot.animateTo(0,function(){v0.dispatchEvent(NotificationWindowMediator.HIDE);v2.html="";v4.html="";if(v6())v0.removeChild(v5);v5.label="";if(v8())v0.removeChild(v7);v7.label="";});};v0.showWindow=function(v9){v10=v9;v2.html=v10.title;v4.html=v10.content;if(v10['showOk']){v5.label=v10['okLabel'];if(!v6())v0.addChild(v5);}else if(v6())v0.removeChild(v5);if(v10['showCancel']){v7.label=v10['cancelLabel'];if(!v8())v0.addChild(v7);}else if(v8())v0.removeChild(v7);};v0.render=function(){v0.setSize(stage.stageWidth,stage.stageHeight);v3.setSize(Math.max(150,Math.min(stage.stageWidth,v10.width)),Math.max(150,Math.min(stage.stageHeight,v10.height)));v3.move((stage.stageWidth-v3.width)*0.5,Math.max(0,(stage.stageHeight-v3.height)*0.5));v3.render();v2.move(v3.x+25,v3.y+10);v2.width=v3.width-50;v4.move(v2.x,v2.y+v2.height+25);v4.setSize(v2.width,v3.height-v2.height-55-(v6()||v8()?60:0));if(v4.render)v4.render();v5.width=v3.width*0.5-20;if(v6()){v5.x=v3.x+(v8()?v3.width*0.5-10-v5.width:((v3.width-v5.width)*0.5));v5.y=v3.y+v3.height-v5.height-30;};v7.width=v5.width;if(v8()){v7.x=v3.x+(v6()?v3.width*0.5+10:((v3.width-v7.width)*0.5));v7.y=v3.y+v3.height-v7.height-30;}};function v6(){return v0.contains(v5);};function v8(){return v0.contains(v7);}});var NotificationWindowMediator=c0("NotificationWindowMediator",AbstractResizeMediator,function(v5,v6){var v9=Language.instance;var v3=[];var v8=false;var v12="";var v14="";var v4=new NotificationWindowView();v5.new=function(v1){v6.new(v1);v6.prot.addHandler(NotificationWindowMediator.SHOW,v7);v4.addEventListener(NotificationWindowMediator.HIDE,v2);v12=v9.getText('notification_ok_button');v14=v9.getText('notification_cancel_button');};function v7(v0){if(emp(v0))v0=new NotificationDataVo();if(!v0.okLabel)v0.okLabel=v12;if(!v0.cancelLabel)v0.cancelLabel=v14;v3.push(v0);if(!v8)v11();};function v2(){if(v3.length>0)v11();else v10();};function v10(){v6.prot.view.removeChild(v4);v8=false;};function v11(){var v13=v3[0];v3.shift();v8=true;v4.showWindow(v13);if(!v6.prot.view.contains(v4))v6.prot.view.addChild(v4);v6.prot.showView();}});msg(NotificationWindowMediator,"SHOW");msg(NotificationWindowMediator,"HIDE");var NotificationWindowDataVo=c0("NotificationWindowDataVo",ASJS.BaseClass,function(v0){v0.new=function(){v0.title="";v0.content="";v0.showOk=true;v0.showCancel=false;v0.okCallback=null;v0.cancelCallback=null;v0.okLabel=null;v0.cancelLabel=null;v0.width=500;v0.height=200;}});var Box=c0("Box",ASJS.Sprite,function(v0,v1){var v4=Language.instance;var v2=new ASJS.Label();var v3=new ASJS.Button();v0.new=function(){v1.new();v0.addClass("box");v2.text=v4.getText("new_asjs_base_site");v2.addClass("label");v0.addChild(v2);v3.label=v4.getText("show_notification_window");v3.addClass("button show-notification-button");v3.addEventListener(ASJS.MouseEvent.CLICK,v5);v0.addChild(v3);};get(v0,"label",function(){return v2;});function v5(){v0.dispatchEvent(ContentMediator.ON_SHOW_NOTIFICATION_WINDOW);}});var ContentView=c0("ContentView",AbstractView,function(v2,v4){var v6=Language.instance;var v3=ASJS.Mouse.instance;var v8=new ASJS.DisplayObject();var v0=new Box();var v19=new ASJS.Button();var v12=new ASJS.DisplayObject();var v1=false;var v9=new ASJS.BlurFilter();v2.new=function(){v4.new();v2.addClass("content-view");v2.addEventListener(ASJS.Stage.ADDED_TO_STAGE,v11);v2.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE,v13);v8.addClass("background");v8.setCSS("position","fixed");v8.alpha=0.5;v2.addChild(v8);v2.addChild(v0);v12.move(10,10);v2.addChild(v12);v12.addEventListener(ASJS.MouseEvent.CLICK,v16);v12.addEventListener(ASJS.MouseEvent.MOUSE_DOWN+" "+ASJS.MouseEvent.TOUCH_START,v18);v19.label=v6.getText("show_external_application_button_label");v19.addClass("button show-external-application-button");v19.addEventListener(ASJS.MouseEvent.CLICK,v20);v2.addChild(v19);requestAnimationFrame(v2.render);};v2.render=function(){v8.setSize(stage.stageWidth,stage.stageHeight);v19.x=v0.x=(stage.stageWidth-v0.width)*0.5;};function v11(){stage.addEventListener(ASJS.MouseEvent.MOUSE_UP+" "+ASJS.MouseEvent.TOUCH_END,v7);stage.addEventListener(ASJS.MouseEvent.MOUSE_LEAVE,v7);stage.addEventListener(ASJS.MouseEvent.MOUSE_MOVE+" "+ASJS.MouseEvent.TOUCH_MOVE,v14);v2.addEventListener(ASJS.MouseEvent.CLICK,v10);v17();};function v13(){stage.removeEventListener(ASJS.MouseEvent.MOUSE_UP+" "+ASJS.MouseEvent.TOUCH_END,v7);stage.removeEventListener(ASJS.MouseEvent.MOUSE_LEAVE,v7);stage.removeEventListener(ASJS.MouseEvent.MOUSE_MOVE+" "+ASJS.MouseEvent.TOUCH_MOVE,v14);v2.removeEventListener(ASJS.MouseEvent.CLICK,v10);};function v15(){if(!v12)return;v12.setSize(256,128);v12.removeClass("animation-fireworks");v12.addClass("animation-explode");};function v17(){if(!v12)return;v12.setSize(200,200);v12.removeClass("animation-explode");v12.addClass("animation-fireworks");};function v16(){if(v12.hasClass("animation-fireworks"))v15();else v17();};function v18(){v1=true;};function v7(){v1=false;};function v14(){v9.value=(Math.max(0,stage.stageHeight/(stage.stageHeight-v3.mouseY))/10);v8.filters=[v9];if(!v1)return;v12.move(v3.mouseX-v12.width*0.5,v3.mouseY-v12.height*0.5);};function v10(){var v5=v0.hitTest(new ASJS.Point(v3.mouseX,v3.mouseY));v0.label.text=v6.getText(v5?"hit_test_inside":"hit_test_outside");};function v20(){v2.dispatchEvent(ContentMediator.ON_SHOW_EXTERNAL_APPLICATION);}});var ContentMediator=c0("ContentMediator",AbstractResizeMediator,function(v2,v3){var v5=Language.instance;var v1=new ContentView();v2.new=function(v0){v3.new(v0);v3.prot.addHandler(ContentMediator.SHOW,v4);v1.addEventListener(ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,v6);v1.addEventListener(ContentMediator.ON_SHOW_EXTERNAL_APPLICATION,v7);};function v4(){v3.prot.showView();if(!v3.prot.view.contains(v1))v3.prot.view.addChild(v1);};function v6(){var v8=new NotificationWindowDataVo();v8.title=v5.getText("notification_title");v8.content=v5.getText("notification_content");v8.height=230;v2.sendNotification(NotificationWindowMediator.SHOW,v8);};function v7(){v2.sendNotification(ExternalApplicationMediator.SHOW);}});msg(ContentMediator,"SHOW");msg(ContentMediator,"ON_SHOW_EXTERNAL_APPLICATION");msg(ContentMediator,"ON_SHOW_NOTIFICATION_WINDOW");var ViewPrepCommand=c0("ViewPrepCommand",ASJS.AbstractCommand,function(v1){v1.execute=function(v0){new ContentMediator(v0);new ExternalApplicationMediator(v0);new NotificationWindowMediator(v0);v1.sendNotification(ContentMediator.SHOW);}});var StartupCommand=c0("StartupCommand",ASJS.AbstractCommand,function(v4){var v2;v4.execute=function(v1){v2=v1;v8();};function v8(){v6("config.dat",function(v5){Config.instance.data=v5;v10();});};function v10(){v6("language.dat",function(v5){Language.instance.data=v5;v11();});};function v11(){(new EnvironmentCommand()).execute();(new ViewPrepCommand()).execute(v2);};function v6(v0,v7){(new LoadJSONServiceCommand()).execute("data/"+v0).then(v7).catch(v9);};function v9(v3){throw new Error("JSON load error");}});var Application=c0("Application",ASJS.Sprite,function(v0,v1){v0.new=function(){v1.new();trc("<AS/JS> Application 3.1.0.180604062251");(new StartupCommand()).execute(v0);}});ASJS.start(Application);