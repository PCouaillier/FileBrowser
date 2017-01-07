function openDir (dir, callback) {
  document.currentDir = dir;
  const fs = require('fs');
  if (document.currentDirEntries) {
    setCurrentElement(callback);
  } else {
    fs.readdir(dir, (err, res) => {
      document.currentDirEntries = res;
      ipc.send('clean-dir-entries', dir, res);
      setCurrentElement(callback);
    });
  }
}

const IGNORE_EXT = ["7z", "php", "rar", "exe", "bat", "js", "htm", "html", "zip"];

function setCurrentElement(callback) {
  "use strict";
  const fs = require('fs');
  var files = document.currentDirEntries;
  if(!files) return;
  var page = getCurrentPage();
  var elem = null;
  var entry;
  var ext;
  var cIndex = 0;
  if(callback) {
    callback();
    return;
  }
  var i = 0;
  var arrayIndex;
  function testFile(err, file) {
    if(file.isFile()) {
      var file_name = files[i];
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


(()=>{
  var match = document.URL.match(/\#\{page:([0-9]+),url:(.*),dir:(.*)\}/);
  var argv= require('electron').remote.process.argv;

  if(match) {
    setCurrentPage(parseInt(match[1]));
    openDir(match[3], ()=> {
      elem = new Element(match[2]);
      document.mainElement = elem;
      elem = elem.getHtmlElement();
      elem.classList.add('fullsize');
      document.getElementsByTagName('body')[0].appendChild(elem);
      applyRatio();
      if(!setLeftMenueSize()) {
        toFooterMenue();
      }
    });
  } else if(argv.length==2) {
    openDir(argv[1]);
  } else {
    setCurrentPage();
  }
})();
