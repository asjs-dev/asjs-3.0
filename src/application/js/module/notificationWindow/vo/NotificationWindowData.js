createUtility(NS, "NotificationWindowData");
rof(NS.NotificationWindowData, "create", function() {
  return {
    "title"          : "",
    "content"        : "",
    "showOk"         : true,
    "showCancel"     : false,
    "okCallback"     : null,
    "cancelCallback" : null,
    "okLabel"        : null,
    "cancelLabel"    : null,
    "width"          : 500,
    "height"         : 200
  };
});
