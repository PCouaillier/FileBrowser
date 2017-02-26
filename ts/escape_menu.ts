namespace escapeMenu {

  export var menu = document.getElementById('')
  export var videoToTestIndex = 0;
  export var mooveAudioInsteedOfVideo = false;

  const ESCAPE_MENU_ID = 'escape-menue';
  const SEPARATE_SOUND_UNSOUND_WEBM = 'separate-sound-unsound-webm';
  const SEPARATE_SOUND_UNSOUND_WEBM_VIDEO = SEPARATE_SOUND_UNSOUND_WEBM + '-video';

  export function bindToElement(id, closure) {
    var elem = document.getElementById(id);
    if(elem)
      elem.addEventListener('click', closure);
  }

  function toggleMainMenu() {
    menu.hidden = !menu.hidden;
  }

  bindToElement(SEPARATE_SOUND_UNSOUND_WEBM, ()=> {
    (document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM) as HTMLButtonElement).disabled = true;
    var indexs = [];
    for (var i = document.currentDirEntries.length-1; i >= 0; i--) {
      if(document.currentDirEntries[i].toLocaleLowerCase().includes('.webm'))
        indexs.push(i);
    }
    function setVideoToTest() {
      if (videoToTestIndex<indexs.length) {
        var video = document.createElement('video');
        var name = document.currentDirEntries[indexs[videoToTestIndex]];
        video.setAttribute('data-name', name)
        video.id = SEPARATE_SOUND_UNSOUND_WEBM_VIDEO;
        video.onloadedmetadata = eachVideo;
        var source = document.createElement('source');
        source.src = document.currentDir + '/' + name;
        document.body.appendChild(video);
        video.appendChild(source);
      } else {
        (document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM) as HTMLButtonElement).disabled = false;
      }
    }


    function eachVideo () {
      var oldVideoElement = document.getElementById(SEPARATE_SOUND_UNSOUND_WEBM_VIDEO) as HTMLVideoElement;
      if (oldVideoElement) {
        var name = oldVideoElement.getAttribute('data-name');
        var toFolder = ((mooveAudioInsteedOfVideo)? 'WebmGif' : 'Video');
        if ((!mooveAudioInsteedOfVideo && 0<oldVideoElement.webkitAudioDecodedByteCount) || (mooveAudioInsteedOfVideo && oldVideoElement.webkitAudioDecodedByteCount===0)) {
          fs.mkdir(document.currentDir + '/' + toFolder, ()=> {
            fs.rename(document.currentDir + '/' + name, document.currentDir + '/' + toFolder + '/' + name, (err)=> {
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
