(() => {
  "use strict";
  document.addEventListener('keydown', (e)=> {
		var index = parseInt(document.getElementById('page_index').getAttribute('data-page'));
    var volume;

		if(e.key === "ArrowRight") {
      nextPage();
		} else if (e.key === "ArrowLeft" && index!==0) {
      prevPage();
    } else if(e.key === "Delete") {
			deleteElement();
		} else if(e.key === "Backspace") {
			window.location = document.getElementById('undo').href;
			e.preventDefault();
			e.stopPropagation();
		} else if (document.mainElement && (document.mainElement.getType() ==="video" || document.mainElement.getType() ==="audio")) {
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

const selectDirBtn = document.getElementById('select_directory');

ipc.on('selected-directory', function (event, path) {
  document.currentDirEntries = false;
  document.currentDirEntriesCleaned = false;
  openDir(`${path}`);
});

ipc.on('entry-cleaned', function (event, cleaned) {
  document.currentDirEntries = cleaned;
  document.currentDirEntriesCleaned = true;
});

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog');
});
