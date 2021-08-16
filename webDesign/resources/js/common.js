const $ = require('jquery');
const $window = $(window);
const $topNavMenu = $('.topper .topper-navbar');
const $topNavSwitcher = $('.topper-mobile-opener');

let rwdType;

// 定義當前RWD模式
const initClientWidth = () => {
  if ($window.width() > 1200) {
    rwdType = 'desktop';
    $topNavMenu.removeClass('js-active');

  } else if ($window.width() <= 1200 && $window.width() > 730) {
    rwdType = 'tablet';
  } else {
    rwdType = 'mobile';
  }
  console.log('RwdType: ', rwdType);
};

// ReSize事件
const getRwdTypeOnResize = () => {
  $window.resize(function() {
    initClientWidth();
  })
}

const handleMobileTopMenuSwitch = () => {
  $topNavSwitcher.on('click', function() {
    if (rwdType === 'desktop') { return; }
    console.log('TopNavMenu Clicked!');
    $topNavMenu.toggleClass('js-active');
    $(this).toggleClass('js-opened');
    
  })
}

initClientWidth();
getRwdTypeOnResize();
handleMobileTopMenuSwitch();

