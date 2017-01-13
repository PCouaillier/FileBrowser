const MoveTarget = (() => {
  "use strict";
  var MoveTarget = function MoveTarget(name, path, parent) {
    this.name = name;
    this.path = path;
    this.parent = parent;
    this.htmlElement = null;
  };

  MoveTarget.prototype.generateHTMLElement = function () {
    var li = document.createElement('li');
    var e = document.createElement('button');
    e.classList.add('move_target');
    e.innerHTML = this.name;
    e.setAttribute('data-path', this.path);
    li.appendChild(e);
    e.addEventListener('click', function() {
      moveTo(this.getAttribute('data-path'));
    });
    this.htmlElement = li;
  };

  MoveTarget.prototype.getGeneratedHTMLElement = function () {
    if(!this.htmlElement) {
      this.generateHTMLElement();
    }
    return this.htmlElement;
  };

  MoveTarget.prototype.render = function () {
    this.parent.appendChild(this.getGeneratedHTMLElement());
    return this.htmlElement;
  };

  MoveTarget.prototype.bindEvent = function () {
    this.getGeneratedHTMLElement().addEventListener('click', this.event);
  };

  return MoveTarget;
})();
