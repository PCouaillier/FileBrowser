const MoveTargetManager = (() => {
  "use strict";
  var MoveTargetManager = function MoveTargetManager(htmlElement) {
    this.autoRender = false;
    this.htmlElement = htmlElement;
    this.moveTargets = [];
  };

  MoveTargetManager.prototype.clean = function () {
    for(let i=0;i<this.moveTargets.length;i++) {
      if(this.moveTargets[i].htmlElement)
        this.htmlElement.removeChild(this.moveTargets[i].htmlElement);
    }
  };

  MoveTargetManager.prototype.add = function (name, path) {
    this.moveTargets.push(new MoveTarget(name, path, this.htmlElement));
    if (this.autoRender)
      this.render();
  };

  MoveTargetManager.prototype.render = function () {
    this.clean();
    for(let i=0;i<this.moveTargets.length;i++) {
      this.moveTargets[i].render();
    }
  };

  MoveTargetManager.prototype.disable = function () {
    this.moveTargets.forEach((e)=> {
      e.htmlElement.disabled = true;
    });
  };

  MoveTargetManager.prototype.enable = function () {
    this.moveTargets.forEach((e)=> {
      e.htmlElement.disabled = false;
    });
  };
  return  MoveTargetManager;
})();
