const ipc = require('electron').ipcRenderer;

ipc.on('selected-directory', (event, path) => {
  EnvState.currentDirEntries = undefined;
  EnvState.currentDirEntriesCleaned = false;
  openDir(`${path}`);
});

ipc.on('select_directory_selected', (_, path) => {
  document.getElementById(EscapeMenu.MOVE_TO_PATH_DISPLAY_ID).innerHTML = path;
  var input = document.getElementById(EscapeMenu.MOVE_TO_NAME) as HTMLInputElement;
  if (input.value.trim() === '') {
    var p = path.toString().split('/');
    if (p.length===1) {
      p = path.toString().split('\\');
    }
    input.value = p[p.length-1];
  }
})

ipc.on('entry-cleaned', function (event, cleaned, folders) {
  EnvState.lockedPaged = false;

  (document.getElementById('show_folders') as HTMLButtonElement).disabled = (folders.length===0 || cleaned.length===0);

  EnvState.currentDirEntries = cleaned;
  EnvState.currentDirEntriesCleaned = true;
  EnvState.folderManager.setFolders(folders);
  EnvState.folderManager.htmlElement.hidden = true;

  if(EnvState.forceElement) return delete EnvState.forceElement;

  setCurrentPage(0);

  if(cleaned.length>0) {
    setCurrentElement();
  } else {
    EnvState.lockedPaged = true;
    var parent = EnvState.mainElement.getHtmlElement().parentNode;
    parent.removeChild(EnvState.mainElement.getHtmlElement());
    EnvState.mainElement = new FolderElement("","");
    parent.appendChild(EnvState.mainElement.getHtmlElement());
  }

  if(EnvState.folderManager.htmlElement.hidden && folders.length>0)
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
    var mainElement = EnvState.mainElement;
    var mainElementHtml;

    if(mainElement)
       mainElementHtml = EnvState.mainElement.getHtmlElement();

    if (e.code === 'Escape')
    {
      if (!EnvState.fullSreen) {
        var a = document.getElementById('escape-menue');
        a.hidden = !a.hidden;
      } else {
        EnvState.fullSreen = false;
      }
    } else if (e.code === "Space" && mainElementHtml && (mainElement.getType() ==="video" || mainElement.getType() ==="audio") && mainElementHtml.readyState) {
      if(!mainElementHtml.paused)
        mainElementHtml.pause();
      else
        mainElementHtml.play();
		} else if (e.key === "ArrowDown" && mainElement && (mainElement.getType() ==="video" || mainElement.getType() ==="audio")) {
      volume = EnvState.volume;
      volume-=0.1;
      if(volume>0) {
        EnvState.volume = volume;
      } else {
        volume = 0;
        mute();
      }
      EnvState.mainElement.getHtmlElement().volume = volume;
    } else if (e.key === "ArrowUp" && mainElement && (mainElement.getType() ==="video" || mainElement.getType() ==="audio")) {
      if(EnvState.isMuted) {
        mute();
      }
      volume = EnvState.volume;
      volume+=0.1;
      volume = (volume>1)? 1 : volume;
      EnvState.volume = volume;
      EnvState.mainElement.getHtmlElement().volume = volume;
    } else if(e.key === 'Delete') {
      deleteElement();
    } else if (e.key === 'Backspace') {
      window.location.assign((document.getElementById('undo') as HTMLAnchorElement).href);
      e.preventDefault();
      e.stopPropagation();
    } else if(e.key === 'f' && EnvState.mainElement && EnvState.mainElement.htmlElement && EnvState.mainElement.htmlElement.webkitRequestFullscreen) {
      EnvState.mainElement.htmlElement.webkitRequestFullscreen();
      EnvState.fullSreen = true;
    } else if (EnvState.lockedPaged) {
    } else if (e.key === "ArrowRight" && !EnvState.isLock) {
      nextPage();
    } else if (e.key === "ArrowLeft" && index!==0 && !EnvState.isLock) {
      prevPage();
    }
	});
  window.addEventListener('resize', () => {
    if(!EnvState.mainElement) return;
    applyRatio();
    var mainElement = EnvState.mainElement;
    if(mainElement ===null || typeof mainElement==="undefined") return;
  });

  EnvState.moveTargetManager = new MoveTargetManager(document.getElementById('actionList'));
})();


function hideFolderManager () {
  EnvState.isLock = false;
  enableMoveAction();
  var me = EnvState.mainElement;
  EnvState.folderManager.htmlElement.hidden = true;
  var meHtml = me.getHtmlElement();
  meHtml.hidden = false;
  if(me.getType() ==="audio" || me.getType() ==="video")
    meHtml.play();
}

function showFolderManager() {
  EnvState.isLock = true;
  Menu.toFooterMenue();
  disableMoveAction();
  var folderManager = EnvState.folderManager;
  folderManager.htmlElement.hidden = false;

  var me = EnvState.mainElement;
  if(me.getType() ==="audio" || me.getType() ==="video")
    me.getHtmlElement().pause();
  me.getHtmlElement().hidden = true;
  folderManager.render();
  folderManager.htmlElement.hidden = false;
  folderManager.htmlElement.focus();
}

function disableMoveAction() {
  Config.ConstAllMoveAction.forEach((e)=> {
    e.disabled = true;
  });
  EnvState.moveTargetManager.disable();
}

function enableMoveAction() {
  Config.ConstAllMoveAction.forEach((e)=> {
    e.disabled = false;
  });
  EnvState.moveTargetManager.enable();
}


document.getElementById('select_directory').addEventListener('click', function() {
  ipc.send('open-file-dialog');
});

document.getElementById('show_folders').addEventListener('click', function() {
  if(EnvState.folderManager.htmlElement.hidden && EnvState.folderManager.folders.length>0)
  {
    showFolderManager();
  } else if (EnvState.currentDirEntries.length>0) {
    hideFolderManager();
  }
});

document.getElementById('select_parent_directory').addEventListener('click', function() {
  var spl = EnvState.currentDir.replace(':/',':\\/').replace(/\\/g,'/').replace('://',':\\/').split('/');
  var res = "";
  for (var i=0;i<spl.length-2;i++)
    res += spl[i] + "/";
  res += spl[i];
  if (res !== "")
    openDir(res);
});

const moveFileTo = (toPath, isAbsolutePath = false) => {
  var targetPath;

  if(isAbsolutePath)
    targetPath = toPath;
  else
    targetPath = EnvState.currentDir+'/'+toPath;

  var elemPath = EnvState.mainElement.path;

  var elemName = EnvState.mainElement.name;

  fs.mkdir(targetPath, ()=> {
    fs.rename(elemPath, targetPath+'/'+elemName, (err)=> {
      if(err) {
        alert(JSON.stringify(err));
      }
    });
  });

  EnvState.currentDirEntries.splice(EnvState.currentDirEntries.indexOf(elemName), 1);
  if(EnvState.currentDirEntries.length>0)
    setCurrentElement();
  else
    showFolderManager();
};

document.getElementById('delete_element').addEventListener('click', () => {
  moveFileTo("_DELETE_");
});
