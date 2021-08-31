import { postScoop_info,postScoop_origin,postScoop_status } from './common/restapi';
import { getTime_now } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,removeApiDataForCloseBrowser } from './common/base';
import autosize from 'autosize';
import Sortable from 'sortablejs';

const $addSourceBtn = $('.addSourceBtn');//新增出處按鈕
const $addSectionBtn = $('.addSectionBtn');//新增段落按鈕
const $previewBtn = $('.previewBtn'); //下一步按鈕
const $editBtn = $('.editBtn-sendOut'); //確認送出按鈕
const $sectionList = $('#sectionList');//段落區
const $sourceList = $('#sourceList ul');//出處區
const userCode = localStorage.getItem('code');
const $contentArea = $('.bannerBt');
const $originArea = $('.bannerTp');

//拖拉變更段落的按鈕SVG
const moverIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-move dragIcon dragHandle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/></svg>';

let scoopTitleValue;//文章標題input的值
let scoopAuthorValue;//文章作者input的值
let scoopTypeValue;//文章類別input的值
let scoopEditorValue;//文章編輯input的值
let sourceList = [];//出處修改後的物件推入此陣列，以便後續使用
let sectionList = [];//段落修改後的物件推入此陣列，以便後續使用
let sourceIndex;//判斷欲刪除的序列
let sourceLen;//輔助判斷欲刪除的序列
let sectionIndex;//計算段落順序及欲刪除某段落的變數
let sectionLen;//用於判斷新增段落長度，輔助計算段落順序
let afterStatus;//取得文章修改後 基本資料
let afterOrigin;//取得文章修改後 出處
let afterContent = [];//取得文章修改後 段落
let contentCheckOk = false;//確認更新同步設置避免還沒更新完就轉回主頁
let originCheckOk = false;//確認更新同步設置避免還沒更新完就轉回主頁


window.onbeforeunload = function(e){
 return ""
}

//POST 新增文章Api
function postScoopStatusApi(statusData) {
  console.log('statusData.tag',statusData);
  getTime_now('').then((res) => {
    const apiData = res.data;
    
    postScoop_status('/',{
      "author": `${statusData.author}`,
      "editor": `${statusData.editor}`,
      "tag": `${statusData.tag}`,
      "title": `${statusData.title}`,
      "date": `${apiData}`
    })
    .then((res) => {
      console.log('res',res);
      const apiData = res.data.id;
      postScoopContentApi(afterContent,apiData);
      postScoopOriginApi(afterOrigin,apiData);
    })
    .catch((err) => {
      alert('新增文章遇到問題，請回報管理員');
    })
  }).catch((err) => {})
}

// POST Api新增內文段落
function postScoopContentApi(sectionData,scoopId) {
  if(!sectionData.length) {
    checkEditOk('contentCheck');
  } else {
    for(let i = 0; i < sectionData.length; i = i + 1) {
      postScoop_info(`?pk=${scoopId}&index=${sectionData[i].index}`,{
        "scoop_id": `${scoopId}`,
        "index": `${sectionData[i].index}`,
        "header": `${sectionData[i].header}`,
        "info": `${sectionData[i].info}`
      })
      .then((res) => {
        if(i + 1 === sectionData.length) {
          checkEditOk('contentCheck');
        }
      })
      .catch((err) => {
        alert(`段落第${sectionData[i].index}段，新增有誤請回報管理員`);
      });
    }
  }
}

// POST Api新增出處
function postScoopOriginApi(originData,scoopId) {
  if(!originData.length) {
    checkEditOk('originCheck');
  } else {
    for(let i = 0; i < originData.length; i = i + 1) {
      postScoop_origin(`?scoop_id=${scoopId}`,{
        "scoop_id": `${scoopId}`,
        "name": `${originData[i].name}`,
        "url": `${originData[i].url}`
      })
      .then((res) => {
        console.log('originData.length',originData.length)
        if(i + 1 === originData.length) {
          checkEditOk('originCheck');
        }
      })
      .catch((err) => {
        alert('出處新增有誤請回報管理員');
      });
    }
  }
}

//-------|API|-------//
//取得變更後文章的值
function getEditValuePreview() {
  scoopTitleValue = $('.scoopText-tp-1').val();
  scoopAuthorValue = $('.scoopText-tp-2').val();
  scoopTypeValue= $('.scoopText-tp-3').val();
  scoopEditorValue = $('.scoopText-tp-4').val();

  //文章基本資料
  let statusObj = {
    author: "",//文章作者
    tag: "",//文章類別
    editor: "",//文章整理人
    title: ""//文章大標題
  }

  statusObj.title = scoopTitleValue;
  statusObj.author = scoopAuthorValue;
  statusObj.tag = scoopTypeValue;
  statusObj.editor = scoopEditorValue;
  
  //出處說明
  for(let i = 0; i < $('.bannerTp section').length;i = i + 1) {
    let sourceObj = {
      name: "",//網址名稱
      url: ""//網址
    }

    sourceObj.name = $(`.secTp-${i + 1} .description`).val();
    sourceObj.url = $(`.secTp-${i + 1} .url`).val();
    sourceList.push(sourceObj);
  }

  //內文
  //index因後續在預覽時可以調整順序故此處也不設定
  for(let i = 0; i < $('.bannerBt section').length;i = i + 1) {
    let sectionObj = {
      header: "",//小標題
      info: "",//文章內容
      index: ""//段落順序
    }
    sectionObj.header = $(`.secBt-${i + 1} .header`).val();
    sectionObj.info = $(`.secBt-${i + 1} .info`).val();
    sectionList.push(sectionObj);
  }

  showPreview(statusObj,sourceList,sectionList)
}

//預覽顯示
function showPreview(statusData,sourceData,sectionData) {
  $('#sectionList .accordion-item').remove('div');
  $('#sourceList li').remove('li');
  let statusArr = Object.values(statusData);
  console.log('statusData',statusData);
  
  //文章基本資料
  statusArr.map((value, index) => {
    $(`.moreDetail-status-${index + 1}`).text(value);
  })

  //出處說明
  sourceData.map((value) => {
    $sourceList.append(`<li><a href="${value.url}">${value.name}</a></li>`)
  })

  //段落
  sectionData.map((value,index) => {
    console.log('value',value);
    $sectionList.append(`<div class="accordion-item" sectionIndex=${index}><div class="accordion-header"><button class="font-lg btn accordionBtn collapsed" type="button" data-bs-toggle="collapse" data-bs-target=".section-${index + 1}">${moverIcon}<h5 class="font-lg dragHandle">段落${index + 1}</h5></button><div class="accordion-collapse collapse section-${index + 1}"><ul class="font-md accordion-body"><li class="moreDetailLi flex-wrap"><div class="moreDetailTag"><h5 class="font-lg text-wrap">${value.header}</h5></div><div class="moreDetailSpace flex-column w-100"><span class="font-md">${value.info}</span></div></li></ul></div></div></div>`);
  })

  afterStatus = statusData;
  afterOrigin = sourceData;

  //拖拉段落plugin
  new Sortable($sectionList[0], {
    handle: '.dragHandle', //handle's class
    animation: 150
  });
}


//出處段落刪除清空
function originAndContentTool(target) {
  let deleteTpNum = target.attr('deletetpnum');//當前點擊要刪除 “出處”的流水號
  let deleteBtNum = target.attr('deletebtnum');//當前點擊要刪除 ”段落“的流水號
  let emptyTpNum = target.attr('emptytpnum');//當前點擊“出處”的流水號
  
  sourceIndex = $(`.bannerTp section`).length;
  sectionIndex = $(`.bannerBt section`).length;
  
  //清空出處
  $(`.secTp-${emptyTpNum} .description, .secTp-${emptyTpNum} .url`).val('');
  
  //刪除出處
  if(deleteTpNum < sourceIndex) {
    alert('請先刪除最下面的')
    return;
  } else {
    $(`.secTp-${deleteTpNum}`).remove('section');
    sourceIndex = sourceIndex - 1;
  }

  //刪除段落
  if(deleteBtNum < sectionIndex) {
    alert('請先刪除最下面的')
    return;
  } else {
    $(`.secBt-${deleteBtNum}`).remove('section');
    sectionIndex = sectionIndex - 1;
  }
}

//確認更新同步設置避免還沒更新完就轉回主頁
function checkEditOk(string) {
  console.log('string',string);
  switch (string) {
    case 'contentCheck':
      contentCheckOk = true;
      console.log('contentCheckOk',contentCheckOk);
      break;

    case 'originCheck':
      originCheckOk = true;
      console.log('originCheckOk',originCheckOk);
      break;
  
    default:
      break;
  }

  if(contentCheckOk && originCheckOk) {
    console.log('編輯完成')
    window.location.href=`${SERVER_DOMAIN}/scoop.html`;
  }
}

//點擊執行
function clickGetValue() {
  //段落出處刪除清空，取得當前點擊的值
  $('body').on('click', '.emptyBtn, .deleteBtn' ,function() {
    originAndContentTool($(this));
  });

  //點擊下一步後，取得網路文章的值並於預覽畫面顯示
  $previewBtn.on('click', function() {
    //先清空資料避免重複增加
    sectionList = [];
    sourceList = [];
    getEditValuePreview();
  });

  //新增出處說明
  $addSourceBtn.on('click', function() {
    sourceLen = $('.bannerTp section').length;
    sourceIndex = sourceLen + 1;
    $originArea.append(`<section class="sec secTp-${sourceIndex}"><div class="originList"><span class="font-lg originList-num">${sourceIndex}</span></div><div class="origin"><div class="originDescription"> <input class="font-md form-control description" type="text" placeholder="請填入出處說明"/></div><div class="originUrl"><textarea class="font-md form-control url" type="text" placeholder="請填入出處網址"></textarea></div></div><div class="originToolBtn"><div class="font-md btn emptyBtn" emptyTpNum="${sourceIndex}" type="button"><span class="font-md">清空</span></div><div class="font-md btn deleteBtn" deleteTpNum="${sourceIndex}" type="button"> <span class="font-md">刪除</span></div></div></section>`);
    autosize($('textarea'));
  });
  
  //新增段落
  $addSectionBtn.on('click', function() {
    sectionLen = $('.bannerBt section').length;
    sectionIndex = sectionLen + 1;
    $contentArea.append(`<section class="sec secBt-${sectionIndex}"><div class="infoList"><div class="infoList-num"><span class="font-lg">段落${sectionIndex}</span></div><div class="font-md btn deleteBtn" deletebtnum="${sectionIndex}" type="button">刪除</div></div></div><div class="content-header"><h5 class="font-lg">小標</h5><input class="font-md form-control header" type="text" placeholder="無小標題可跳過"/></div><div class="content"><h5 class="font-lg">內文</h5><textarea class="font-md form-control info" type="text" placeholder="請填寫段落文章"></textarea></div></section>`);
    // $contentArea.append(`<section class="sec secBt-${sectionIndex}"><div class="infoList"><div class="infoList-num"><span class="font-lg">段落${sectionIndex}</span></div><div class="font-md btn deleteBtn" deletebtnum="${sectionIndex}" type="button">刪除</div></div><div class="scoopInfoImg-top"><div class="scoopImg"><span class="font-sm">上方圖片</span><figure></figure></div><div class="scoopUploadBtn scoopUploadBtn-top"><div class="font-md btn upLoadImgBtn" data-bs-toggle="modal" data-bs-target="#upload_img_modal" data-bs-whatever="upload_img_modal" imglocation="img_up" imgindex="${sectionIndex}">編輯</div><div class="font-md btn deleteImgBtn" imglocation="img_up" imgindex="${sectionIndex}">刪除</div></div></div><div class="scoopInfoImg-down"><div class="scoopImg"><span class="font-sm">下方圖片</span><figure></figure></div><div class="scoopUploadBtn scoopUploadBtn-down"><div class="font-md btn upLoadImgBtn" data-bs-toggle="modal" data-bs-target="#upload_img_modal" data-bs-whatever="upload_img_modal" imglocation="img_down" imgindex="${sectionIndex}">編輯</div><div class="font-md btn deleteImgBtn" imglocation="img_down" imgindex="${sectionIndex}">刪除</div></div></div><div class="content-header"><h5 class="font-lg">小標</h5><input class="font-md form-control header" type="text" placeholder="無小標題可跳過"/></div><div class="content"><h5 class="font-lg">內文</h5><textarea class="font-md form-control info" type="text" placeholder="請填寫段落文章"></textarea></div></section>`);
    autosize($('textarea'));
  });

  //確認送出按鈕
  $editBtn.on('click', function () {
    let finalArrResult = [];//最終段落順序

    //若使用者在預覽模式調整段落順序，在此更新最終順序
    for(let i = 0; i < $(`#sectionList .accordion-item`).length; i = i + 1) {
      //先取預覽模式accordion-item每段落sectionIndex的值
      //依照變更後陳列的順序，推入finalArrResult陣列中
      finalArrResult.push(`${$('#sectionList .accordion-item')[i].attributes[1].value}`);

      //透過上層陣列(finalArrResult)的順序
      //依照最終欲呈現的順序，選取sectionList[]帶入上層陣列(finalArrResult)的值
      //推入最終欲修改的陣列(afterContent)
      afterContent.push(sectionList[finalArrResult[i]]);

      //賦予api段落所需的index(段落順序)值
      afterContent[i].index = i + 1;
    }
    postScoopStatusApi(afterStatus);
  });
}

//登入登出驗證程序
removeApiDataForCloseBrowser('scoopPost',userCode);
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      clickGetValue();
      break;
  
    default:
      break;
  }
});