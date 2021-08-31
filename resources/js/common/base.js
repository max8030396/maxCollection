import { deleteBackend_login, putBackend_login } from './restapi';

//<------------------------------------------------------------------------------------------->
// 預設填入
// 引入專用套件--> import { popupLogoutProcess } from './common/base'
// pug 加入模組--> +components('alertLogoutPopup')
// 設定變數：取得用戶驗證碼--> const userCode = localStorage.getItem('code');

//計時登入時間及跳出提醒的鬧鐘
function alertPopupForLogout (setTime,setAlertTime,userCode) {
  var logoutAlert = new bootstrap.Modal(document.getElementById('logoutAlert'));
  const countDownTime = $('.countDownTime');
  let countTime = setTime;

  //登出計時器
  const forceLogout = setInterval(() => {
    countTime = countTime - 1;
    countDownTime.text(`${countTime}秒`)
    if(countTime === setAlertTime) {
      logoutAlert.show()
    }
    if (countTime === 0) {
      clearInterval(forceLogout);
      logoutProcess(userCode);
    }
  }, 1000);

  $('.stayBtn').on('click',function() {
    countTime = setTime;
  })
}

//登出程序流程：先刪除 -> 在驗證 -> 得到無此用戶 -> 登出
function logoutProcess(userCode) {
  deleteBackend_login('',{
    headers: {
      "Content-Type": "application/json"
    },
    data:{
      code: `${userCode}`
    }
  })
  .then((res) => {
    alert('已登出系統');
    putBackend_login('',{
      code: userCode
    })
    .then((res) => {
      if(res.data === 'no user') {
        window.location.href=`${SERVER_DOMAIN}/login.html`;
      }
    }).catch((err) => {
      alert(`${err.response.status}! 請聯繫管理員`)
    })
  })
  .catch((err) => {
    alert(`${err.response.status}! 請聯繫管理員`)
  })
}

//執行登出
function clickLogout(userCode) {  
  const $sideBarLogoutBtn = $('.loginSideBtn');
  const $popupLogoutBtn  = $('.logoutBtn')

  $sideBarLogoutBtn.on('click',function() {
    logoutProcess(userCode);
  });

  $popupLogoutBtn.on('click',function() {
    logoutProcess(userCode);
  });
}

//套件：登出計時器
//引入數值：一次登入可使用的時間--> setTime = number;
//引入數值：剩下 ? 秒跳出提醒--> setAlertTime = number;
//引入數值：登入的驗證碼-->  userCode = string;
export function popupLogoutProcess(userCode,setTime,setAlertTime) {
  // if(userCode === 'god') {
  //   console.log('%c GOD_MODE啟動', 'color:red;font-size:30px');
  //   return;
  // }
  clickLogout(userCode);
  alertPopupForLogout (setTime,setAlertTime,userCode);
}

//<------------------------------------------------------------------------------------------->
//套件：強制關閉網頁移除Api登入驗證碼
//當強制關閉網頁時，在關閉前執行移除
//避免用戶可用同一組驗證碼登入
//引入數值：用戶驗證碼--> userCode = string;
//尚未使用！！！
export function deleteLoginData(userCode) {
  deleteBackend_login('',{
    headers: {
      "Content-Type": "application/json"
    },
    data:{
      code: `${userCode}`
    }
  })
  .then((res) => {})
  .catch((err) => {
    alert(`${err.response.status}! 請聯繫管理員`)
  })
}

//<------------------------------------------------------------------------------------------->
// 套件：驗證登入
//引入數值：登入的驗證碼-->  userCode = string;
export function checkKeepLoginOnLoad(userCode) {
  if (userCode === null) {
    alert('載入驗證null')
    window.location.href = `${SERVER_DOMAIN}/login.html`;
  } else {
    let loginIdentify = '';
    let promise = putBackend_login('',{
      code: userCode
    })
    .then((res) => {
      loginIdentify = res.data
      // console.log('驗證成功', userCode, res.data, loginIdentify);
      // if(userCode === 'god') {
      //   loginIdentify = 'admin';
      //   console.log('%c GOD_MODE啟動', 'color:red;font-size:30px');
      //   return loginIdentify;
      // }
      if (res.data === 'no user') {
        alert('驗證失敗,已登出系統');
        window.location.href = `${SERVER_DOMAIN}/login.html`;
      }
      return loginIdentify;
    }).catch((err) => {      
      alert(`${err.response.status}! 請聯繫管理員`)
      return 'gg';
      // window.location.href = `${SERVER_DOMAIN}/login.html`;
    })
    
    return promise
  }
}

//<------------------------------------------------------------------------------------------->
// 套件：頁碼切換
// 設定變數：Api取得欲顯示項目的最大長度--> maxLen = number;
// 引入數值：當前點擊的頁碼--> currentNum = number;
export function makePage (currentNum,maxLen) {
  const around = 2;// around * 2 + 1 = 當前位置左右兩側要顯示的標籤數
  let count = [];// 擺放頁碼的空陣列
  let startPos = currentNum - around  // 每次顯示的初始位置
  let endPos = currentNum + around  // 每次顯示的最終位置
  $('.endPage').attr('data-value', maxLen); // 賦予最後一頁最終值

  // 如果頁籤數量大於0小於5，多出的頁籤隱藏
  if(maxLen > 0 && maxLen < 5) {
    for(let h = maxLen; h < 5; h = h + 1) {
      $(`.li-${h + 1}`).addClass('js-hide');
    }

  // 如果頁籤數量等於0，則顯示1個頁籤
  } else if(maxLen === 0) {
    for(let h = maxLen; h < 5; h = h +1) {
      $(`.li-${h + 2}`).addClass('js-hide');
    }
  // 不再上述則正常顯示
  } else {
    for(let h = 0; h < 5; h = h +1) {
      $(`.li-${h + 1}`).removeClass('js-hide');
    }
  }
  
  // 當值為"正數"1、2的時候，起始值及最終值固定為欲顯示標籤的數量
  if(currentNum - around <= 0) {
    startPos = 1
    endPos = 5

  // 當值為 "倒數" 1、2的時候，起始值＝最大值扣欲顯示的標籤數量
  } else if (currentNum + around > maxLen) {
    startPos = maxLen - around * 2
    endPos = maxLen

  // 當值為 "正數" 及 "倒數" 1、2之間的值，點擊後數字會置中，當前點擊數值-2為起始值、+2為最終值
  } else {
    startPos = currentNum - around
    endPos = currentNum + around
  }

  // 將數字推入陣列中，用來動態更改標籤顯示的數值(避免分頁數值過大)
  for(let i = startPos;i <= endPos;i = i + 1) { 
    count.push([i])
  }

  count.map((value, index) => {
    if(currentNum === value[0]) {
      $(`.li-${index + 1}`).addClass('js-select');
      $(`.li-${index + 1}`).text(value);
      $(`.li-${index + 1}`).attr('data-value', value);
    } else {
      $(`.li-${index + 1}`).removeClass('js-select');
      $(`.li-${index + 1}`).text(value);
      $(`.li-${index + 1}`).attr('data-value', value);
    }
  })

  count = []; // 完成變更後，清空待下次使用
}

//<------------------------------------------------------------------------------------------->
// 套件：js動態隱藏
// 引入數值：隱藏類型--> target = string;
// 引入數值：不隱藏的數目--> target = string;
// 隱藏多餘用戶欄
export function jsHide(dataLen,target) {
  for(let i = dataLen; i < 10; i = i + 1) {
    $(`.${target}-${i + 1}`).addClass('js-hide');
  }
}

//<------------------------------------------------------------------------------------------->
// 套件：關閉網頁移除Api驗證碼
// 引入數值：當前網頁--> type = string;
// 引入數值：用戶驗證碼--> userCode = string;
//當網頁被強行關閉時，執行移除Api的驗證碼
export function removeApiDataForCloseBrowser(type,userCode) {
  // if(userCode === 'god') {
  //   console.log('%c GOD_MODE啟動', 'color:red;font-size:30px');
  //   return;
  // }
  let isActive = true;
  //- 排除各網頁有跳轉的按鈕
  if(type === 'user') {
    // 判斷如果是user、resume，刪除送出按鈕跳轉網頁不會登出
    $('.delete-modalBtn, .editBtn-sendOut').on('click',function() {
      isActive = false;
    });
  } else if(type === 'resume') {
    // 判斷如果是user、resume，刪除送出按鈕跳轉網頁不會登出
    $('.delete-modalBtn, .addBtn, .editBtn-sendOut').on('click',function() {
      isActive = false;
    });
  } else if (type === 'scoop') {
    // 判斷如果是scoop，刪除編輯新增按鈕跳轉網頁不會登出
    $('.delete-modalBtn, .postScoopBtn, .editScoopBtn').on('click',function() {
      isActive = false;
    });
  } else if (type === 'scoopEdit' || type === 'scoopPost') {
    // 判斷如果是scoopEdit、scoopPost，送出返回按鈕跳轉網頁不會登出
    $('.editBtn-sendOut, .backToScoopBtn').on('click',function() {
      isActive = false;
    });
  }
  
  // 排除sideBar及搜尋按鈕
  $('.sideBarBtn, .sideBarBtn-1, .searchBtn, .rwdSideBar a').on('click',function() {
    isActive = false;
  });
  
  // 排除組合鍵，只針對command+R、F5、ctrl+R
  $(window).on('keydown', function(e) {
    if(e.code === 'F5') {
      console.log('這是f5');
      isActive = false;
    } else if (e.metaKey && e.code === 'KeyR') {
      isActive = false;
    } else if (e.ctrlKey && e.code === 'KeyR') {
      isActive = false;
    }
  });

  // 除了上述特例外，當網頁被強行關閉時，執行移除Api的驗證碼
  window.onbeforeunload = function () {
    if(!isActive) {
      isActive = true;
      return
    }

    deleteLoginData(userCode);
  }
}

//<------------------------------------------------------------------------------------------->