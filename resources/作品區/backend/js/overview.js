import { getSearchbar_user,getAll_craw_article,getSearchbar_resume,getUser_data_list,getDoctor_data_list,putSearch_scoop_merge } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,removeApiDataForCloseBrowser } from './common/base';

const $newFourFlow = $('.newFourFlow');//下方顯示區
const $newUser = $('.newUser');//上方顯示區
const userCode = localStorage.getItem('code');

let currentType;//點擊切換標籤時傳入的type
//載入立即執行Api顯示現有數量，但不執行寫入資料
//讓預設寫入資料為：上方（會員）、下方（網路文章，避免api載入速度不同導致頁面呈現有問題故加此防護
let firstLoad = true;


console.log('%c 新建的api醫師及民眾沒有authData（無法點擊會員直接連到官網然後是他的基本資料）、沒有最近加入的時間', 'color:red;font-size:30px');


//-------|API|-------//
//GET Api取得會員總數 allUser
function getAllUserCount() {
  getSearchbar_user('?search=').then((res) => {
    const apiData = res.data
    $('.user span').text(apiData.count)
  }).catch((err) => {
    alert('取得總會員失敗，請回報管理員');
  })
}

//GET Api 取得民眾資訊 userDataList
function getAllUserData() {
  getUser_data_list().then((res) => {
    const apiData = res.data;
    console.log(res,'res');
    $('.normal span').text(apiData.count);
    appendNewUserApiData(apiData.results);
    $('.normalBtn').addClass('js-select');

  }).catch((err) => {
    alert('取得一般會員失敗，請回報管理員');
  })
}

//GET Api 取得醫師資訊 doctDataList
function getAllDoctorData() {
  getDoctor_data_list().then((res) => {
    const apiData = res.data;
    $('.doctor span').text(apiData.count);
    if(!firstLoad) {
      appendNewUserApiData(apiData.results);
    }
  }).catch((err) => {
    alert('取得醫師會員失敗，請回報管理員');
  })
}

//GET Api 取得文章資料 article
function getAllArticleData() {
  getAll_craw_article('?limit=10').then((res) => {
    const apiData = res.data
    $('.article span').text(apiData.count)
    appendNewFourFlowApiData(apiData.results,'article')
    $('.articleBtn').addClass('js-select');
  }).catch((err) => {
    alert('取得文章失敗，請回報管理員');
  })
}

//GET Api 取得故事卡資料 resume
function getAllResumeData() {
  getSearchbar_resume('?search=').then((res) => {
    const apiData = res.data
    $('.resume span').text(apiData.results.length,'resume')
    if(!firstLoad) {
      appendNewFourFlowApiData(apiData.results,'resume');
    }
  }).catch((err) => {
    alert('取得故事卡失敗，請回報管理員');
  })
}

// GET Api取得所有專欄 scoop壞掉了
// PUT Api取得所有專欄 scoop
function putAllScoopData(word) {
  putSearch_scoop_merge(`?format=json&tag=${word}&size=5&page=1`, {type: 'date'})
  .then((res) => {
    const apiData = res.data
    console.log('apiData',apiData);
    $('.scoop span').text(apiData.count)
    if(!firstLoad) {
      appendNewFourFlowApiData(apiData,'scoop');
    }
    
  })
  .catch((err) => {
    alert('取得專欄失敗，請回報管理員');
  })
}

// ------------------------------------------------ //
//最新用戶
function appendNewUserApiData(data) {
  let showLen = data.length;
  console.log('showLen',showLen);
  $newUser.empty('li');
  if(showLen > 5) {
    showLen = 5
  }
  
  for(let i = 0; i < showLen; i = i + 1) {
    $newUser.append(`<li><span class="font-lg">${data[i].firstName + data[i].lastName}</span><span class="font-md">${data[i].email}</span><span class="font-sm">暫無</span></li>`);
  }
}

//最新文章
function appendNewFourFlowApiData(data,type) {
  const man = '先生';
  const girl = '小姐';
  let showLen = data.length;
  $newFourFlow.empty('li')
  if(showLen > 5) {
    showLen = 5
  }

  if(type === 'article') {
    for(let i = 0; i < showLen; i = i + 1) {
      $newFourFlow.append(`<li><a href="${data[i].link}" target="_blank"><span class="font-lg span-1">${data[i].title}</span><span class="font-lg span-2">${data[i].date}</span></a></li>`)
    }
  }
  
  if(type === 'resume') {
    for(let i = 0; i < showLen; i = i + 1) {
      let zhGender = data[i].gender === '0' ? man : girl;
      $newFourFlow.append(`<li><a href="https://xxx.tw/normal/${data[i].auth_id}/resume" target="_blank"><span class="font-lg span-1">${data[i].firstName + zhGender}的故事卡  ${data[i].cancertype + data[i].level}期</span><span class="font-lg span-2">${data[i].time_record}</span></a></li>`)
    }
  }
  
  if(type === 'scoop') {
    for(let i = 0; i < data.results.length; i = i + 1) {
      $newFourFlow.append(`<li><span class="font-lg span-1">${data.results[i].title}</span><span class="font-lg span-2">${data.results[i].date}</span></li>`);
    }
  }
}

//判斷左右兩邊選取中樣式哪個要取消
function addJsSelect(target,type) {
  let removeWhere
  if(type === 'left') {
    removeWhere = '.bannerLeft';
  } else {
    removeWhere = '.bannerRight';
  }
  $(`${removeWhere} .jsBtn`).removeClass('js-select');
  target.addClass('js-select');
}

//獲取當前取得的標籤
function getCurrentType(target) {
  currentType = target.attr('data-type');
  firstLoad = false;
  switch(currentType) {
    case 'normal':
      addJsSelect(target,'left')
      getAllUserData()
      break;

    case 'doctor':
      addJsSelect(target,'left')
      getAllDoctorData()
      break;

    case 'article':
      addJsSelect(target,'right')
      getAllArticleData();
      break;

    case 'resume':
      addJsSelect(target,'right')
      getAllResumeData();
      break;

    case 'qa':
      // addJsSelect(target,'right')
      alert('QA尚未完成');
      break;

    case 'scoop':
      addJsSelect(target,'right')
      putAllScoopData('');
      break;

    default:
      break;
  }
}

//類別標籤點擊選擇
$('.buttonArea button').on('click',function() {
  getCurrentType($(this));
})

//登入登出驗證程序
removeApiDataForCloseBrowser('overview',userCode);
popupLogoutProcess(userCode,900,30)

const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      getAllUserCount();
      getAllDoctorData();
      getAllResumeData();
      putAllScoopData('');
      window.onload = getAllUserData(),getAllArticleData();
      break;
  
    default:
      break;
  }
});