const $ = require('jquery');
require('jqcloud2');
const script1 = document.createElement('script');
const chartJs = "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
const $searchBtn = $('.searchBtn');
const $description = $('.description');
const $insertDom = $('.s3_block_left_ul');
const $positiveDom = $('.s4_block_positive');
const $negativeDom = $('.s4_block_negative');
const $newsNavBtn = $('.s2_block_nav');
const $barChartDom1 = $('#s4_block_left_box2_barChart1');
const $barChartDom2 = $('#s4_block_right_box2_barChart2');
const $allSection = $('.sec');

window.barChartItem1 = null;
window.barChartItem2 = null;


//判斷當前NAV位置
let currentSelectNewsBtn;
let currentSelectNewsBtnIndex = 0;

//判斷當前是否為第一次載入資料
let currentClickMode = 'firstLoad'; // newsOnly

//用於搜尋欄位
let inputer = $('.s1_inputer');
let keyWords = '';

//用於API
let getNewsValue;
let getChartBarValue;

//預設能量條 數值、下方文字、文字雲
let positiveLabelWord = [];
let positiveBarValue = [];
let negativeLabelWord =[];
let negativeBarValue = [];
let positiveWords = [];
let negativeWords = [];

//判斷顯示區域
let allNewsApi = false;
let positiveApi = false;
let negativeApi = false;

//手機模式預設
let mobilePerBtnWidth = [];
let mobilePerBtnPosX = [];

//NPM導入失敗，疑似版本問題故強行寫入能量條PlugIn之CDN
script1.type = "text/javascript"
script1.setAttribute("src", chartJs)
$('head').prepend(script1);

//--------------文字雲、能量條相關設定-----------------------//
let cloudFontSizeMax = 1;
let cloudFontSizeMin = 5;
//取得文字雲隨機大小 預設 1-5
function  getRandomValue(cloudFontSizeMin, cloudFontSizeMax) {
  return Math.floor((Math.random() * (cloudFontSizeMax - cloudFontSizeMin) + cloudFontSizeMin) * 100)/100;
}
//看多、看空文字雲基礎設定
function positiveCloud(words) {
  // $('#s4_block_left_box1_cloud1').html('');
  $('#s4_block_left_box1_cloud1').jQCloud(words, {
    autoResize: true,
    colors: ["#800026","#6c757d", "#bd0026", "#00a", "#e31a1c", "#5E503F", "#fc4e2a", "#fd8d3c", "#0D6FB8", "#1b4332"],
    // colors: ["#e7228c", "#e7237c", "#e01671", "#dd0f6c", "#d90866", "#b5179e", "#a514a5", "#9410ab", "#8c0fae", "#830db1"],
    shape: 'rectangular',
    // fontSize: {
    //   from: 0.23,
    //   to: 0.001
    // },
  });

  $('#s4_block_left_box1_cloud1').jQCloud('update', words);
}
function negativeCloud(words) {
  $('#s4_block_right_box1_cloud2').jQCloud(words, {
    colors: ["#800026","#6c757d", "#bd0026", "#00a", "#e31a1c", "#5E503F", "#fc4e2a", "#fd8d3c", "#0D6FB8", "#1b4332"],
    autoResize: true,
    shape: 'rectangular',
    // fontSize: {
    //   from: 0.23,
    //   to: 0.001
    // },
  });

  $('#s4_block_right_box1_cloud2').jQCloud('update', words);
}

//預設看多、看空能量條設定
function barChart1(target, dataValue, borderWidth, labelWord) {
  var ctx = target;
  console.log('barChart1-1', window.barChartItem1);
  if(window.barChartItem1 !== null) {
    window.barChartItem1.destroy();
    console.log('barChart1-2');
    window.barChartItem1 = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelWord,
          datasets: [{
            label: '',
            data: dataValue,//數值
            backgroundColor: [
                'rgba(45, 0, 247, 0.7)',//主顏色
                'rgba(106, 0, 244, 0.7)',
                'rgba(137, 0, 242, 0.7)',
                'rgba(161, 0, 242, 0.7)',
                'rgba(177, 0, 232, 0.7)',
                'rgba(188, 0, 221, 0.7)',
                'rgba(209, 0, 209, 0.7)',
                'rgba(219, 0, 182, 0.7)',
                'rgba(229, 0, 164, 0.7)',
                'rgba(242, 0, 137, 0.7)'
            ],
            borderColor: [
                'rgba(45, 0, 247, 1)',//外框顏色
                'rgba(106, 0, 244, 1)',
                'rgba(137, 0, 242, 1)',
                'rgba(161, 0, 242, 1)',
                'rgba(177, 0, 232, 1)',
                'rgba(188, 0, 221, 1)',
                'rgba(209, 0, 209, 1)',
                'rgba(219, 0, 182, 1)',
                'rgba(229, 0, 164, 1)',
                'rgba(242, 0, 137, 1)'
            ],
            borderWidth: borderWidth//外框粗度
        }]
        },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          legend:{
            display: false
          },
          interaction: {
            mode: 'point'
          }
      }
    });
  } else {
    window.barChartItem1 = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelWord,
          datasets: [{
            label: '',
            data: dataValue,//數值
            backgroundColor: [
                'rgba(45, 0, 247, 0.7)',//主顏色
                'rgba(106, 0, 244, 0.7)',
                'rgba(137, 0, 242, 0.7)',
                'rgba(161, 0, 242, 0.7)',
                'rgba(177, 0, 232, 0.7)',
                'rgba(188, 0, 221, 0.7)',
                'rgba(209, 0, 209, 0.7)',
                'rgba(219, 0, 182, 0.7)',
                'rgba(229, 0, 164, 0.7)',
                'rgba(242, 0, 137, 0.7)'
            ],
            borderColor: [
                'rgba(45, 0, 247, 1)',//外框顏色
                'rgba(106, 0, 244, 1)',
                'rgba(137, 0, 242, 1)',
                'rgba(161, 0, 242, 1)',
                'rgba(177, 0, 232, 1)',
                'rgba(188, 0, 221, 1)',
                'rgba(209, 0, 209, 1)',
                'rgba(219, 0, 182, 1)',
                'rgba(229, 0, 164, 1)',
                'rgba(242, 0, 137, 1)'
            ],
            borderWidth: borderWidth//外框粗度
        }]
        },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          legend:{
            display: false
          },
          interaction: {
            mode: 'point'
          }
      }
    });
  }
}
function barChart2(target, dataValue, borderWidth, labelWord) {
  var ctx = target;
  if(window.barChartItem2 !== null) {
    window.barChartItem2.destroy();
    window.barChartItem2 = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelWord,
          datasets: [{
            label: '',
            data: dataValue,//數值
            backgroundColor: [
                'rgba(45, 0, 247, 0.7)',//主顏色
                'rgba(106, 0, 244, 0.7)',
                'rgba(137, 0, 242, 0.7)',
                'rgba(161, 0, 242, 0.7)',
                'rgba(177, 0, 232, 0.7)',
                'rgba(188, 0, 221, 0.7)',
                'rgba(209, 0, 209, 0.7)',
                'rgba(219, 0, 182, 0.7)',
                'rgba(229, 0, 164, 0.7)',
                'rgba(242, 0, 137, 0.7)'
            ],
            borderColor: [
                'rgba(45, 0, 247, 1)',//外框顏色
                'rgba(106, 0, 244, 1)',
                'rgba(137, 0, 242, 1)',
                'rgba(161, 0, 242, 1)',
                'rgba(177, 0, 232, 1)',
                'rgba(188, 0, 221, 1)',
                'rgba(209, 0, 209, 1)',
                'rgba(219, 0, 182, 1)',
                'rgba(229, 0, 164, 1)',
                'rgba(242, 0, 137, 1)'
            ],
            borderWidth: borderWidth//外框粗度
        }]
        },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          legend:{
            display: false
          },
          interaction: {
            mode: 'point'
          }
      }
    });
  } else {
    window.barChartItem2 = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelWord,
          datasets: [{
            label: '',
            data: dataValue,//數值
            backgroundColor: [
                'rgba(45, 0, 247, 0.7)',//主顏色
                'rgba(106, 0, 244, 0.7)',
                'rgba(137, 0, 242, 0.7)',
                'rgba(161, 0, 242, 0.7)',
                'rgba(177, 0, 232, 0.7)',
                'rgba(188, 0, 221, 0.7)',
                'rgba(209, 0, 209, 0.7)',
                'rgba(219, 0, 182, 0.7)',
                'rgba(229, 0, 164, 0.7)',
                'rgba(242, 0, 137, 0.7)'
            ],
            borderColor: [
                'rgba(45, 0, 247, 1)',//外框顏色
                'rgba(106, 0, 244, 1)',
                'rgba(137, 0, 242, 1)',
                'rgba(161, 0, 242, 1)',
                'rgba(177, 0, 232, 1)',
                'rgba(188, 0, 221, 1)',
                'rgba(209, 0, 209, 1)',
                'rgba(219, 0, 182, 1)',
                'rgba(229, 0, 164, 1)',
                'rgba(242, 0, 137, 1)'
            ],
            borderWidth: borderWidth//外框粗度
        }]
        },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          legend:{
            display: false
          },
          interaction: {
            mode: 'point'
          }
      }
    });
  }
}

//透過API取得並將資料導入“文字雲”、“能量條”
function getChartBar_textCloudData(target, positiveLen, negativeLen,cloudFontSizeMin,cloudFontSizeMax) {
  //每次callApi清空舊有資料
  positiveLabelWord = [];
  positiveBarValue = [];
  negativeLabelWord =[];
  negativeBarValue = [];
  positiveWords = [];
  negativeWords = [];

  //看多版面文字雲能量條資料帶入
  for (let i = 0; i < positiveLen; i = i + 1 ) {
    //版面不足故設定最多只顯示10筆能量條
    if(positiveLen > 10) {
      positiveLen = 10
    }
    //從api中取得text、value後推入能量條的陣列中
    positiveLabelWord.push(target.positiveValue[i].text)
    positiveBarValue.push(target.positiveValue[i].value)

    //建立空物件，內涵文字雲所需屬性
    let positiveObj = {
      text: '',
      weight: 0
    }
    //每迴圈一次變更屬性後推入，再迴圈一次再變更再推入
    //變更text屬性
    positiveObj.text = target.positiveValue[i].text;
    //透過getRandomValue取得隨機數值，變更weight屬性
    positiveObj.weight = getRandomValue(cloudFontSizeMin,cloudFontSizeMax);
    //推入文字雲的陣列中
    positiveWords.push(positiveObj)
  }

  //看空版面文字雲能量條資料帶入，使用方式同上
  for (let i = 0; i < negativeLen; i = i + 1 ) {
    if(negativeLen > 10) {
      negativeLen = 10;
    }
    negativeLabelWord.push(target.negativeValue[i].text)
    negativeBarValue.push(target.negativeValue[i].value)
    let negativeObj = {
      text: '',
      weight: 0
    }
    negativeObj.text = target.negativeValue[i].text;
    negativeObj.weight = getRandomValue(cloudFontSizeMin,cloudFontSizeMax);
    negativeWords.push(negativeObj)
  }
  //取得資料後執行並帶入指定的任務中
  barChart1($barChartDom1, positiveBarValue, 1.5, positiveLabelWord);
  barChart2($barChartDom2, negativeBarValue, 1.5, negativeLabelWord);

  // 文字雲
  positiveCloud(positiveWords)
  negativeCloud(negativeWords)
}

//--------------情緒溫度計相關設定-----------------------//

//自動計算半圓形的寬高
function gaugeResize () {
  const circleWrap = $('.s3_block_right');
  const circleBg = $('.circle');
  const circleGreyBg = $('.circleBg');
  let halfCircle = circleBg.width() / 2;
  let halfGreyCircle = circleGreyBg.width() / 2;
  let wrapHeight = circleWrap.height();
  let newTopMoveValue = wrapHeight - halfCircle;
  let newGreyTopMoveValue = wrapHeight - halfGreyCircle;

  // console.log('Check', halfCircle, wrapHeight, newTopMoveValue);
  circleBg.css('top', newTopMoveValue + 'px');
  circleGreyBg.css('top', newGreyTopMoveValue + 'px');
}
//半圓基礎設定
function initGaugePointerDeg(value) {
  console.log(value)
  const $pointer = $('.pointer');
  let valueToDegree = value * 1.8;
  setTimeout(() => {
    $pointer.css('transform','translate(-100%) rotate(' + valueToDegree + 'deg');
  }, 200);
}
//新增新聞列表
function _appendDataList(target, maxLen, data) {
  for (let i = 0; i < maxLen; i = i + 1 ) {
    target.append('<li><a href = '+ data[i].link +' target="_blank">' + data[i].value + '</a><br><span> ' + data[i].date + ' </span></li>')
  }
}

//--------------兩組API相關設定-----------------------//

//Api 1上方新聞列表及情緒溫度計專用API
function _handleApiAjax(dataType,keyWords) {
  $.ajax({
    url: `http://starklab.tw/api/news_get/?search=${keyWords}`,
    dataType: "json",
    async: true,
    type: "GET",
    beforeSend: function() {
      // console.log('beforeSend');
    },
    success: function(res) {
      //判斷當前新聞選擇區
      switch(dataType) {
        case 'ptt':
          getNewsValue = res.news.ptt;
        break;
  
        case 'google':
          getNewsValue = res.news.google;
        break;

        case 'yahoo':
          getNewsValue = res.news.yahoo;
        break;

        default:
        break;
      }

      if (getNewsValue === 'false') {
        //要馬無資料要碼輸入錯誤
        allNewsApi = true;
      } else {
        //資料正常透過API帶入所有資料
        allNewsApi = false;
        $('.eachNews').css('display','none')
        if (currentClickMode === 'firstLoad') {
          _appendDataList($insertDom, getNewsValue.length, getNewsValue);
          initGaugePointerDeg(res.emotionValue)
        } else if (currentClickMode === 'newsOnly') {
          _appendDataList($insertDom, getNewsValue.length, getNewsValue);
        }
        $allSection.removeClass('js_hide');
      }
      noDataFound(allNewsApi,positiveApi,negativeApi);
    },
    complete: function(res) {
      // console.log('complete');
    },
    error: function() {
      // console.log('error');
    }
  });

}
//Api 2下方文字雲、能量條、看多看空新聞專用API
function _handleApiAjax2(keyWords) {
  $.ajax({
    url: `http://starklab.tw/api/sentiment_score/?search=${keyWords}`,
    dataType: "json",
    async: true,
    type: "GET",
    beforeSend: function() {
      // console.log('beforeSend');
    },
    success: function(res) {
      getChartBarValue = res.chartBar;
      if (getChartBarValue.positiveValue === 'false' && getChartBarValue.positiveNews === 'false' && getChartBarValue.negativeValue === 'false' && getChartBarValue.negativeNews === 'false') {
        //要馬無資料要馬輸入錯誤
        positiveApi = true;
        negativeApi = true;
      } else if (getChartBarValue.positiveValue === 'false' || getChartBarValue.positiveNews === 'false') {
        //看多無資料
        positiveApi = true;
        getChartBar_textCloudData(getChartBarValue, getChartBarValue.positiveValue.length, getChartBarValue.negativeValue.length,cloudFontSizeMin, cloudFontSizeMax)
        if (currentClickMode === 'firstLoad') {
          _appendDataList($negativeDom, getChartBarValue.negativeNews.length, getChartBarValue.negativeNews);
        }
      } else if (getChartBarValue.negativeValue === 'false' || getChartBarValue.negativeNews === 'false') {
        //看空無資料
        negativeApi = true;
        getChartBar_textCloudData(getChartBarValue, getChartBarValue.positiveValue.length, getChartBarValue.negativeValue.length,cloudFontSizeMin, cloudFontSizeMax)
        if (currentClickMode === 'firstLoad') {
          _appendDataList($positiveDom, getChartBarValue.positiveNews.length, getChartBarValue.positiveNews);
        }
      } else {
        //資料正常，取得資料後導入文字雲及能量條專用任務中並執行並顯示
        positiveApi = false;
        negativeApi = false;
        getChartBar_textCloudData(getChartBarValue, getChartBarValue.positiveValue.length, getChartBarValue.negativeValue.length,cloudFontSizeMin, cloudFontSizeMax)
        if (currentClickMode === 'firstLoad') {
          _appendDataList($positiveDom, getChartBarValue.positiveNews.length, getChartBarValue.positiveNews);
          _appendDataList($negativeDom, getChartBarValue.negativeNews.length, getChartBarValue.negativeNews);
        }
      }
      noDataFound(allNewsApi,positiveApi,negativeApi);
    },
    complete: function(res) {
      // console.log('complete');
    },
    error: function() {
      // console.log('error');
    }
  });
}

//--------------功能性設定-----------------------//

//防呆，用戶輸入錯誤返回開始畫面、判斷無資料時顯示畫面
function noDataFound (allNewsApi,positiveApi,negativeApi) {
  if (allNewsApi === true && positiveApi === true && negativeApi === true) {
    alert('輸入錯誤請重新輸入')
    $description.css('display','block')
    $allSection.addClass('js_hide');
    return
  }

  if (allNewsApi === true) {
    $insertDom.css('display','none')
    $('.eachNews').css('display','block')
    // console.log('綜合新聞沒資料')
  } else {
    $description.css('display','none')
    $insertDom.css('display','block')
    // console.log('綜合新聞有資料')
  }

  if (positiveApi === true) {
    $('.s4_block_left_box1').css('display','none')
    $('.s4_block_left_box2').css('display','none')
    $('.s4_block_left_box3_ul').css('display','none')
    $('.positiveNews').css('display','block')
    // console.log('看多沒資料')
  } else {
    $('.s4_block_left_box1').css('display','inline-block')
    $('.s4_block_left_box2').css('display','inline-block')
    $('.s4_block_left_box3_ul').css('display','block ')
    $('.positiveNews').css('display','none')
    // console.log('看多有資料')
  }

  if (negativeApi === true) {
    $('.s4_block_right_box1').css('display','none')
    $('.s4_block_right_box2').css('display','none')
    $('.s4_block_right_box3_ul').css('display','none')
    $('.negativeNews').css('display','block')
    // console.log('看空沒資料')
  } else {
    $('.s4_block_right_box1').css('display','inline-block')
    $('.s4_block_right_box2').css('display','inline-block')
    $('.s4_block_right_box3_ul').css('display','block')
    $('.negativeNews').css('display','none')
    // console.log('看空有資料')
  }
}

//判斷是否第一次載入及清除目標中的li
function cleanBlockElement(cleanType) {
  currentClickMode = 'firstLoad';

  if (cleanType === 'all') {
    $insertDom.empty('li');
    $positiveDom.empty('li');
    $negativeDom.empty('li');
  } else if (cleanType === 'news') {
    $insertDom.empty('li');
  }
}

//自動計算共有幾個“新聞選擇區（s2）”及給予各自的寬度
function initS2_blockWidth() {
  let s2_blockWidth = $('.s2_block').width();
  let countItem = $('.s2_block_nav').length;
  let s2_navWidth = s2_blockWidth/countItem;
  $('.s2_block_nav').css('width',`${s2_navWidth}`);
}

//自動計算手機版“新聞選擇區(s2)“初始位置、各個nav位置、移動距離計算
function initMobileBtnWidth() {
  let firstPosX = -($('.s2_nav1').width() / 2);
  let movePosX = firstPosX;

  for (let i = 0; i < $('.s2_block_nav').length; i ++) {
    let perWidth = Math.floor($(`.s2_nav${i + 1}`).width());
    mobilePerBtnWidth.push(perWidth + 1);
    if (i === 0) {
      mobilePerBtnPosX.push(firstPosX);
    } else {
      movePosX = movePosX - perWidth;
      mobilePerBtnPosX.push(movePosX);
    }
  }

  $('.s2_block').css('transform', `translateX(-${mobilePerBtnWidth[0] / 2}px)`);
}

//新聞選擇區之選擇框當前位置及移動判斷、//debounce、//判斷索引資料無變更，僅切換“新聞選擇區”顯示的內容
function newsNavBtnOnClick() {
  $newsNavBtn.on('click',function() {
    currentSelectNewsBtn = $(this);
    $newsNavBtn.removeClass('js_active');
    $(this).addClass('js_active');
    currentSelectNewsBtnIndex = Number($(this).attr('data-index'));
    if ($(window).width() < 730) {
      $('.s2_block').css('transform', `translateX(${mobilePerBtnPosX[currentSelectNewsBtnIndex]}px)`);
    }
  })

  $newsNavBtn.on('click', debounce(function() {
    cleanBlockElement('news');
    currentClickMode = 'newsOnly';
    let dataType = currentSelectNewsBtn.attr('data-mode');
    _handleApiAjax(dataType, keyWords);
  }, 700));
}

//防呆預防用戶輸入空資料、//用戶輸入資料並取得相對應之API內容、//清除說明文字並載入資料
function debounceProcess() {
  // 此段為預防用戶輸入空資料
  if(inputer.val() === '') {
    alert('請輸入股票代號或名稱')
    return
  }
  //索引資料及清除搜尋欄
  keyWords = inputer.val();
  inputer.val('');
  $('.s2_nav1').addClass('js_active');
  //用戶重新輸入股票代號或名稱，清除所有資料再重新載入
  cleanBlockElement('all');
  _handleApiAjax('ptt', keyWords);
  _handleApiAjax2(keyWords)
}

//搜尋按鈕debounce
function searchBtnOnClick() {
  $searchBtn.on('click',debounce(debounceProcess, 1000))
}

//debounce
function debounce(func, delay=250) {
  let timer = null;
  return () => {
    let context = this;
    let args = arguments;
    // let target = $this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay)
  }
}

//手機版滑動套件,設定滑動之基礎配置
function mobileSwipeEvent() {
  $('.s2_block').swipe({
    swipeLeft: function(event, distance, duration, fingerCount, fingerData, currentDirection) {
      currentSelectNewsBtnIndex = currentSelectNewsBtnIndex + 1;
      
      if (currentSelectNewsBtnIndex > 2) { 
        currentSelectNewsBtnIndex = 2;
        // console.log('swipeLeft', currentSelectNewsBtnIndex);
        return;
      }
      // console.log('swipeLeft', currentSelectNewsBtnIndex);
      $(`.s2_nav${currentSelectNewsBtnIndex + 1}`).trigger('click');
    },
    swipeRight: function(event, distance, duration, fingerCount, fingerData, currentDirection) {
      currentSelectNewsBtnIndex = currentSelectNewsBtnIndex - 1;

      if (currentSelectNewsBtnIndex < 0) { 
        currentSelectNewsBtnIndex = 0;
        // console.log('swipeRight', currentSelectNewsBtnIndex);
        return;
      }
      // console.log('swipeRight', currentSelectNewsBtnIndex);
      $(`.s2_nav${currentSelectNewsBtnIndex + 1}`).trigger('click');
    },
    threshold: 30
  });
}

searchBtnOnClick();
newsNavBtnOnClick();
gaugeResize();
initS2_blockWidth();

if ($(window).width() < 730) {
  initMobileBtnWidth();
  // mobileSwipeEvent();
}

$(window).on('resize', function() {
  gaugeResize();
  initS2_blockWidth();
  if($(window).width() < 730) {
    initMobileBtnWidth();
    // mobileSwipeEvent();
  } else if ($(window).width() > 731) {
    $('.s2_block').css('transform', 'none');
  }
})
