require("../../NameSpace.js");

AGL.AbstractProps = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function AbstractProps() {
    helpers.BasePrototypeClass.call(this);
    this.updateId = 0;
  },
  function() {}
);
