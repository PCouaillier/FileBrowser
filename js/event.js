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
    } else if(e.key === "ArrowRight") {
      nextPage();
		} else if (e.key === "ArrowLeft" && index!==0) {
      prevPage();
    } else if(e.key === "Delete") {
			deleteElement();
		} else if(e.key === "Backspace") {
			window.location = document.getElementById('undo').href;
			e.preventDefault();
			e.stopPropagation();
		} else if (mainElement && (mainElement.getType() ==="video" || mainElement.getType() ==="audio")) {
      if (e.key === "ArrowDown") {
        volume = document.volume;
        volume-=0.2;
        if(volume>0) {
          document.volume = volume;
        } else {
          volume = 0;
          mute();
        }
        document.mainElement.getHtmlElement().volume = volume;
      } else if (e.key === "ArrowUp") {
        if(document.isMuted) {
          mute();
        }
        volume = document.volume;
        volume+=0.2;
        volume = (volume>1)? 1 : volume;
        document.volume = volume;
        document.mainElement.getHtmlElement().volume = volume;
      }
    }
	});
  window.addEventListener('resize', () => {
    if(!document.mainElement) return;
    applyRatio();
    var mainElement = document.mainElement;
    if(mainElement ===null || typeof mainElement==="undefined") return;
  });
})();

const ipc = require('electron').ipcRenderer;


ipc.on('selected-directory', function (event, path) {
  document.currentDirEntries = false;
  document.currentDirEntriesCleaned = false;
  openDir(`${path}`);
});

ipc.on('entry-cleaned', function (event, cleaned, folders) {
  document.currentDirEntries = cleaned;
  document.currentDirEntriesCleaned = true;
  document.folderManager.setFolders(folders);
  document.folderManager.hidden = true;
  if(document.forceElement) return delete document.forceElement;
  setCurrentPage(0);
  if(cleaned.length>0) {
    setCurrentElement();
    hideFolderManager();
  } else {
    showFolderManager();
  }
});

function hideFolderManager () {
  var me = document.mainElement;
  document.folderManager.htmlElement.classList.add('hidden');
  var meHtml = me.getHtmlElement();
  meHtml.classList.remove('hidden');
  document.folderManager.hidden = true;
  if(me.getType() ==="audio" || me.getType() ==="video")
    meHtml.play();
}

function showFolderManager() {
  var me = document.mainElement;
  document.folderManager.htmlElement.classList.remove('hidden');
  if(me.getType() ==="audio" || me.getType() ==="video")
    me.getHtmlElement().pause();
  me.getHtmlElement().classList.add('hidden');
  document.folderManager.render();
  document.folderManager.hidden = false;
}

document.getElementById('select_directory').addEventListener('click', function () {
  ipc.send('open-file-dialog');
});
document.getElementById('show_folders').addEventListener('click', function () {
  if(document.folderManager.hidden) {
    showFolderManager();
  } else {
    hideFolderManager();
  }
});

document.getElementById('select_parent_directory').addEventListener('click', function() {
  var spl = document.currentDir.replace('//', '/').split('/');
  var res ="";
  for(var i=0;i<spl.length-2;i++)
    res+= spl[i]+"/";
  res+= spl[i];
  if(res!=="")
    openDir(res);
});
