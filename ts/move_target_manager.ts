class MoveTargetManager {
  autoRender: boolean;
  htmlElement: HTMLElement;
  moveTargets : Array<MoveTarget>;

  constructor(htmlElement: HTMLElement) {
    this.autoRender = false;
    this.htmlElement = htmlElement;
    this.moveTargets = [];
  }

  clean() {
    for(let i=0;i<this.moveTargets.length;i++) {
      if(this.moveTargets[i].htmlElement)
        this.htmlElement.removeChild(this.moveTargets[i].htmlElement);
    }
  }

  add(name, path) {
    this.moveTargets.push(new MoveTarget(name, path, this.htmlElement));
    if (this.autoRender)
      this.render();
  }

  render() {
    this.clean();
    for(let i=0;i<this.moveTargets.length;i++) {
      this.moveTargets[i].render();
    }
  }

  disable() {
    this.moveTargets.forEach((e)=> {
      e.htmlButtonElement.disabled = true;
    });
  }

  enable() {
    this.moveTargets.forEach((e)=> {
      e.htmlButtonElement.disabled = false;
    });
  }
}
