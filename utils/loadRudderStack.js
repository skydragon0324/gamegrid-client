export const LoadRudderStack = () => {
  window.rudderanalytics = [];
  var methods = [
    "load",
    "page",
    "track",
    "identify",
    "alias",
    "group",
    "ready",
    "reset",
    "getAnonymousId",
    "setAnonymousId",
    "getUserId",
    "getUserTraits",
    "getGroupId",
    "getGroupTraits",
    "startSession",
    "endSession",
    "getSessionId",
  ];
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    window.rudderanalytics[method] = (function (methodName) {
      return function () {
        window.rudderanalytics.push(
          [methodName].concat(Array.prototype.slice.call(arguments))
        );
      };
    })(method);
  }
};
