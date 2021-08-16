$(document).ready(() => {
const $window = $(window);
const $man = $('.man');
const $scene = $('.wrapper');
const $mask = $('.mask');
const $modeBtn = $('.option');
const $reset = $('.reset');
const $startPress = $('.startPress');
const $scoreTimer = $('.timer');
const $scoreBorad = $('.point');
const $reStartBtn = $('.reStart');

const $stoneSize = {
  width:$('.stone-1').width(),
  height:$('.stone-1').height()
}

let $manStatus = {
  posX: 0,
  posY: $scene.height() - $man.height()
}

//磚塊陣列值
const $stone = [
  {
    target: $('.stone-1'),
    posX: getRandomArbitrary(0, $scene.width() - 47),
    posY: -120,
    speed: getRandomArbitrary(3,8),
  },
  {
    target: $('.stone-2'),
    posX: getRandomArbitrary(0, $scene.width() - 47),
    posY: -120,
    speed: getRandomArbitrary(3,8),
  },
  {
    target: $('.stone-3'),
    posX: getRandomArbitrary(0, $scene.width() - 47),
    posY: -120,
    speed: getRandomArbitrary(3,8),
  }
];
//測試區

//測試區

let gameOver = false;
let currenTime = 100;
let isActive = false;
let moveLong = 0;
let moveSpeed = 100;
let $maxSceneWidth = $scene.width() - $man.width();
let scorePoint = 0;
let speedIncrease = 0;
let currentMode = '';
//取得隨機素質公式
function getRandomArbitrary(min,max){
  return Math.floor (Math.random() * (max - min) + min);
}

//測試區
  //排行榜設定
  




//測試區

//遊戲初始化設定
  function startGameInit (){
    
    //空白鍵暫停遊戲功能鍵
  function pasueBtn () {
    $window.on('keypress', (e) => {
      // console.log('',e);
      if(e.keyCode === 32) {
        isActive = !isActive;
      }
    })}
    pasueBtn();
    //開始及重新選擇隱藏
    $startPress.hide();
    $reset.hide();
    $reStartBtn.hide();

        
//磚塊Ｘ軸隨機位置
    for (let i = 0; i < $stone.length; i = i +1) {
      $stone[i].target.css('left', `${$stone[i].posX}px`);
    }
    //難度選擇
    function modeSelection () {
        // 點擊難度按鈕後做的事情
        function _showCurrentModeBtn(target) {
          $modeBtn.hide();
          $startPress.show();
          target.css('display',`block`);
          $reset.show();
        }
        function _hideCurrentModeBtn(target) {
          $modeBtn.show();
          $startPress.hide();
          target.css('display',`none`);
        }

        

        $modeBtn.on('click', function () {
          let $this = $(this);
          currentMode = $this.attr('data-mode');
          console.log('', currentMode);
          //普通、困難時間加速器
          function _increaseSpeed(){
            speedIncrease = speedIncrease + 2;
            setTimeout(_increaseSpeed,20000);
          };
          //簡易模式陷阱,超級加速器
          function _evilMode(){
            speedIncrease = 150;
            setTimeout(() => {
              speedIncrease = 0;
            }, 150);
            setTimeout(_evilMode,20000);//讓setTimeOut在執行自己的任務一次無限巡迴
          }
        
          switch (currentMode) {
            case '1':
              setTimeout(_evilMode,20000);
              _showCurrentModeBtn($this);
              break;
            case '2':
              _showCurrentModeBtn($this);
              speedIncrease = 6;
              setTimeout(_increaseSpeed,20000);
              break;
            case '3':
              _showCurrentModeBtn($this);
              speedIncrease = 10;
              setTimeout(_increaseSpeed,20000);
              break;
            case '4':
              _hideCurrentModeBtn($this);
              break;
              default:
                break;
            }
        });
    }

    //遊戲是否啟動,時間設定,最終得分
    $startPress.click(() => {
      $mask.hide();
      isActive = true;
      // if(ganeOver){$reStartBtn.show()}
      $scoreTimer.text(`剩下${currenTime}秒`);
      const endGame = setInterval(() => {
        currenTime = currenTime - 1;
        if(currenTime < 0) {
          isActive = false
          alert(`時間到,你的得分是${scorePoint}`);
          clearInterval(endGame)
          gameOver = true;
          $reStartBtn.show();
          console.log('',gameOver);
          return;
        } else if (gameOver) {
          isActive = false
          alert(`撞到了,你的得分是${scorePoint}`);
          $scoreTimer.text(`剩下0秒`);
          $reStartBtn.show();
          clearInterval(endGame)
          return;
        } 
        $scoreTimer.text(`剩下${currenTime}秒`);
      }, 1000);
      
    })
    modeSelection();
  }

//人物移動控制
  function manKeyPressControl () {
  //人物左移動
    $window.on('keypress', (e) => {
      if (e.keyCode === 97 || e.keyCode === 12551) {
        if (gameOver) {moveSpeed = 0};
        moveLong = moveLong - moveSpeed;
        if (moveLong <= 0) {moveLong = 0};
        $manStatus.posX = moveLong;
        $man.css('left', `${moveLong}px`);
      }
    })
  //人物右移動
    $window.on('keypress', (e) => {
      if (e.keyCode === 100 || e.keyCode === 12558) {
        if (gameOver) {moveSpeed = 0};
        moveLong = moveLong + moveSpeed;
        if (moveLong >= $maxSceneWidth) {moveLong = $maxSceneWidth};
        $manStatus.posX = moveLong;
        $man.css('left', `${moveLong}px`);
      }
    })
  }

//隨機磚塊掉落
  function randomFallStone () {
    requestAnimationFrame(randomFallStone);
    if (!isActive) { return;}
    for(let i = 0; i < $stone.length; i = i + 1) {
      $stone[i].posY = $stone[i].posY + $stone[i].speed + speedIncrease;
      if ($stone[i].posY + $stoneSize.height -10 >= $manStatus.posY ) {
        if($manStatus.posX >= $stone[i].posX -45&&$manStatus.posX <= $stone[i].posX + 45) {
          isActive = false;
          gameOver = true;
        }
      }
      // console.log('increase', $stone[i].speed + speedIncrease);
      if ($stone[i].posY >= 500) {
        $stone[i].posY = -120;
        $stone[i].posX = getRandomArbitrary(0,$scene.width() - 47);
        scorePoint = scorePoint + 1;
      }
      $stone[i].target.css('top', `${$stone[i].posY}px`);
      $stone[i].target.css('left', `${$stone[i].posX}px`);
      $scoreBorad.text(`得${scorePoint}分`);
    }
  }


  startGameInit();
  manKeyPressControl();
  randomFallStone();
})