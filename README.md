# asjs-3.0
&lt;AS/JS> is a JavaScript framework, for ActionScript3 like display list handling

Try it: https://plnkr.co/edit/T8Ujtc?p=preview

Examples:
- http://budapestmakery.hu/videos/makery.html#lang=en

## UPDATE 06.10.19
The class creation process has been changed. It requires the NameSpace property at the first parameter. The NameSpace value can be "this" or some variable. Examples below.

Features:
* AS3 like display list handling
* Virtual-DOM
* OOP based development
* MVC
* Filters ( like Blur, Grayscale, etc on display objects )
* Use canvas like Bitmap and BitmapData
* Bitmap Filters
* Sprite Sheet Animations ( use [png|jpg|svg|...] images to animations )
* Video and audio support
* Easily extendable
* Event orientation
* Easy way to port your as3 application to HTML5
* Responsive
* and many other features...

Every feature is compressed into src/common/js/asjs/asjs.3.0.min.js ( from src/common/js/asjs/ ).

Good for single page applications, browser games and other apps.

## HOW TO

* Create your index html ( include asjs.3.0.min.js, asjs.3.0.min.css )

```html
<!DOCTYPE html>
<html>
    <head>
        <link href="src/common/style/asjs/asjs.3.0.min.css" rel="stylesheet" type="text/css">
        <script src="src/common/js/asjs/asjs.3.0.min.js" type="text/javascript"></script>
    </head>
    <body>
    </body>
</html>
```

* Add your script and init asjs with your base app class

```javascript
var SampleApp = {};
createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application");
  }
});

ASJS.start(SampleApp.Application);
```

* Create and add a simple ASJS.Sprite to ASJS.Stage

```javascript
var SampleApp = {};
createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application");

    var s = new ASJS.Sprite();
    stage.addChild(s);
  }
});

ASJS.start(SampleApp.Application);
```

* Add style to your ASJS.Sprite

```javascript
var SampleApp = {};
createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application");

    var s = new ASJS.Sprite();
        s.setSize( 100, 100 );
        s.move( 50, 50 );
        s.setCSS( "background-color", "#000000" );
    stage.addChild(s);
  }
});

ASJS.start(SampleApp.Application);
```

* Add mouse click event listener to your ASJS.Sprite

```javascript
var SampleApp = {};
createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application");

    var s = new ASJS.Sprite();
        s.setSize( 100, 100 );
        s.move( 50, 50 );
        s.setCSS( "background-color", "#000000" );
        s.addEventListener( ASJS.MouseEvent.CLICK, function( event ) {
          trace( "click :)" );
        });
    stage.addChild(s);
  }
});

ASJS.start(SampleApp.Application);
```

* You can also add two or more ASJS.Sprite to ASJS.Stage

```javascript
var SampleApp = {};
createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application");

    var i;
    var s;
    for ( i = 0; i < 10; i++ ) {
      s = new ASJS.Sprite();
      s.setSize( 40, 40 );
      s.move( 50 + i * 50 , 50 );
      s.setCSS( "background-color", "#336699" );
      stage.addChild( s );
    }
    stage.addEventListener( ASJS.MouseEvent.CLICK, function( event ) {
      stage.getChildByDOMObject( event.target ).setCSS( "background-color", "#00FF00" );
    });
  }
});

ASJS.start(SampleApp.Application);
```

* Create your own class extended from other class ( Particle from ASJS.BaseClass, Application from ASJS.Sprite )

```javascript
var SampleApp = {};
createUtility(SampleApp, "Utils");
rof(SampleApp.Utils, "getRand", function(v) {
  return Math.floor(Math.random() * v);
});

createClass(SampleApp, "Particle", ASJS.BaseClass, function(_scope) {
  _scope.new = function() {
    _scope.color = ASJS.Color.create(
      SampleApp.Utils.getRand(255),
      SampleApp.Utils.getRand(255),
      SampleApp.Utils.getRand(255),
      SampleApp.Utils.getRand(255) / 255
    );

    _scope.size  = SampleApp.Utils.getRand(20);
    _scope.x     = (stage.stageWidth - _scope.size) * 0.5;
    _scope.y     = (stage.stageHeight - _scope.size) * 0.5;
    _scope.angle = SampleApp.Utils.getRand(360);
  }

  _scope.render = function(s) {
    moveParticle(s);
    testWallCollision();
  }

  function moveParticle(s) {
    var speed = s * _scope.size;
    var maxX  = stage.stageWidth - _scope.size;
    var maxY  = stage.stageHeight - _scope.size;
    var angle = _scope.angle * ASJS.GeomUtils.THETA;
    _scope.x = between(0, maxX, _scope.x + Math.sin(angle) * speed);
    _scope.y = between(0, maxY, _scope.y - Math.cos(angle) * speed);
  }

  function testWallCollision() {
    if (_scope.x === 0 || _scope.x + _scope.size === stage.stageWidth)
      _scope.angle = -_scope.angle;
    if (_scope.y === 0 || _scope.y + _scope.size === stage.stageHeight)
      _scope.angle = 180 - _scope.angle;
  }
});

createClass(SampleApp, "Application", ASJS.Sprite, function(_scope, _super) {
  var priv = {};
  cnst(priv, "PARTICLES_NUM", 50);
  cnst(priv, "FPS", 60);

  var _mouse     = ASJS.Mouse.instance;
  var _cycler    = ASJS.Cycler.instance;
  var _bitmap    = new ASJS.Bitmap();
  var _speed     = 1;
  var _particles = [];
  var _time;

  _scope.new = function() {
    _super.new();
    trace("Say hello to <AS/JS>!");

    _time = Date.now();
    _scope.addChild(_bitmap);

    var i = -1;
    var l = priv.PARTICLES_NUM;
    while (++i < l) _particles.push(new SampleApp.Particle());

    _cycler.fps = priv.FPS;
    _cycler.addCallback(render);

    stage.addEventListener(ASJS.MouseEvent.MOUSE_MOVE, onMouseMove);
    stage.addEventListener(ASJS.Stage.RESIZE, onStageResize);
    onStageResize();

    stage.addEventListener(ASJS.MouseEvent.CLICK, function() {
      _particles.shift();
    });
  }

  function render() {
    var now = Date.now();
    var s = ((now - _time) / 100) * _speed;
    _time = now;

    _bitmap.beginColorFill("rgba(0, 0, 0, 0.5)");
    _bitmap.drawRect(0, 0, _bitmap.bitmapWidth, _bitmap.bitmapHeight);
    var i = -1;
    var l = _particles.length;
    while (++i < l) {
      var particle = _particles[i];
      particle.render(s);
      _bitmap.beginColorFill(particle.color);
      _bitmap.drawCircle(particle.x, particle.y, particle.size);
      _bitmap.endFill();
    }
  }

  function onStageResize() {
    _bitmap.setSize(stage.stageWidth, stage.stageHeight);
    _bitmap.setBitmapSize(stage.stageWidth, stage.stageHeight);
  }

  function onMouseMove(e) {
    _speed = (_mouse.mouseY - (stage.stageHeight * 0.5)) / 50;
  }

});

ASJS.start(SampleApp.Application);
```
