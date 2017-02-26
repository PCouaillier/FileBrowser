class MoveTarget {
  name: string;
  path: string;
  parent: HTMLElement;
  htmlElement: HTMLLIElement;
  htmlButtonElement: HTMLButtonElement;
  event: (MouseEvent)=>void;

  constructor(name, path, parent) {
    this.name = name;
    this.path = path;
    this.parent = parent;
    this.htmlElement = null;
  };

  generateHTMLElement () {
    var li = document.createElement('li');
    var e = document.createElement('button');
    e.classList.add('move_target');
    e.innerHTML = this.name;
    e.setAttribute('data-path', this.path);
    this.htmlButtonElement = e;
    li.appendChild(e);
    e.addEventListener('click', function() {
      moveFileTo(this.getAttribute('data-path'), true);
    });
    this.htmlElement = li;
  };

  getGeneratedHTMLElement () {
    if(!this.htmlElement) {
      this.generateHTMLElement();
    }
    return this.htmlElement;
  };

  render () {
    this.parent.appendChild(this.getGeneratedHTMLElement());
    return this.htmlElement;
  };

  bindEvent () {
    this.getGeneratedHTMLElement().addEventListener('click', this.event);
  };
}
