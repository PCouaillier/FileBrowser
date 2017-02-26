(()=> {
  "use strict";
  var config_mv_to = document.getElementById("config_mv_to");
  config_mv_to.addEventListener('click', ()=> {
    var popIn = document.createElement('div');
    popIn.classList.add('popin');
    popIn.style.backgroundColor = "#EEEEEE";
    createLeftMenue(popIn);
    createCenterMenue(popIn);
    createRightMenue(popIn);
    document.body.appendChild(popIn);
  });

  function createLeftMenue(popIn) {
    var left = createSepMenue();
    popIn.appendChild(left);
  }

  function createCenterMenue(popIn) {
    var center = document.createElement('button');
    center.style.display = 'inline-block';
    center.innerHTML = '=>';
    var div = document.createElement('div');
    div.style.paddingTop = 'calc(50% - 4rem)';
    div.style.display = 'inline-block';
    div.style.height = '100%';
    div.style.cssFloat = 'left';
    div.appendChild(center);
    popIn.appendChild(div);
    var list = document.createElement('ul');
  }

  function createRightMenue(popIn) {
    var right = createSepMenue();
    popIn.appendChild(right);
  }

  function createSepMenue() {
    var sep = document.createElement('div');
    sep.style.display = 'inline-block';
    sep.style.height = '100%';
    sep.style.width = 'calc(50% - 5rem)';
    sep.style.cssFloat = 'left';
    return sep;
  }
})();
