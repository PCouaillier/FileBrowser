const ipc = require('electron').ipcRenderer;

ipc.on('selected-directory', function (event, path) {
  document.currentDirEntries = false;
  document.currentDirEntriesCleaned = false;
  openDir(`${path}`);
});

ipc.on('entry-cleaned', function (event, cleaned, folders) {
  document.lockedPaged = false;

  document.getElementById('show_folders').disabled= (folders.length===0 || cleaned.length===0);

  document.currentDirEntries = cleaned;
  document.currentDirEntriesCleaned = true;
  document.folderManager.setFolders(folders);
  document.folderManager.hidden = true;

  if(document.forceElement) return delete document.forceElement;

  setCurrentPage(0);

  if(cleaned.length>0) {
    setCurrentElement();
  } else {
    document.lockedPaged = true;
    var parent = document.mainElement.getHtmlElement().parentNode;
    parent.removeChild(document.mainElement.getHtmlElement());
    document.mainElement = new Element("");
    parent.appendChild(document.mainElement.getHtmlElement());
  }

  if(document.folderManager.hidden && folders.length>0)
    showFolderManager();
  else
    hideFolderManager();
});


// on load
(() => {
  "use strict";
  document.addEventListener('keydown', (e)=> {
		var index = parseInt(document.getElementById('page_index').getAttribute('data-page'));
    var volume;
    var mainElement = document.mainElement;
    var mainElementHtml;
    if(mainElement)
       mainElementHtml = document.mainElement.getHtmlElement();

    if(e.code === "Space" && mainElementHtml && (mainElement.getType() ==="video" || mainElement.getType() ==="audio") && mainElementHtml.readyState) {
      if(!mainElementHtml.paused)
        mainElementHtml.pause();
      else
        mainElementHtml.play();
		} else if (e.key === "ArrowDown" && mainElement && (mainElement.getType() ==="video" || mainElement.getType() ==="audio")) {
      volume = document.volume;
      volume-=0.1;
      if(volume>0) {
        document.volume = volume;
      } else {
        volume = 0;
        mute();
      }
      document.mainElement.getHtmlElement().volume = volume;
    } else if (e.key === "ArrowUp" && mainElement && (mainElement.getType() ==="video" || mainElement.getType() ==="audio")) {
      if(document.isMuted) {
        mute();
      }
      volume = document.volume;
      volume+=0.1;
      volume = (volume>1)? 1 : volume;
      document.volume = volume;
      document.mainElement.getHtmlElement().volume = volume;
    } else if(e.key === "Delete") {
      deleteElement();
    } else if(e.key === "Backspace") {
      window.location = document.getElementById('undo').href;
      e.preventDefault();
      e.stopPropagation();
    } else if (document.lockedPaged) {
    } else if (e.key === "ArrowRight" && !document.isLock) {
      nextPage();
    } else if (e.key === "ArrowLeft" && index!==0 && !document.isLock) {
      prevPage();
    }
	});
  window.addEventListener('resize', () => {
    if(!document.mainElement) return;
    applyRatio();
    var mainElement = document.mainElement;
    if(mainElement ===null || typeof mainElement==="undefined") return;
  });

  document.moveTargetManager = new MoveTargetManager(document.getElementById('actionList'));
})();


function hideFolderManager () {
  document.isLock = false;
  enableMoveAction();
  var me = document.mainElement;
  document.folderManager.htmlElement.classList.add('hidden');
  var meHtml = me.getHtmlElement();
  meHtml.classList.remove('hidden');
  document.folderManager.hidden = true;
  if(me.getType() ==="audio" || me.getType() ==="video")
    meHtml.play();
}

function showFolderManager() {
  document.isLock = true;
  toFooterMenue();
  disableMoveAction();
  var me = document.mainElement;
  document.folderManager.htmlElement.classList.remove('hidden');
  if(me.getType() ==="audio" || me.getType() ==="video")
    me.getHtmlElement().pause();
  me.getHtmlElement().classList.add('hidden');
  document.folderManager.render();
  document.folderManager.hidden = false;
  document.folderManager.htmlElement.focus();
}

function disableMoveAction() {
  window.ConstAllMoveAction.forEach((e)=> {
    e.disabled = true;
  });
  document.moveTargetManager.disable();
}

function enableMoveAction() {
  window.ConstAllMoveAction.forEach((e)=> {
    e.disabled = false;
  });
  document.moveTargetManager.enable();
}


document.getElementById('select_directory').addEventListener('click', function() {
  ipc.send('open-file-dialog');
});

document.getElementById('show_folders').addEventListener('click', function() {
  if(document.folderManager.hidden && document.folderManager.folders.length>0)
  {
    showFolderManager();
  } else if (document.currentDirEntries.length>0) {
    hideFolderManager();
  }
});

document.getElementById('select_parent_directory').addEventListener('click', function() {
  var spl = document.currentDir.replace(':/',':\\/').replace(/\\/g,'/').replace('://',':\\/').split('/');
  var res = "";
  for (var i=0;i<spl.length-2;i++)
    res += spl[i] + "/";
  res += spl[i];
  if (res !== "")
    openDir(res);
});

const moveTo = (path, folderName) => {
  var targetPath;
  if(!path)
    path = document.currentDir;
  if(folderName)
    targetPath = path+'/'+folderName;
  else
    targetPath = path;

  var elemPath = document.mainElement.path;

  var elemName = document.mainElement.name;

  fs.mkdir(targetPath, ()=> {
    fs.rename(elemPath, targetPath+'/'+elemName, (err)=> {
      if(err) {
        alert(JSON.stringify(err));
      }
    });
  });
  document.currentDirEntries.splice(document.currentDirEntries.indexOf(elemName), 1);
  if(document.currentDirEntries.length>0)
    setCurrentElement();
  else
    showFolderManager();
};

document.getElementById('delete_element').addEventListener('click', () => {
  moveTo(null,"_DELETE_");
});
