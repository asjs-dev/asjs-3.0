require("./asjs.Sprite.js");

helpers.createClass(ASJS, "Link", ASJS.Sprite, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "a");

  ASJS.Tag.attrProp(_scope, "href");
  ASJS.Tag.attrProp(_scope, "target");
  ASJS.Tag.attrProp(_scope, "download");
});
