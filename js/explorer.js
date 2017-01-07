const IGNORE_EXT = ["7z", "php", "rar", "exe", "bat", "js", "htm", "html", "zip"];

function openDir (dir, callback) {
  "use strict";
  var body = document.getElementsByTagName('body')[0];
  if(!document.forceElement) {
    if(document.mainElement && document.mainElement.getHtmlElement())
      body.removeChild(document.mainElement.getHtmlElement());
    document.mainElement = new Element("./loader.gif");
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
        elem = new Element(document.currentDir+'/'+entry);
        if(elem===null) return setCurrentPage(0);
        if(document.mainElement)
        document.getElementsByTagName('body')[0].removeChild(document.mainElement.getHtmlElement());
        document.mainElement = elem;
        var me = elem;
        elem = elem.getHtmlElement();
        elem.classList.add('fullsize');
        document.getElementsByTagName('body')[0].appendChild(elem);
        var match =document.URL.match(/\#{.*\}/);
        if(match) {
          match = match[0];
        } else {
          match = "";
        }
        applyRatio();
        if(!setLeftMenueSize()) {
          toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(match, '')+"#{page:"+page+",url:"+me.path+",dir:"+document.currentDir+"}");
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
        elem = new Element(document.currentDir+'/'+entry);
        if(document.mainElement)
        document.getElementsByTagName('body')[0].removeChild(document.mainElement.getHtmlElement());
        document.mainElement = elem;
        var me = elem;
        elem = elem.getHtmlElement();
        elem.classList.add('fullsize');
        document.getElementsByTagName('body')[0].appendChild(elem);
        var match =document.URL.match(/\#{.*\}/);
        if(match) {
          match = match[0];
        } else {
          match = "";
        }
        applyRatio();
        if(!setLeftMenueSize()) {
          toFooterMenue();
        }
        history.replaceState({page: getCurrentPage(), path: elem.path}, "Page: "+page, document.URL.replace(match, '')+"#{page:"+page+",url:"+me.path+",dir:"+document.currentDir+"}");
      }
    }
  }
  if(elem===null) return setCurrentPage(0);
}

function getCurrentPage() {
  return parseInt(document.getElementById('page_index').getAttribute('data-page'));
}

function setCurrentPage(page) {
  "use strict";
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
  var match = document.URL.match(/\#\{page:([0-9]+),url:(.*),dir:(.*)\}/);
  var argv = require('electron').remote.process.argv;

  if(match) {
    var elem = new Element(match[2]);
    document.mainElement = elem;
    elem = elem.getHtmlElement();
    elem.classList.add('fullsize');
    document.getElementsByTagName('body')[0].appendChild(elem);
    applyRatio();
    if(!setLeftMenueSize()) {
      toFooterMenue();
    }
    document.forceElement = true;
    var pi = document.getElementById('page_index');
    pi.setAttribute('data-page', match[1]);
    pi.innerHTML = "Page : "+(parseInt(match[1])+1);
    openDir(match[3]);
  } else if(argv.length==2) {
    openDir(argv[1]);
  } else {
    setCurrentPage();
  }
})();
