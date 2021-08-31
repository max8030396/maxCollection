const $ = require('jquery');
// require('../sass/index.scss');
// require('../sass/superslider.scss');

// 開發中
// $.fn.superSlider = function(config) {

//   var _default = {
//     bgColor: '#bf6913',
//     time: 3000,
//   }

//   // var $target = this;
//   var $config = $.extend({}, _default, config);
//   // var insertBgColor = 'style="background-color: ' + $config.bgColor + ';"';
  
//     const $ss_photo_nav = $('.ss_photo_nav')
//     const $navigator_leftBtn = $('.ss_navigator_left')
//     const $navigator_rightBtn = $('.ss_navigator_right')
//     const $doc = $('.ss_paginator_doc')
  
//     let currentDataIndex = 0;

  

//     //Slider基礎設定
//   function imgSliderInit() {
//     //預設圖片為第一張
//     for(let i = 0; i < $ss_photo_nav.length; i ++) {
//       $(`.ss_photo_nav_${[i + 1]}`).css('left',`${i * 100}%`)
//     }
    
//     moveLeft()
//     moveRight()
//     docClickActive()
//   }

//   //點擊前往下一張圖片
//   function moveLeft() {
//     $navigator_leftBtn.on('click',function() {
//       currentDataIndex = currentDataIndex + 1;

//       if (currentDataIndex > 0 ) {
//         currentDataIndex = -($ss_photo_nav.length - 1);
//       }

//       docClickActive()
//       movePhoto(currentDataIndex)
//     })
//   }

//   //點擊前往上一張圖片
//   function moveRight() {
//     $navigator_rightBtn.on('click',function() {
//       currentDataIndex = currentDataIndex - 1;

//       if (currentDataIndex <= -($ss_photo_nav.length) ) {
//         currentDataIndex = 0;
//       }

//       docClickActive()
//       movePhoto(currentDataIndex)
//     })
//   }

//   //下方索引點當前位置
//   function docClickActive() {
//     $($doc).removeClass('docActive')
//     $(`.ss_paginator_doc_${-currentDataIndex + 1}`).addClass('docActive')

//     //點擊下方索引點前往指定圖片
//     $doc.on('click', function() {
//       $($doc).removeClass('docActive')
//       $(this).addClass('docActive')
//       let indexValue = Number(-$(this).attr('data-index') + 1)
//       currentDataIndex = indexValue

//       movePhoto(currentDataIndex)
//     })
    
//   }

//   //圖片left移動之函數
//   function movePhoto(indexValue) {
//     for(let i = 0; i < $ss_photo_nav.length; i ++) {
//     $(`.ss_photo_nav_${[i + 1]}`).css('left',`${(i + indexValue) * 100}%`)
//     }
//   }

//   //輪播設定(秒數)
//   function autoPlayPhoto (time) {
//     setInterval(() => {
//       $navigator_rightBtn.click();
//     }, time);
//   }
//   autoPlayPhoto(time)
//   imgSliderInit()
//   // requestAnimationFrame(imgSliderInit)
// }
  
  
// 完整版未改換成套件
export function superSlider(time, index) {
  let $ss_photo_nav = $(`.ss_wrap_${index} .ss_photo_nav`)
  let $navigator_leftBtn = $(`.ss_wrap_${index} .ss_navigator_left`)
  let $navigator_rightBtn = $(`.ss_wrap_${index} .ss_navigator_right`)
  let $doc = $(`.ss_wrap_${index} .ss_paginator_doc`)

  let currentDataIndex = 0;

  //Slider基礎設定
  function imgSliderInit() {
    //預設圖片為第一張
    for(let i = 0; i < $ss_photo_nav.length; i ++) {
      $(`.ss_photo_nav_${[i + 1]}`).css('left',`${i * 100}%`)
    }
    
    moveLeft()
    moveRight()
    docClickActive()
  }

  //點擊前往下一張圖片
  function moveLeft() {
    $navigator_leftBtn.on('click',function() {
      currentDataIndex = currentDataIndex + 1;

      if (currentDataIndex > 0 ) {
        currentDataIndex = -($ss_photo_nav.length - 1);
      }

      docClickActive()
      movePhoto(currentDataIndex)
    })
  }

  //點擊前往上一張圖片
  function moveRight() {
    $navigator_rightBtn.on('click',function() {
      currentDataIndex = currentDataIndex - 1;

      if (currentDataIndex <= -($ss_photo_nav.length) ) {
        currentDataIndex = 0;
      }

      docClickActive()
      movePhoto(currentDataIndex)
    })
  }

  //下方索引點當前位置
  function docClickActive() {
    $($doc).removeClass('docActive')
    $(`.ss_wrap_${index} .ss_paginator_doc_${-currentDataIndex + 1}`).addClass('docActive')

    //點擊下方索引點前往指定圖片
    $doc.on('click', function() {
      $($doc).removeClass('docActive')
      $(this).addClass('docActive')
      let indexValue = Number(-$(this).attr('data-index') + 1)
      currentDataIndex = indexValue

      movePhoto(currentDataIndex)
    })
    
  }

  //圖片left移動之函數
  function movePhoto(indexValue) {
    for(let i = 0; i < $ss_photo_nav.length; i ++) {
    $(`.ss_wrap_${index} .ss_photo_nav_${[i + 1]}`).css('left',`${(i + indexValue) * 100}%`)
    }
  }

  function autoPlayPhoto (time) {
    setInterval(() => {
      $navigator_rightBtn.click();
    }, time);
  }

  autoPlayPhoto(time)
  imgSliderInit()
  // requestAnimationFrame(imgSliderInit)
}




// superSlider(3000)