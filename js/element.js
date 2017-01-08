const fs = require('fs');
document.volume = 1;

const Element = (()=> {
  function Element(path) {
    this.path = path;
    this.htmlPath = decodeURI(path);
    this.htmlElement = null;
    var tmp = path.split('.');
    this.ext = tmp[tmp.length-1].toLowerCase();
  }

  Element.getImageExtention = function () {
    const IMAGE_EXTENTION = [ 'gif', 'jpg', 'png', 'tiff', 'jpeg', 'ico'];
    return IMAGE_EXTENTION;
  };

  Element.getVideoExtention = function () {
    const VIDEO_EXTENTION = [ 'webm', 'mp4', 'mkv', 'ogv', 'mpg', 'mpeg', 'avi', 'wmv', 'mov', 'rm', 'ram', 'flv', '3gp'];
    return VIDEO_EXTENTION;
  };
  Element.getAudioExtention = function () {
    const AUDIO_EXTENTION = ['mid', 'midi', 'rm', 'ram', 'wma', 'aac', 'waw', 'ogg', 'mp3'];
    return AUDIO_EXTENTION;
  };

  Element.getTextExtention = function () {
    const AUDIO_EXTENTION = ['md', 'text', 'json'];
    return AUDIO_EXTENTION;
  };

  Element.prototype.getType = function() {
    if(this.type) return this.type;
    if(Element.getImageExtention().includes(this.ext)) {
      this.type = "img";
    } else if(Element.getAudioExtention().includes(this.ext)) {
      this.type = "audio";
    } else if (Element.getVideoExtention().includes(this.ext)) {
      this.type = "video";
    } else if (Element.getTextExtention().includes(this.ext)) {
      this.type = "textarea";
    } else {
      this.type = "iframe";
    }
    return this.type;
  };
  Element.prototype.getHtmlElement = function () {
    if(this.htmlElement===null) {
      var type = this.getType();
      var htmlElement = document.createElement(type);
      htmlElement.id="main-element";
      switch (type) {
        case "video":
          var source = document.createElement('source');
          source.src=this.path;
          htmlElement.appendChild(source);
          htmlElement.autoplay=true;
          htmlElement.controls=true;
          htmlElement.loop=true;
          if(document.isMuted) {
            htmlElement.muted=true;
          } else {
            htmlElement.volume = document.volume;
          }
          break;
        case "audio":
          htmlElement.controls = true;
          htmlElement.autoplay = true;
          htmlElement.src = this.path;
          break;
        default:
          htmlElement.src = this.path;
          break;
      }
      this.htmlElement = htmlElement;
    }
    return this.htmlElement;
  };

  return Element;
})();

document.isMuted = false;
function mute() {
  document.isMuted = !document.isMuted;
  document.mainElement.getHtmlElement().muted=document.isMuted;
}

function applyRatio() {
  var htmlElement = document.mainElement.getHtmlElement();
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
      toFooterMenue();
    } else if( document.isLeftMenueToggled && document.isFootMenue) {
      toLeftMenue();
    }
  } else {
      setTimeout(applyRatio, 10);
  }
}
