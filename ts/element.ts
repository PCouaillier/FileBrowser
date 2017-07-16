const fs = require('fs');

interface Array<T> {
  includes(T) : boolean;
}

interface HTMLMediaElement {
  webkitAudioDecodedByteCount: number;
}

EnvState.volume = 1;

class FolderElement  {
  name: string;
  path: string;
  htmlPath: string;
  htmlElement: HTMLMediaElement;
  ext: string;
  type: string;

  constructor(path: string, name: string) {
    this.name = name;
    this.path = path;
    this.htmlPath = decodeURI(path);
    this.htmlElement = null;
    var tmp = path.split('.');
    this.ext = tmp[tmp.length-1].toLowerCase();
  }

  static getImageExtention () {
    const IMAGE_EXTENTION = [ 'gif', 'jpg', 'png', 'jpeg', 'ico', 'svg', 'bmp'];
    return IMAGE_EXTENTION;
  }

  static getVideoExtention () {
    const VIDEO_EXTENTION = [ 'webm', 'mp4', 'mkv', 'ogv', 'mpg', 'mpeg', 'avi', 'wmv', 'mov', 'rm', 'ram', 'flv', '3gp'];
    return VIDEO_EXTENTION;
  }

  static getAudioExtention () {
    const AUDIO_EXTENTION = ['mid', 'midi', 'rm', 'ram', 'wma', 'aac', 'waw', 'ogg', 'mp3'];
    return AUDIO_EXTENTION;
  }

  static getTextExtention () {
    const AUDIO_EXTENTION = ['md', 'text', 'json', 'git', 'txt', 'rb', 'py', 'gitignore', 'css', 'coffee'];
    return AUDIO_EXTENTION;
  }

  getType () {
    if(this.type) return this.type;
    if(FolderElement.getImageExtention().includes(this.ext)) {
      this.type = "img";
    } else if(FolderElement.getAudioExtention().includes(this.ext)) {
      this.type = "audio";
    } else if (FolderElement.getVideoExtention().includes(this.ext)) {
      this.type = "video";
    } else if (FolderElement.getTextExtention().includes(this.ext)) {
      this.type = "pre";
    } else {
      this.type = "div";
    }
    return this.type;
  }

  getHtmlElement () {
    if(this.htmlElement===null) {
      var type = this.getType();
      var htmlElement = document.createElement(type) as HTMLMediaElement;
      htmlElement.id="main-element";
      switch (type) {
        case "img":
          htmlElement.src = this.path;
          break;
        case "video":
          var source = document.createElement('source');
          source.src=this.path;
          htmlElement.appendChild(source);
          htmlElement.autoplay=true;
          htmlElement.controls=true;
          htmlElement.loop=true;
          if(EnvState.isMuted) {
            htmlElement.muted=true;
          } else {
            htmlElement.volume = EnvState.volume;
          }
          break;
        case "audio":
          htmlElement.controls = true;
          htmlElement.autoplay = true;
          htmlElement.src = this.path;
          break;
        case "iframe":
          htmlElement.src = this.path;
          break;
        case "pre":
          fs.readFile('./style.css', 'utf8', (err, file)=>(htmlElement.innerHTML=file));
          break;
        default:
          htmlElement.innerHTML = this.path;
          break;
      }
      this.htmlElement = htmlElement;
    }
    return this.htmlElement;
  }
}

EnvState.isMuted = false;
function mute() {
  EnvState.isMuted = !EnvState.isMuted;
  EnvState.mainElement.getHtmlElement().muted=EnvState.isMuted;
}

interface HTMLMediaElement {
  naturalHeight: number;
  naturalWidth: number;
  complete: any;
}

function applyRatio() {
  var htmlElement = EnvState.mainElement.getHtmlElement();
  if (htmlElement.complete || htmlElement.readyState) {
    htmlElement.style.height=null;
    htmlElement.style.paddingTop=null;
    htmlElement.style.paddingBottom=null;
    var heightRatio = htmlElement.offsetHeight/htmlElement.naturalHeight;
    var widthRatio = htmlElement.offsetWidth/htmlElement.naturalWidth;
    if(widthRatio<heightRatio) {
      var height = widthRatio * htmlElement.naturalHeight;
      var padding = (htmlElement.offsetHeight - height)/2+"px";
      htmlElement.style.height = height+"px";
      htmlElement.style.paddingTop = padding;
      htmlElement.style.paddingBottom = padding;
    }
    if(window.innerWidth - htmlElement.offsetWidth < 250) {
      Menu.toFooterMenue();
    } else if((window.innerWidth - htmlElement.offsetWidth) >= 500 && EnvState.isLeftMenueToggled && EnvState.isFootMenue) {
      Menu.toLeftMenue();
    }
  } else {
    setTimeout(applyRatio, 10);
  }
}
