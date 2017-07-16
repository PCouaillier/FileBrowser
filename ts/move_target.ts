class MoveTarget {
  name: string;
  path: string;
  parent: HTMLElement;
  htmlElement: HTMLElement;
  htmlButtonElement: HTMLButtonElement;
  event: (MouseEvent)=>void;

  constructor(name, path, parent) {
    this.name = name;
    this.path = path;
    this.parent = parent;
    this.htmlElement = null;
  }

  generateHTMLElement (container: HTMLElement) {
    var e = document.createElement('button');
    e.classList.add('move_target');
    e.innerHTML = this.name;
    e.setAttribute('data-path', this.path);
    this.htmlButtonElement = e;
    container.appendChild(e);
    e.addEventListener('click', function() {
      moveFileTo(this.getAttribute('data-path'), true);
    });
    e = document.createElement('button');
    e.innerHTML = 'X';
    e.addEventListener('click', () => {
      this.htmlElement.remove();
    });
    container.appendChild(e);
    this.htmlElement = container;
  }

  getGeneratedHTMLElement () {
    if(!this.htmlElement) {
      this.generateHTMLElement(document.createElement('li'));
    }
    return this.htmlElement;
  }

  render () {
    this.parent.appendChild(this.getGeneratedHTMLElement());
    return this.htmlElement;
  }

  bindEvent () {
    this.getGeneratedHTMLElement().addEventListener('click', this.event);
  }
}
