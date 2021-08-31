import { getAll_craw_article,getSearchbar_article } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,makePage,jsHide,removeApiDataForCloseBrowser } from './common/base';

const $input = $('.articleSearch');
const $searchBtn = $('.articleBtn');
const userCode = localStorage.getItem('code');

let numInit = 1//起始位置
let currentNum;
let articleIndex = 0;
let maxLen;
let apiArr = [];
let firstLoad = true;
let getInputValue;
let searchMode = false;
let page = 1;

// ------------------------------------------------ //


//-------|API|-------//
//GET Api取得所有文章
function getAllArticleData (offset){
  getAll_craw_article(`?limit=10&offset=${offset * 10 - 10}`)
    .then((res) => {
      const apiData = res.data;
      maxLen = Math.ceil(Number(res.data.count)/10)
      console.log('maxlen111',maxLen)
      apiArr = apiData.results;
      updateInfo(apiData.results);
      if(firstLoad) {
        makePage(numInit,maxLen);
      }
      firstLoad = false;
    })
    .catch((err) => {
      alert('取得文章有誤，請回報管理員');
    })
}

//GET Api搜尋網路文章關鍵字
function getSearchArticleData(word) {
  getSearchbar_article(`?limit=10&page=${page}&size=10&search=${word}`)
  .then((res) => {
    const apiData = res.data;
    maxLen = Math.ceil(Number(res.data.count)/10);
    apiArr = apiData.results;
    console.log('SearchApiArr',apiArr);
    updateInfo(apiData.results);
    makePage(currentNum,maxLen);
  })
  .catch((err) => {
    alert('搜尋會員有誤，請回報管理員');
  })
}

// ------------------------------------------------ //
//使用搜尋關鍵字找網路文章
function searchArticle () {
  $searchBtn.on('click', function() {
    searchMode = true;
    currentNum = 1;
    page = 1;
    getInputValue = $input.val();
    getSearchArticleData(getInputValue);
    //預設搜尋得到結果後顯示第一頁
    $input.val(''); 
  })
}

//透過api更新文章
function updateInfo (data) {
  //若API資料小於10，先將多餘欄位增加class再導入資料
  //若資料正常則取消class並導入資料
  if(data.length < 10) {
    jsHide(data.length,'article')
  } 

  // 查詢錯誤顯示設定
  if (data.length === 0) {
    $('.wrongSearch').css('display','inline-block');
    $('.wrongSearch').text(`查詢無“${getInputValue}”資料！`);
  } else {
    $('.wrongSearch').css('display','none');
  }

  //導入Api資料
  for (let i = 0; i < data.length; i = i + 1) {
    $(`.article-${i + 1}`).removeClass('js-hide')
    $(`.article-${i + 1} .span-1`).text(data[i].id)
    $(`.article-${i + 1} .span-2`).text(data[i].title)
    $(`.article-${i + 1} .span-3`).text(data[i].tag)
    $(`.article-${i + 1} .span-4`).text(data[i].origin)
    $(`.article-${i + 1} .infoBtn`).attr('article-index',i);
  }
}

//透過api更新更多內容
function updateMoreInfo(index) {
  $('.moreDetail-1').text(apiArr[index].id);
  $('.moreDetail-2').text(apiArr[index].title);
  $('.titleInput').attr('placeholder',apiArr[index].title);
  $('.titleInput').val(apiArr[index].title);
  $('.moreDetail-3').text(apiArr[index].date);
  $('.moreDetail-4').text(apiArr[index].tag);
  $('.tagInput').attr('placeholder',apiArr[index].tag);
  $('.tagInput').val(apiArr[index].tag);
  $('.moreDetail-5').text(apiArr[index].origin);
  $('.moreDetail-6').css('background-image',`url(${apiArr[index].thumbSrc})`);
  $('.moreDetail-7').text(apiArr[index].agree.length !== 0 ? apiArr[index].agree.length : 0);
  $('.moreDetail-8').text(apiArr[index].like.length !== 0 ? apiArr[index].like.length : 0);
  $('.moreDetail-9').text(apiArr[index].addBookmark.length !== 0 ? apiArr[index].addBookmark.length : 0);
  $('.moreDetail-10').attr('href',`https://${apiArr[index].domainName}`);
  $('.moreDetail-11').attr('href',apiArr[index].link);
}

//取得當前點擊頁碼
function getCurrentNum(target) {
  currentNum = Number(target.attr('data-value'))
  //當搜尋按鈕被點擊時，執行搜尋模式，欲回主顯示頁再從新點擊一次網路文章
  if(searchMode) {
    makePage(currentNum,maxLen)
    page = currentNum;
    getSearchArticleData(getInputValue);
  } else {
    makePage(currentNum,maxLen)
    getAllArticleData (currentNum)
  }
}

//取得當前點擊文章的流水號
function getArticleIndex (target) {
  articleIndex = Number(target.attr('article-index'));
  console.log('articleIndex',articleIndex);
  updateMoreInfo(articleIndex);
}

//點擊事件取得Value
function clickGetValue() {
  $('.infoBtn').on('click', function(){
    getArticleIndex($(this))
  });
  $('.pageLink').on('click', function(){
    getCurrentNum($(this))
  });
}

//登入登出驗證程序
removeApiDataForCloseBrowser('article',userCode);
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  console.log(value);
  switch (value) {
    case 'admin':
      getAllArticleData ();
      searchArticle();
      clickGetValue();
      break;
  
    default:
      break;
  }
});