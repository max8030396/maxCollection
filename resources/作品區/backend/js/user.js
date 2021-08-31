import { getSearchbar_user_email,getSearchbar_user,getSend_mail,getUser_verified,getUser_suspended,getSend_one_mail } from './common/restapi';
import { putUpdate_user_profile,putUpdate_doctor_profile,putGive_pass_mail } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,makePage,jsHide,removeApiDataForCloseBrowser } from './common/base';

const $editBtn = $('.editBtn');
const $jsEditBefore = $('.jsEditBefore');
const $jsEditAfter = $('.jsEditAfter');
const $editBtnCancel = $('.editBtn-cancel');
const $editBtnSendOut = $('.editBtn-sendOut');
const $input = $('.userSearch');//會員搜尋欄
const $searchBtn = $('.userBtn');//會員搜尋按鈕
const $sendMailBtn = $('.sendMailBtn'); //發送驗證信按鈕
const $confirmNowBtn = $('.confirmNowBtn');//立即驗證帳號按鈕
const $sendEdmBtn = $('.moreDetailEdmBtn');//立即發送edm給指定用戶
const $sendPasswordBtn = $('.sendPasswordBtn');//發送密碼至用戶信箱按鈕
const $moreDetailBtn = $('.moreDetailSpace .moreDetailBtn');
const userCode = localStorage.getItem('code');
const moreModal = new bootstrap.Modal(document.getElementById('moreBtn'));//bs5互動式窗

let getInputValue = '';//當前搜尋欄的值
let numInit = 1// 起始位置
let currentNum;// 當前點擊的頁碼
let maxLen;// 頁籤判斷用
let firstLoad = true;// 判斷是否為第一次載入
let page = 1;// 當前api頁碼
let hashcode;//用戶流水ID
let beforeChang;//會員編輯異動前
let afterChange;//會員編輯異動後
let userEmailValue;//當前點擊更多資訊的會員email
let currentType;//當前點擊更多資訊的會員身份
let clickSeeDetailType = 'doctor';//判斷點擊更多資訊的使用者身份，編輯用

console.log('%c 查看故事卡', 'color:red;font-size:30px');

//-------|API|-------//
//Get Api取得所有會員ＡＰＩ(附加搜尋)（size、page、search）(email、firstName、lastName)
function getAllUserData(word) {
  getSearchbar_user(`?search=${word}&page=${page}`)
  .then((res) => {
    const apiData = res.data
    maxLen = Math.ceil(Number(apiData.count)/10);
    updateUser(apiData.results)
    if(firstLoad) {
      makePage(numInit,maxLen);
    } else {
      makePage(currentNum,maxLen);
    }
    firstLoad = false;
  })
  .catch((err) => {
    alert('取得會員失敗，請回報管理員');
  })
}

//Get Api透過email來取得用戶更多資訊(僅能搜尋email)
function getUserDetailFromEmail(email) {
  getSearchbar_user_email(`?email=${email}`)
  .then((res) => {
    console.log(res);
    // console.log('正確取得更多資訊Api');
    const apiData = res.data
    updateMoreInfo(apiData);
  })
  .catch((err) => {
    alert('搜尋用戶有誤，請回報管理員');
  })
}

//PUT Api編輯會員資料
function putEditUserData(hashCode, data, type) {
  console.log('hashCode',hashCode);
  if(type === 'normal') {
    putUpdate_user_profile(`${hashCode}`,data)
  } else if (type === 'doctor') {
    putUpdate_doctor_profile(`${hashCode}`,data)
  }
}

//GET Api寄送會員驗證信 (鎖起來怕誤按)
function getSendVerifyEmail(email) {
  getSend_mail(`?mail=${email}`)
  .then((res) => {
    alert('已寄出，按鈕可以加一個防呆，避免後台出問題');
  })
  .catch((err) => {
    alert('發送失敗，請回報管理員');
  })
}
//GET Api立即驗證會員帳號
function getUserVerifyNow(email) {
  getUser_verified(`?mail=${email}`)
  .then((res) => {
    alert('驗證完成');
    moreModal.hide()
  }).catch((err) => {
    alert('驗證失敗，請回報管理員');
  })
}

//GET Api停權會員
function getUserSuspended(email) {
  getUser_suspended(`?mail=${email}`)
  .then((res) => {
    moreModal.hide();
  })
  .catch((err) => {
    alert('停權使用失敗，請回報管理員');
  });
}

//PUT Api發送忘記密碼信件至用戶信箱 (鎖起來怕誤按)
function putSendForgetPassWordEmail(email, type) {
  putGive_pass_mail(`?mail=${email}`,{
    "user_type": `${type}`,
    "email": `${email}`
  })
  .then((res) => {
    alert('已寄出密碼至用戶信箱，按鈕可以加一個防呆，避免後台出問題');
  })
  .catch((err) => {
    alert('發送失敗，請回報管理員');
  })
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
    getAllUserData(getInputValue)
    // 清除現有內容以便下次使用
    $input.val('') 
  })
}

// 會員介面顯示區
function updateUser(data) {
  const doctorText = '醫師'
  const normalText = '民眾'
  // 若API資料小於10，先將多餘欄位增加class再導入資料，資料正常則反之
  if(data.length < 10) {
    jsHide(data.length,'user')
  }

  // 查詢錯誤顯示設定
  if (data.length === 0) {
    $('.wrongSearch').css('display','inline-block');
    $('.wrongSearch').text(`查詢無“${getInputValue}”資料！`);
  } else {
    $('.wrongSearch').css('display','none');
  }
  
  for(let i = 0; i < data.length; i = i + 1) {
    $(`.user-${i + 1}`).removeClass('js-hide');
    $(`.user-${i + 1} .span-1` ).text(data[i].firstName + data[i].lastName);
    $(`.user-${i + 1} .span-2` ).text(data[i].user_type === 'normal' ? normalText : doctorText);
    $(`.user-${i + 1} .span-2` ).addClass(data[i].user_type === 'normal' ? 'normalType' : 'doctorType');
    $(`.user-${i + 1} .span-2` ).removeClass(data[i].user_type === 'normal' ? 'doctorType' : 'normalType');
    $(`.user-${i + 1} .span-3` ).text(data[i].email);
    $(`.user-${i + 1} .infoBtn` ).attr('userEmail', data[i].email);
  }
}

// 預覽按鈕，點擊後更新會員更多資訊
function updateMoreInfo(data) {
  // console.log('data',data);
  let badgeArr;

  //拉出紀錄，以便更新會員資料or發送密碼用
  currentType = data[0].user_type;
  hashcode = data[0].hashcode;

  $('.moreDetail-1').text(data[0].id);
  $('.moreDetail-2').text(data[0].user_type === 'normal' ? '民眾' : '醫師');

  if(data[0].user_type === 'normal') {
    clickSeeDetailType = 'normal';
    $('.moreDetail-2').text('民眾')
    $('.typeNormal').attr('selected','');
    
  } else {
    clickSeeDetailType = 'doctor';
    $('.moreDetail-2').text('醫師')
    $('.typeDoctor').attr('selected','');
    $('.accordion').removeClass('js-hide');
    $('.doctorDetail-1').text(data[0].hospital ? data[0].hospital : '尚未填寫')
    $('.doctorDetail-2').text(data[0].profession ? data[0].profession : '尚未填寫')
    $('.doctorDetail-3').text(data[0].character ? data[0].character : '尚未填寫')
    $('.hospitalInput').val(data[0].hospital)
    $('.professionInput').val(data[0].profession)
    $('.characterInput').val(data[0].character)
  }

  $('.moreDetail-3').text(data[0].firstName + data[0].lastName);
  $('.nameInput').attr('placeholder',data[0].firstName + data[0].lastName);
  $('.nameInput').val(data[0].firstName + data[0].lastName);

  if(data[0].gender === '0') {
    $('.moreDetail-4').text('男性')
    $('.genderMale').attr('selected','');
  } else {
    $('.moreDetail-4').text('女性')
    $('.genderFemale').attr('selected','');
  }
  $('.moreDetail-5').text(data[0].email);
  $('.emailInput').attr('placeholder',data[0].email);
  $('.emailInput').val(data[0].email);
  $('.moreDetail-6').text(data[0].password);

  // .moreDetail-7，移除字元轉成陣列
  badgeArr = data[0].interest.replace('[','').replace(']','').split('"');

  // 得出結果單數為正確字串，雙數則為""或","，故i設為 1，每次迴圈 i + 2，讓迴圈的數值固定在單數
  for(let i = 1; i < badgeArr.length; i = i + 2 ) {
    $('.moreDetailBadge').append(`<span class="badge">${badgeArr[i]}</span>`);
  }

  $('.moreDetail-8').text(data[0].point);
  $('.moreDetail-9').text(data[0].read_news === 'no' ? '尚未讀取' : '完成讀取');

  //停權按鈕顯示及其他功能按鈕顯示及文字判別
  $('.delete-modalBtn').css('display',`${data[0].verified === 'ban' ? 'none' : 'inline-block'}`);

  if (!data[0].verified) {
    $('.moreDetail-10').text('尚未驗證')
    $moreDetailBtn.removeClass('js-hide');
    $confirmNowBtn.text('立即驗證');

  } else if (data[0].verified === 'ban') {
    $('.moreDetail-10').text('停權用戶')
    $moreDetailBtn.addClass('js-hide');
    $confirmNowBtn.removeClass('js-hide');
    $confirmNowBtn.text('解除停權');

  } else {
    $('.moreDetail-10').text('完成驗證')
    $moreDetailBtn.addClass('js-hide');
  }
}

//取得編輯當前最新的值（boolean）
function getEditValue(first) {
  let nameValue = $('.nameInput').val();
  let genderValue = $('#gender').val();
  let typeValue = $('#type').val();
  let emailValue = $('.emailInput').val();
  let nameArray = Array.from(nameValue)
  let hospitalValue = $('.hospitalInput').val();
  let professionValue = $('.professionInput').val();
  let characterValue = $('.characterInput').val();
  let editObj = {};
  
  if(clickSeeDetailType === 'doctor') {
    editObj = {
      user_type: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      hospital: "",
      profession: "",
      character: ""
    }
    editObj.gender = genderValue;
    editObj.user_type = typeValue;
    editObj.email = emailValue;
    editObj.hospital = hospitalValue;
    editObj.profession = professionValue;
    editObj.character = characterValue;

  } else {
    editObj = {
      user_type: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: ""
    }
    editObj.gender = genderValue;
    editObj.user_type = typeValue;
    editObj.email = emailValue;
  }
  
  //如果用戶名字為複姓
  if(nameArray.length > 3) {
    editObj.firstName = nameArray[0] + nameArray[1];
    editObj.lastName = nameArray[2] + nameArray[3];
  //如果用戶名字為單名
  } else if (nameArray.length < 3) {
    editObj.firstName = nameArray[0];
    editObj.lastName = nameArray[1];
  //如果用戶名字為正常，不管多少都是最多顯示三個字
  } else {
    editObj.firstName = nameArray[0];
    editObj.lastName = nameArray[1] + nameArray[2];
  }
  
  //判斷是編輯前還編輯後取得的資料
  if(first) {
    beforeChang = editObj;
    // console.log('editObj之前',editObj);
  } else {
    afterChange = editObj;
    // console.log('editObj之後',editObj);
  }
}

// 編輯會員資料
function editUserDetail() {
  $editBtnCancel.on('click',function() {
    $jsEditBefore.css('display','flex');
    $jsEditAfter.css('display','none');
  })

  $editBtnSendOut.on('click',function() {
    getEditValue(false)

    //判斷是否有異動，若無則不執行api程序
    if(JSON.stringify(beforeChang) === JSON.stringify(afterChange)) {
      alert('尚未編輯任何欄位');
      $jsEditBefore.css('display','flex');
      $jsEditAfter.css('display','none'); 
      return;
    } else {
      let editChange = JSON.stringify(afterChange)
      putEditUserData(hashcode,editChange,currentType);
    }
    alert(`已完成對${afterChange.lastName}的編輯`)
    $jsEditBefore.css('display','flex');
    $jsEditAfter.css('display','none');
  })

  $editBtn.on('click',function() {
    getEditValue(true)
    $jsEditBefore.css('display','none');
    $jsEditAfter.css('display','flex');
  })
}

// 取得當前點擊頁碼數值
function getCurrentNum(target) {
  currentNum = Number(target.attr('data-value'))
  page = currentNum;
  makePage(currentNum,maxLen);
  getAllUserData(getInputValue)
}

// 紀錄當前點擊用戶Email，用於顯示更多會員資料＆裡面的各種按鈕功能
function getUserEmail (target) {
  userEmailValue = target.attr('useremail')
  console.log('userEmailValue1',userEmailValue)
  getUserDetailFromEmail(userEmailValue)
  
  // 清除點擊產生的最愛標籤
  $('.moreDetailBadge span').remove();
}

//寄送EDM給指定用戶
function sendEdmToSpecify(email) {
  console.log(email);
  getSend_one_mail(`?mail=${email}`)
  .then((res) => {
    alert('寄送成功');
  })
  .catch((err) => {
    alert('寄送EDM失敗，請回報管理員');
  })
}

//更多會員功能按鈕區，寄送驗證信、立即驗證帳號、發送密碼，暫時鎖起來避免誤按
function moreDetailBtn() {
  $sendMailBtn.on('click', function() {
    // getSendVerifyEmail(userEmailValue)
    alert('寄送驗證信鎖起來怕誤按')
  })

  $confirmNowBtn.on('click', function() {
    getUserVerifyNow(userEmailValue);
  })

  $sendPasswordBtn.on('click', function() {
    // putSendForgetPassWordEmail(userEmailValue,currentType)
    alert('寄送密碼信鎖起來怕誤按')
  })
  $sendEdmBtn.on('click', function() {
    sendEdmToSpecify(userEmailValue);
  })
  
}

// 點擊取得值
function clickGetValue() {
  $('.infoBtn').on('click' ,function() {
    getUserEmail($(this));
  });
  $('.pageLink').on('click', function(){
    getCurrentNum($(this));
  });
  $('#confirmDeleteUser').on('click', function() {
    getUserSuspended(userEmailValue);
    // console.log('userEmailValue',userEmailValue);
  })
}

//登入登出驗證程序
removeApiDataForCloseBrowser('user',userCode);
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      getAllUserData('');
      clickGetValue();
      getInputSearchValue();
      editUserDetail();
      moreDetailBtn();
      break;
  
    default:
      break;
  }
});