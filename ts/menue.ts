const URL_GET_TOGGLE_MENUE = "toggle_menue";

(() => {
  "use strict";
  document.isLeftMenueToggled = false;
  document.isFootMenue = true;
  var actionList = document.getElementById('actionList');
  var toggleMenueWidth = actionList.style.width;
  var footer = document.getElementsByClassName('footer')[0];

  window.setLeftMenueSize = () => {
    var mainElement = document.mainElement.getHtmlElement();
    var imgW = mainElement.offsetWidth;
    var size;
    if(window.innerWidth - imgW < 500) {
      if(window.innerWidth - imgW < 250) {
        return false;
      }
      mainElement.style.marginRight = "0";
      size = "calc(100vw - " + imgW + "px)";
    } else {
      size = "calc(50vw - " + imgW/2 + "px)";
    }
    actionList.style.width = size;
    return true;
  };

  window.toLeftMenue = () => {
    if(!window.setLeftMenueSize()) {
      return false;
    }
    actionList.classList.add('leftMenue');
    footer.removeChild(actionList);
    footer.parentNode.appendChild(actionList);
    document.isFootMenue = false;
    return true;
  };

  window.toFooterMenue = () => {
    document.mainElement.getHtmlElement().style.marginRight = "auto";
    actionList = document.getElementById('actionList');
    actionList.classList.remove('leftMenue');
    actionList.parentNode.removeChild(actionList);
    footer.insertBefore(actionList, footer.children[0]);
    actionList.style.width = toggleMenueWidth;
    document.isFootMenue = true;
  };

  window.toggleMenue = (event) => {
    if(!document.isLeftMenueToggled) {
      if(window.toLeftMenue()) {
        document.isLeftMenueToggled = true;
      }
    } else {
      window.toFooterMenue();
      document.isLeftMenueToggled = false;
    }
  };
  document.getElementById('toggle_menue').addEventListener('click', window.toggleMenue);

  document.isLock = false;

  window.ConstAllMoveAction = [
    document.getElementById('delete_element') as HTMLButtonElement
  ];
})();
