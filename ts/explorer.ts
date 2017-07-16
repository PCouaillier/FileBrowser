const IGNORE_EXT = ["7z", "php", "rar", "exe", "bat", "js", "htm", "html", "zip"];

function openDir (dir) {
  "use strict";
  dir = dir.replace(':/',':\\/').replace(/\\/g,'/').replace('://',':\\/');
  (document.getElementById('current_path') as HTMLButtonElement).innerHTML = dir;
  (document.getElementById('show_folders') as HTMLButtonElement).disabled=true;
  var body = document.body;
  if(!EnvState.forceElement) {
    if(EnvState.mainElement && EnvState.mainElement.htmlElement)
      body.removeChild(EnvState.mainElement.getHtmlElement());
    EnvState.mainElement = new FolderElement("./loader.gif", 'loader');
    EnvState.mainElement.getHtmlElement().classList.add('fullsize');
    EnvState.folderManager.htmlElement.hidden = false;
    body.appendChild(EnvState.mainElement.getHtmlElement());
  }
  EnvState.currentDirEntries = null;
  EnvState.currentDir = dir;
  fs.readdir(dir, (err, res) => {
    EnvState.currentDirEntries = res;
    ipc.send('clean-dir-entries', dir, res);
  });
}

function setCurrentElement() {
  "use strict";
  var files = EnvState.currentDirEntries;
  if(!files || files.length ===0) {
    EnvState.folderManager.render();
    return;
  }
  var page = getCurrentPage();
  var elem = null;
  var file_name;
  var entry;
  var ext;
  var cIndex = 0;
  var i = 0;
  var arrayIndex;
  function testFile(err, file) {
    if(file.isFile()) {
      ext = file_name.split('.');
      ext = ext[ext.length-1];
      if (file[0]!=='.' && file[0]!=='$' && !IGNORE_EXT.includes(ext)) {
        cIndex++;
      }
    }
    i++;
    if(i<files.length) {
      if (cIndex === page+1) {
        elem = new FolderElement(EnvState.currentDir+'/'+entry, entry);
        if(elem===null) return setCurrentPage(0);
        if(EnvState.mainElement)
        document.body.removeChild(EnvState.mainElement.getHtmlElement());
        EnvState.mainElement = elem;
        var me = elem;
        elem = elem.getHtmlElement();
        elem.classList.add('fullsize');
        document.body.appendChild(elem);
        var match =document.URL.match(/\#{.*\}/);
        var matchS;
        if(match) {
          matchS = match[0];
        } else {
          matchS = "";
        }
        applyRatio();
        if(EnvState.isLeftMenueToggled && !Menu.setLeftMenueSize()) {
          Menu.toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(matchS, '')+"#{page:"+page+",url:"+me.path+",dir:"+EnvState.currentDir+",name:"+me.name+"}");
      } else {
        fs.stat(EnvState.currentDir+'/'+files[i], testFile);
      }
    }
  }
  if(!EnvState.currentDirEntriesCleaned) {
    fs.stat(EnvState.currentDir+'/'+files[0], testFile);
  } else {
    for (i = 0; i < EnvState.currentDirEntries.length; i++) {
      if(i===page) {
        entry = EnvState.currentDirEntries[i];
        elem = new FolderElement(EnvState.currentDir+'/'+entry, entry);
        if(EnvState.mainElement)
        document.body.removeChild(EnvState.mainElement.getHtmlElement());
        EnvState.mainElement = elem;
        var me = elem;
        elem = elem.getHtmlElement();
        elem.classList.add('fullsize');
        document.body.appendChild(elem);
        var match =document.URL.match(/\#{.*\}/);
        var matchS;
        if(match) {
          matchS = match[0];
        } else {
          matchS = "";
        }
        applyRatio();
        if(EnvState.isLeftMenueToggled && !Menu.setLeftMenueSize()) {
          Menu.toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(matchS, '')+"#{page:"+page+",url:"+me.path+",dir:"+EnvState.currentDir+",name:"+me.name+"}");
      }
    }
  }
  if(elem===null)
    return setCurrentPage(0);
  else
    return null;
}

function getCurrentPage() {
  return parseInt(document.getElementById('page_index').getAttribute('data-page'));
}

function setCurrentPage(page?) {
  if(typeof page ==="undefined") {
    page = getCurrentPage();
  }
  var pi = document.getElementById('page_index');
  pi.setAttribute('data-page', page);
  pi.innerHTML = "Page : "+(page+1);
  setCurrentElement();
}

function nextPage() {
  setCurrentPage(getCurrentPage()+1);
}

function prevPage() {
  setCurrentPage(getCurrentPage()-1);
}

function deleteElement() {
  getCurrentPage();
  refreshElement();
}

function refreshElement() {
  getCurrentPage();
}

function showFolders() {

}

(() => {
  "use strict";
  var match = document.URL.match(/\#\{page:([0-9]+),url:(.*),dir:(.*),name:(.*)\}/);
  var argv = require('electron').remote.process.argv;

  if(match) {
    if(match[2]!=="null") {
      var mElem = new FolderElement(match[2], match[4]);
      EnvState.mainElement = mElem;
      var elem = mElem.getHtmlElement();
      elem.classList.add('fullsize');
      document.body.appendChild(elem);
      applyRatio();
      if(EnvState.isLeftMenueToggled && !Menu.setLeftMenueSize()) {
        Menu.toFooterMenue();
      }
      EnvState.forceElement = true;
    }
    var pi = document.getElementById('page_index');
    pi.setAttribute('data-page', match[1]);
    pi.innerHTML = "Page : "+(parseInt(match[1])+1);
    openDir(match[3]);
  } else if(argv.length==2) {
    openDir(fs.realpathSync(argv[1]));
  } else {
    setCurrentPage();
  }
})();
