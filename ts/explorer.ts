const IGNORE_EXT = ["7z", "php", "rar", "exe", "bat", "js", "htm", "html", "zip"];

function openDir (dir) {
  "use strict";
  dir = dir.replace(':/',':\\/').replace(/\\/g,'/').replace('://',':\\/');
  (document.getElementById('current_path') as HTMLButtonElement).innerHTML = dir;
  (document.getElementById('show_folders') as HTMLButtonElement).disabled=true;
  var body = document.body;
  if(!document.forceElement) {
    if(document.mainElement && document.mainElement.htmlElement)
      body.removeChild(document.mainElement.getHtmlElement());
    document.mainElement = new FolderElement("./loader.gif", 'loader');
    document.mainElement.getHtmlElement().classList.add('fullsize');
    body.appendChild(document.mainElement.getHtmlElement());
  }
  document.currentDirEntries = null;
  document.currentDir = dir;
  fs.readdir(dir, (err, res) => {
    document.currentDirEntries = res;
    ipc.send('clean-dir-entries', dir, res);
  });
}

function setCurrentElement() {
  "use strict";
  var files = document.currentDirEntries;
  if(!files || files.length ===0) {
    document.folderManager.render();
    return;
  }
  const fs = require('fs');
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
        elem = new FolderElement(document.currentDir+'/'+entry, entry);
        if(elem===null) return setCurrentPage(0);
        if(document.mainElement)
        document.body.removeChild(document.mainElement.getHtmlElement());
        document.mainElement = elem;
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
        if(document.isLeftMenueToggled && !window.setLeftMenueSize()) {
          window.toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(matchS, '')+"#{page:"+page+",url:"+me.path+",dir:"+document.currentDir+",name:"+me.name+"}");
      } else {
        fs.stat(document.currentDir+'/'+files[i], testFile);
      }
    }
  }
  if(!document.currentDirEntriesCleaned) {
    fs.stat(document.currentDir+'/'+files[0], testFile);
  } else {
    for (i = 0; i < document.currentDirEntries.length; i++) {
      if(i===page) {
        entry = document.currentDirEntries[i];
        elem = new FolderElement(document.currentDir+'/'+entry, entry);
        if(document.mainElement)
        document.body.removeChild(document.mainElement.getHtmlElement());
        document.mainElement = elem;
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
        if(document.isLeftMenueToggled && !window.setLeftMenueSize()) {
          window.toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(matchS, '')+"#{page:"+page+",url:"+me.path+",dir:"+document.currentDir+",name:"+me.name+"}");
      }
    }
  }
  if(elem===null) return setCurrentPage(0);
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
      document.mainElement = mElem;
      var elem = mElem.getHtmlElement();
      elem.classList.add('fullsize');
      document.body.appendChild(elem);
      applyRatio();
      if(document.isLeftMenueToggled && !window.setLeftMenueSize()) {
        window.toFooterMenue();
      }
      document.forceElement = true;
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
