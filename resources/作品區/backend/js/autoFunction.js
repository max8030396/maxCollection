import { getArticle_update_timeGap,getUser_verified,getSearchbar_user_email,getSearchbar_user,getUser_read,deleteUser_read,getSend_one_mail } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,makePage,jsHide,removeApiDataForCloseBrowser } from './common/base';
import clipboard from 'clipboard'

const timeGapBtn = $('.btn-1');
const $edmInput = $('.edmInput');//會員搜尋欄
const $edmSearchBtn = $('.edmSearchBtn');//會員搜尋按鈕
const $readInput = $('.readInput');//會員搜尋欄
const $readSearchBtn = $('.readSearchBtn');//會員搜尋按鈕
const $allReadBtn = $('.allReadBtn');//重置所有會員最新資訊讀取按鈕
const $readBtn = $('.readBtn')//單獨更新會員最新資訊讀取按鈕
const userCode = localStorage.getItem('code');
const $singleEdmBtn = $('.singleEdmBtn');//單獨送出EDM

let getInputValue = '';
let numInit = 1// 起始位置
let currentNum;// 當前點擊的頁碼
let maxLen;// 頁籤判斷用
let firstLoad = true;// 判斷是否為第一次載入
let page = 1;// 當前api頁碼

console.log('%c 更新tagList、備份DB、發送EDM', 'color:red;font-size:30px');
//-------|API|-------//
//Get Api點擊更新網路文章時間
function getTimeGapUpdate() {
  getArticle_update_timeGap('')
  .then((res) => {
    alert('執行成功');
  })
  .catch((err) => {
    alert('更新時間失敗，請回報管理員');
  })
}

//Get Api取得所有會員ＡＰＩ(附加搜尋)（size、page、search）(email、firstName、lastName)
function getAllUserData(word) {
  getSearchbar_user(`?search=${word}&page=${page}&size=5`)
  .then((res) => {
    const apiData = res.data
    maxLen = Math.ceil(Number(apiData.count)/5);
    updateUser(apiData.results)
    if(firstLoad) {
      makePage(numInit,maxLen);
    } else {
      makePage(currentNum,maxLen);
    }
    firstLoad = false;
  })
  .catch((err) => {
    alert('取得會員有誤，請回報管理員');
  })
}

//Get Api透過email來取得用戶更多資訊(僅能搜尋email)
function getUserDataFromEmail(email) {
  getSearchbar_user_email(`?email=${email}`)
  .then((res) => {
    const apiData = res.data
    $('.updateConfirm li').removeClass('js-hide');
    updateMoreInfo(apiData);
    $('.updateConfirm .wrongSearch').css('display','none');
    getInputValue = '';
  })
  .catch((err) => {
    $('.updateConfirm li').addClass('js-hide');
    $('.updateConfirm .wrongSearch').css('display','inline-block');
    $('.updateConfirm .wrongSearch').text(`查詢無${getInputValue}資料！`);
    getInputValue = '';
  })
}

//Get 更新用戶最新資訊讀取為yes
function getUpdateReadNews(target) {
  let userAuthId = target.attr('userAuthId');
  getUser_read(`?pk=${userAuthId}`)
  .then(() => {
    alert('更新成功')
  })
  .catch((err) => {
    alert('更新讀取失敗，請回報管理員');
  })
}

//Delete 重置全部用戶最新資訊讀取
function deleteResetAllUserReadNews() {
  deleteUser_read('').then(() => {
    alert('全體重置讀取成功')
  })
  .catch((err) => {
    alert('重置失敗，請回報管理員');
  })
}

// ------------------------------------------------ //
// 會員介面顯示區
function updateUser(data) {
  // 若API資料小於10，先將多餘欄位增加class再導入資料，資料正常則反之
  if(data.length < 5) {
    jsHide(data.length,'user');
  }
  // 查詢錯誤顯示設定
  if (data.length === 0) {
    $('.sendEdm .wrongSearch').css('display','inline-block');
    $('.sendEdm .wrongSearch').text(`查詢無“${getInputValue}”資料！`);
  } else {
    $('.sendEdm .wrongSearch').css('display','none');
  }
  
  for(let i = 0; i < data.length; i = i + 1) {
    $(`.user-${i + 1}`).removeClass('js-hide');
    $(`.user-${i + 1} .span-1` ).text(data[i].firstName + data[i].lastName);
    $(`.user-${i + 1} .span-2` ).text(data[i].email);
    $(`.user-${i + 1} .span-2` ).attr('userEmail',data[i].email);
    $(`.user-${i + 1} .singleEdmBtn` ).attr('userEmail', data[i].email);
  }
}

// 搜尋並更新更新讀取改版內容
function updateMoreInfo(data) {
  $('.updateConfirm .span-1').text(data[0].firstName + data[0].lastName);
  $('.updateConfirm .span-2').text(data[0].email);
  if(data[0].read_news === 'no') {
    $('.cancelReadBtn').css('display','none');
    $('.noRead').css('display','inline-block');
    $('.readBtn').css('display','inline-block');
  } else {
    $('.readBtn').css('display','none');
    $('.noRead').css('display','none');
    $('.cancelReadBtn').css('display','inline-block');
  }
}

// 取得當前點擊頁碼數值
function getCurrentNum(target) {
  currentNum = Number(target.attr('data-value'))
  page = currentNum;
  makePage(currentNum,maxLen);
  getAllUserData(getInputValue)
}

// 取得搜尋欄位資訊並執行寫入網頁動作
function getInputSearchValue() {
  $edmSearchBtn.on('click',function() {
    // 點擊搜尋後預設顯示的頁碼為1
    currentNum = 1;
    // 點擊搜尋後預設api的頁碼為1
    page = 1;
    getInputValue = $edmInput.val();
    getAllUserData(getInputValue)
    // 清除現有內容以便下次使用
    $edmInput.val('') 
  })
  
  $readSearchBtn.on('click',function() {
    getInputValue = $readInput.val();
    getUserDataFromEmail(getInputValue)
    // 清除現有內容以便下次使用
    $readInput.val('');
  })
}
//寄送EDM給指定用戶
function sendEdmToSpecify(target) {
  let userEmail = target.attr('userEmail')
  getSend_one_mail(`?mail=${userEmail}`)
  .then((res) => {
    alert('寄送成功');
  })
  .catch((err) => {
    alert('寄送EDM失敗，請回報管理員');
  })
}

// 點擊取得值
function clickGetValue() {
  $('.pageLink').on('click', function(){
    getCurrentNum($(this));
  });

  //點擊更新網路文章時間
  timeGapBtn.on('click', function() {
    getTimeGapUpdate();
  })

  $readBtn.on('click', function() {
    getUpdateReadNews($(this));
  })

  $allReadBtn.on('click', function() {
    deleteResetAllUserReadNews('');
  })
  $singleEdmBtn.on('click', function() {
    sendEdmToSpecify($(this));
  })
}

//點擊複製email
new clipboard('.copyBtn', {
  text: function(trigger) {
    return trigger.getAttribute('userEmail');
  }
});

//複製提示框
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))

tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

//登入登出驗證程序
removeApiDataForCloseBrowser('autofunction',userCode);
popupLogoutProcess(userCode,900,30);
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      getInputSearchValue();
      clickGetValue();
      getAllUserData('');
      break;
  
    default:
      break;
  }
});