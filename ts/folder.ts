const DEFAULT_FOLDER_IMAGE = "./folder.png";

class Folder {
  path: string;
  name: string;
  image: string;

  constructor(path: string, name: string, image?: string) {
    this.path = path;
    if(name) {
      this.name = name;
    } else {
      var tmp = path.split('/');
      var fullName = tmp[tmp.length-1];
      this.name = fullName.split('.')[0];
    }
    this.image = (image)? image : DEFAULT_FOLDER_IMAGE;
  }

  render () {
    var e = document.createElement('div');
    e.classList.add('folder');
    e.innerHTML = this.name;
    e.setAttribute('data-path', this.path);
    e.style.backgroundImage = "url("+this.image+")";
    e.addEventListener('click', function(event) {
      hideFolderManager();
      openDir(this.getAttribute('data-path'));
    });
    return e;
  }
}
