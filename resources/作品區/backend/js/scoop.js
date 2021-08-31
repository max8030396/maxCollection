import { putSearch_scoop_merge,getLoad_origin } from './common/restapi';
import { deleteScoop_status } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,makePage,jsHide,removeApiDataForCloseBrowser } from './common/base';

const $editBtn = $('.editScoopBtn');
const $input = $('.scoopSearch');
const $searchBtn = $('.scoopBtn');
const $deleteBtn = $('#confirmDeleteScoop');
const userCode = localStorage.getItem('code');

let getInputValue = '';//當前搜尋欄的值
let numInit = 1// 起始位置
let currentNum;// 當前點擊的頁碼
let maxLen;// 頁籤判斷用
let firstLoad = true;// 判斷是否為第一次載入
let page = 1;// 當前api頁碼
let $infoBtn = $('.infoBtn'); // 更多按鈕
let currentIndex; // 當前點擊的網路文章編號
let scoopId;// 當前點擊更多資訊的scoopId
let scoopStatusArrForMoreDetail = [];
let appointScoopStatus = [];

//-------|API|-------//
// GET Api取得所有專欄
function putGetAllScoop(word) {
  putSearch_scoop_merge(`?format=json&tag=${word}&size=10&page=${page}`, {type: 'date'})
  .then((res) => {
    const apiData = res.data
    maxLen = Math.ceil(Number(apiData.count)/10);
    for(let i = 0;i < apiData.results.length;i = i + 1) {
      scoopStatusArrForMoreDetail.push(apiData.results[i])
    }
    updateScoop(apiData.results);
    if(firstLoad) {
      makePage(numInit,maxLen);
    } else {
      makePage(currentNum,maxLen);
    }
    firstLoad = false;
  })
  .catch((err) => {
  })
}

// GET Api預覽按鈕，點擊後更新專欄更多資訊
function getMoreInfo(scoopId,statusData) {
  
  // 調整成可以用的陣列，去除用不到的數值
  let statusDataArr = Object.values(statusData[0]);
  statusDataArr.splice(2,1)
  statusDataArr.splice(4,1)
  statusDataArr.splice(5,1)
  statusDataArr.map((value,index) => {
    if(index === 4) {
      // 縮圖
      $(`.moreDetail-${index + 1} figure`).css('background-image',`url(${value ? '/media/' + value : './images/noImage.png'})`);

    } else if(index >=5 && index <= 7) {
      $(`.moreDetail-${index + 1}`).text(value.length);

    } else {
      $(`.moreDetail-${index + 1}`).text(value)
    }
  })
  
  // 得到資料為醫師顯示資訊，否則隱藏
  if(statusData[0].user_type === 'doctor') {
    $('.moreDetail-9-badge').removeClass('js-hide');
    $('.accordion').removeClass('js-hide');
    $('.doctorDetail-1').text(statusData[0].firstName + statusData[0].lastName);
    $('.doctorDetail-2').text(statusData[0].character)
    $('.doctorDetail-3').text(statusData[0].hospital)
  } else {
    $('.moreDetail-9-badge').addClass('js-hide');
    $('.accordion').addClass('js-hide');
  }

  // GET Api 得專欄出處說明
  console.log('scoopId',scoopId);
  getLoad_origin(`?pk=${scoopId}`)
  .then((res) => {
    const apiData = res.data;
    // 清除舊資料再載入
    $('.moreDetail-origin li').remove('li');
    if(!apiData.length) {
      $('.moreDetail-origin').append('<li class="font-md" style="list-style:none;">無</li>')
    } else {
      for(let i = 0;i < apiData.length;i = i + 1) {
        $('.moreDetail-origin').append(`<li class="font-md"><a href="${apiData[i].url}" target="_blank">${apiData[i].name}</a></li>`);
      }
    }
  })
  .catch((err) => {

  })
}

// DELETE Api刪除文章
function deleteScoop(scoopId) {
  deleteScoop_status(`?pk=${scoopId}`,{
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((res) => {
    location.reload();
  })
  .catch((err) => {})
}

// ------------------------------------------------ //
// 取得搜尋欄位資訊並執行寫入網頁動作
function getInputSearchValue() {
  $searchBtn.on('click',function() {
    // 點擊搜尋後預設顯示的頁碼為1
    currentNum = 1;
    // 點擊搜尋後預設api的頁碼為1
    page = 1;
    getInputValue = $input.val();
    putGetAllScoop(getInputValue);
    // 清除現有內容以便下次使用
    $input.val('');
  })
}

// 專欄介面顯示區
function updateScoop(data) {
  if(data.length < 10) {
    jsHide(data.length,'scoop');
  }

  // 查詢錯誤顯示設定
  if (data.length === 0) {
    $('.wrongSearch').css('display','inline-block');
    $('.wrongSearch').text(`查詢無“${getInputValue}”資料！`);
  } else {
    $('.wrongSearch').css('display','none');
  }
  
  for(let i = 0; i < data.length; i = i + 1) {
    $(`.scoop-${i + 1}`).removeClass('js-hide');
    $(`.scoop-${i + 1} .span-1` ).text(data[i].id);
    $(`.scoop-${i + 1} .span-2` ).text(data[i].title);
    $(`.scoop-${i + 1} .span-3` ).text(data[i].author_id);
    $(`.scoop-${i + 1} .span-4` ).text(data[i].date);
    $(`.scoop-${i + 1} .infoBtn` ).attr('scoopId', data[i].id);
  }
}

// 取得當前點擊的數值
function getCurrentNum(target) {
  currentNum = Number(target.attr('data-value'))
  page = currentNum;
  makePage(currentNum,maxLen);
  putGetAllScoop(getInputValue)
}

// 取得指定專欄文章更多資訊
function getCurrentScoopId(target) {
  currentIndex = target.attr('scoopId');
  scoopId = currentIndex;
  $editBtn.attr('href',`scoopEdit.html?pk=${currentIndex}`);
  
  scoopStatusArrForMoreDetail.map((value) => {
    if(Number(scoopId) === value.id) {
        appointScoopStatus = [];
        appointScoopStatus.push(value)
    }
  })
  getMoreInfo(currentIndex,appointScoopStatus);
}

// 點擊取得值
function clickGetValue() {
  // 分頁當前的值
  $('.pageLink').on('click', function(){
    getCurrentNum($(this));
  });

  // 當前點擊專欄的值
  $infoBtn.on('click', function() {
    getCurrentScoopId($(this));
  })

  // 刪除文章
  $deleteBtn.on('click', function() {
    deleteScoop(scoopId);
  })
}

//登入登出驗證程序
removeApiDataForCloseBrowser('scoop',userCode);
popupLogoutProcess(userCode,900,30);
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      clickGetValue();
      putGetAllScoop('');
      getInputSearchValue();
      break;
  
    default:
      break;
  }
});