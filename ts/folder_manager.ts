class FolderManager {
  htmlElement: HTMLElement
  folders: Array<string>;
  ignorePointFolder: boolean;

  constructor() {
    this.htmlElement = null;
    this.folders = [];
    this.ignorePointFolder = true;
  }

  clear () {
    var htmlElement = this.htmlElement;
    while (htmlElement.firstChild) {
        htmlElement.removeChild(htmlElement.firstChild);
    }
  }

  render () {
    this.clear();
    var htmlElement = this.htmlElement;
    var folders = this.folders;
    var fname;
    for (var i = 0; i < folders.length; i++) {
      fname = folders[i];
      if (!(this.ignorePointFolder && fname.name[0]==='.'))
        htmlElement.appendChild(fname.render());
    }
  }

  setFolders (foldersPath) {
    var folders = [];
    var fname;
    for(var i=0;i<foldersPath.length;i++) {
      fname = foldersPath[i];
      folders.push(new Folder(EnvState.currentDir+"/"+fname, fname));
    }
    this.folders = folders;
  }
}

EnvState.folderManager = (()=> {
  var folderManager = new FolderManager();
  folderManager.htmlElement = document.getElementById('folders');
  return folderManager;
})();
