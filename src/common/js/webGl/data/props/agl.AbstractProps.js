require("../../NameSpace.js");

AGL.AbstractProps = helpers.createPrototypeClass(
  Object,
  function AbstractProps() {
    this.updateId = AGL.CurrentTime;
  },
  function() {}
);
