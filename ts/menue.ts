const URL_GET_TOGGLE_MENUE = "toggle_menue";

namespace Menu {
  EnvState.isLeftMenueToggled = false;
  EnvState.isFootMenue = true;
  var actionList = document.getElementById('actionList');
  var toggleMenueWidth = actionList.style.width;
  var footer = document.getElementsByClassName('footer')[0];

  export const setLeftMenueSize = () => {
    var mainElement = EnvState.mainElement.getHtmlElement();
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

  export const toLeftMenue = () => {
    if(!Menu.setLeftMenueSize()) {
      return false;
    }
    actionList.classList.add('leftMenue');
    footer.removeChild(actionList);
    footer.parentNode.appendChild(actionList);
    EnvState.isFootMenue = false;
    return true;
  };

  export const toFooterMenue = () => {
    EnvState.mainElement.getHtmlElement().style.marginRight = "auto";
    actionList = document.getElementById('actionList');
    actionList.classList.remove('leftMenue');
    actionList.parentNode.removeChild(actionList);
    footer.insertBefore(actionList, footer.children[0]);
    actionList.style.width = toggleMenueWidth;
    EnvState.isFootMenue = true;
  };

  export const toggleMenue = (event) => {
    if(!EnvState.isLeftMenueToggled) {
      if(Menu.toLeftMenue()) {
        EnvState.isLeftMenueToggled = true;
      }
    } else {
      Menu.toFooterMenue();
      EnvState.isLeftMenueToggled = false;
    }
  };
  document.getElementById('toggle_menue').addEventListener('click', Menu.toggleMenue);

  EnvState.isLock = false;

  export const ConstAllMoveAction = [
    document.getElementById('delete_element') as HTMLButtonElement
  ];
}
