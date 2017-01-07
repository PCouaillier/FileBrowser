const FolderManager = (()=> {
  "use strict";

  var FolderManager = function FolderManager() {
    this.htmlElement = null;
    this.folders = [];
    this.ignorePointFolder = true;
  };

  FolderManager.prototype.clear = function () {
    var htmlElement = this.htmlElement;
    while (htmlElement.firstChild) {
        htmlElement.removeChild(htmlElement.firstChild);
    }
  };

  FolderManager.prototype.render = function () {
    this.clear();
    var htmlElement = this.htmlElement;
    var folders = this.folders;
    var fname;
    for (var i = 0; i < folders.length; i++) {
      fname = folders[i];
      if (!(this.ignorePointFolder && fname.name[0]==='.'))
        htmlElement.appendChild(fname.render());
    }
  };

  FolderManager.prototype.setFolders = function (foldersPath) {
    var folders = [];
    var fname;
    for(var i=0;i<foldersPath.length;i++) {
      fname = foldersPath[i];
      folders.push(new Folder(document.currentDir+"/"+fname, fname));
    }
    this.folders = folders;
  };
  return FolderManager;
})();

document.folderManager = (()=> {
  var folderManager = new FolderManager();
  folderManager.htmlElement = document.getElementById('folders');
  return folderManager;
})();
