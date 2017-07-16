namespace EscapeMenu {

  export var menu = document.getElementById('')
  export var videoToTestIndex = 0;
  export var mooveAudioInsteedOfVideo = false;

  const ESCAPE_MENU_ID = 'escape-menue';
  const SEPARATE_SOUND_UNSOUND_WEBM = 'separate-sound-unsound-webm';
  const SEPARATE_SOUND_UNSOUND_WEBM_VIDEO = SEPARATE_SOUND_UNSOUND_WEBM + '-video';

  const MOVE_TO_PATH_BUTTON_ID = 'moveToPathButton';
  export const MOVE_TO_PATH_DISPLAY_ID = 'moveToPathSpan';
  export const MOVE_TO_NAME = 'moveToNameInput';
  const MOVE_TO_PATH_ADD = 'addMoveTo';

  export function bindToElement(id, closure) {
    var elem = document.getElementById(id);
    if(elem)
      elem.addEventListener('click', closure);
  }

  function toggleMainMenu() {
    menu.hidden = !menu.hidden;
  }

  bindToElement(MOVE_TO_PATH_BUTTON_ID, ()=>{
    ipc.send('select_directory');
  });

  bindToElement(MOVE_TO_PATH_ADD, ()=>{
    var display = document.getElementById(MOVE_TO_PATH_DISPLAY_ID);
    var name = document.getElementById(MOVE_TO_NAME) as HTMLInputElement;
    new MoveTarget(name.value,
        display.innerHTML, document.querySelector('div.footer ul')).render();
    display.innerHTML = '';
    name.value = '';
  });

  bindToElement(SEPARATE_SOUND_UNSOUND_WEBM, ()=> {
    (document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM) as HTMLButtonElement).disabled = true;
    var indexs = [];
    for (var i = EnvState.currentDirEntries.length-1; i >= 0; i--) {
      if(EnvState.currentDirEntries[i].toLocaleLowerCase().includes('.webm'))
        indexs.push(i);
    }
    function setVideoToTest() {
      if (videoToTestIndex<indexs.length) {
        var video = document.createElement('video');
        var name = EnvState.currentDirEntries[indexs[videoToTestIndex]];
        video.setAttribute('data-name', name)
        video.id = SEPARATE_SOUND_UNSOUND_WEBM_VIDEO;
        video.onloadedmetadata = eachVideo;
        var source = document.createElement('source');
        source.src = EnvState.currentDir + '/' + name;
        document.body.appendChild(video);
        video.appendChild(source);
      } else {
        (document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM) as HTMLButtonElement).disabled = false;
      }
    }


    function eachVideo () {
      var stop = new Date().getTime();
      while(new Date().getTime() < stop + 100) {
        ;
      }
      var oldVideoElement = document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM_VIDEO) as HTMLVideoElement;
      if (oldVideoElement) {
        var name = oldVideoElement.getAttribute('data-name');
        var toFolder = ((mooveAudioInsteedOfVideo)? 'WebmGif' : 'Video');
        if ((!mooveAudioInsteedOfVideo && 0<oldVideoElement.webkitAudioDecodedByteCount) || (mooveAudioInsteedOfVideo && oldVideoElement.webkitAudioDecodedByteCount===0)) {
          fs.mkdir(EnvState.currentDir + '/' + toFolder, ()=> {
            fs.rename(EnvState.currentDir + '/' + name, EnvState.currentDir + '/' + toFolder + '/' + name, (err)=> {
              if(err) {
                console.log(err);
                alert(JSON.stringify(err));
              }
            });
          });
        }
        oldVideoElement.parentNode.removeChild(oldVideoElement);
        oldVideoElement=null;
      }
      videoToTestIndex++;
      setVideoToTest();
    }
    setVideoToTest();
  });
}
