import autosize from 'autosize';
import Sortable from 'sortablejs';
import { getLoad_status,getLoad_content,getLoad_origin,getTime_now } from './common/restapi';
import { putScoop_status,putScoop_status_upload,putScoop_info,putScoop_info_upload,putScoop_origin } from './common/restapi';
import { postScoop_info,postScoop_origin } from './common/restapi';
import { deleteScoop_thumb_upload,deleteScoop_info,deleteScoop_origin } from './common/restapi';
import { getScoop_info_upload,deleteScoop_info_upload } from './common/restapi';//刪除圖片下/上
import { popupLogoutProcess,checkKeepLoginOnLoad,removeApiDataForCloseBrowser } from './common/base';

const $addSourceBtn = $('.addSourceBtn');//新增出處按鈕
const $addSectionBtn = $('.addSectionBtn');//新增段落按鈕
const $previewBtn = $('.previewBtn'); //下一步按鈕
const $editBtn = $('.editBtn-sendOut'); //確認送出按鈕
const $sectionList = $('#sectionList');//段落區
const $sourceList = $('#sourceList ul');//出處區
const $scoopTitle = $('.scoopTitle input');//文章標題
const $scoopAuthor = $('.scoopAuthor input');//文章作者
const $scoopType = $('.scoopType input');//文章類別
const $scoopEditor = $('.scoopEditor input');//文章編輯
const userCode = localStorage.getItem('code');
const $contentArea = $('.bannerBt');
const $originArea = $('.bannerTp');
const $popUpImgTitle = $('#upload_img_modal .modal-title');
const modalImgPreview = new bootstrap.Modal(document.getElementById('imgPreview'), {})
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
let beforeOrigin;//取得文章修改前 出處
let beforeContent;//取得文章修改前 段落
let afterStatus;//取得文章修改後 基本資料
let afterOrigin;//取得文章修改後 出處
let afterContent = [];//取得文章修改後 段落
let scoopId = location.search;//先第一步取得id(?pk=)透過Api導入資料，後續會有第二次的變更為純數字
let statusCheckOk = false;//確認更新同步設置避免還沒更新完就轉回主頁
let contentCheckOk = false;//確認更新同步設置避免還沒更新完就轉回主頁
let originCheckOk = false;//確認更新同步設置避免還沒更新完就轉回主頁

window.onbeforeunload = function(e){
 return ""
}

//GET Api取得指定文章的資料
function getMoreDetail(pk) {
  console.log(pk);
  getLoad_status(`${pk}`)
  .then((res) => {
    const apiData = res.data;
    scoopId = apiData.id;//將scoopId變更為數字而非 “?pk={id}”
    updateStatus(apiData)
  })
  .catch((err) => {
    alert('取得基本資料有誤請回報管理員');
  })
  
  getLoad_content(`${pk}`)
  .then((res) => {
    const apiData = res.data.results;
    beforeContent = apiData;
    updateContent(apiData);
  })
  .catch((err) => {
    alert('取得段落有誤請回報管理員');
  })
  
  getLoad_origin(`${pk}`)
  .then((res) => {
    const apiData = res.data;
    beforeOrigin = apiData;
    updateOrigin(apiData);
  })
  .catch((err) => {
    alert('取得出處有誤請回報管理員');
  })
}

//PUT Api 編輯文章基本資料
function editScoopStatusApi(statusData) {
  getTime_now('').then((res) => {
    const apiTime = res.data;
    putScoop_status(`?pk=${scoopId}`,{
      "author":`${statusData.author}`,
      "editor":`${statusData.editor}`,
      "id":`${statusData.id}`,
      "tag":`${statusData.tag}`,
      "title":`${statusData.title}`
    }).then((res) => {
      checkEditOk('statusCheck');
    }).catch((err) => {    
      alert('基本資料修改有誤請回報管理員');
    });
  }).catch((err) => {})
  
}

//PUT 編輯基本資料縮圖
function editScoopStatusThumbUpload(uploadData) {
  let fileType = 'jpg';
  if (uploadData.type === 'image/jpeg') {
    fileType = 'jpg';
  } else if (uploadData.type === 'image/png') {
    fileType = 'png';
  }
  const formData = new FormData();
  formData.append(
    uploadData.name,
    uploadData.file,
    `sp_${uploadData.path}.${fileType}`,
  );
  console.log('uploadData',uploadData);
  putScoop_status_upload(`?pk=${scoopId}&index=1`, formData, {
    headers: {
      'content-Type': 'multipart/form-data',
    },
  }).then((res) => {
    let spThumbSrcLink = 'sp_' + uploadData.path + '.' + fileType;
    console.log('spThumbSrcLink',spThumbSrcLink);
    console.log(res);
    $('.spThumbSrcImg figure').css('background-image',`url(/media/scoop/thumb/${spThumbSrcLink}`);
    $('.spThumbSrcImg span').text(`thumb/${spThumbSrcLink}`);
  }).catch((err) => {
    alert('基本資料編輯縮圖有誤請回報管理員');
  })
}

//POST&PUT&DELETE Api編輯出處 區分為 1.新增狀態 2.刪除狀態 3.不變狀態
function editScoopOriginApi(originData) {
  //1.新增狀態：要上傳的出處數量 > 原本的出處數量
  if(originData.length > beforeOrigin.length) {
    //計算要多了幾個，並將出處的內容一同帶入執行 POST Api
    for(let i = beforeOrigin.length; i < originData.length; i = i + 1) {
      postScoop_origin(`?scoop_id=${scoopId}`,{
        "scoop_id": `${scoopId}`,
        "name":`${originData[i].name}`,
        "url":`${originData[i].url}`
      })
      .then((res) => {
        if(!beforeOrigin.length) {
          checkEditOk('originCheck');
        }
      })
      .catch((err) => {
        alert('出處新增有誤請回報管理員');
      });
    }
    //不管其他的出處內容有沒有變更，全部在PUT的重新覆蓋(排除新增的出處)
    for(let i = 0;i < beforeOrigin.length;i = i + 1) {
      putScoop_origin(`?pk=${beforeOrigin[i].id}`, {
        "name":`${originData[i].name}`,
        "url":`${originData[i].url}`
      }).then((res) => {
        if(i + 1 === beforeOrigin.length) {
          checkEditOk('originCheck');
        }
      })
      .catch((err) => {
        alert('出處修改有誤請回報管理員');
      });
    }

  //2.刪除狀態：要上傳的出處數量 < 原本的出處數量
  } else if (originData.length < beforeOrigin.length) {
    for(let i = originData.length; i < beforeOrigin.length; i = i + 1) {
      deleteScoop_origin(`?pk=${beforeOrigin[i].id}`,{
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => {})
      .catch((err) => {
        alert('出處刪除有誤請回報管理員');
      });      
    }

    //不管其他的出處內容有沒有變更，全部在PUT的重新覆蓋(排除刪除的出處)
    if(!originData.length) {
      checkEditOk('originCheck');
    } else {
      for(let i = 0;i < originData.length;i = i + 1) {
        putScoop_origin(`?pk=${beforeOrigin[i].id}`, {
          "name":`${originData[i].name}`,
          "url":`${originData[i].url}`
        }).then((res) => {
          if(i + 1 === originData.length) {
            checkEditOk('originCheck');
          }
        })
        .catch((err) => {
          alert('出處修改有誤請回報管理員');
        });
      }
    }
  //3.不變狀態：要上傳的出處數量 ＝ 原本的出處數量
  } else {
    if(!originData.length) {
      checkEditOk('originCheck');
    } else {
      for(let i = 0;i < originData.length;i = i + 1) {
        putScoop_origin(`?pk=${beforeOrigin[i].id}`, {
          "name":`${originData[i].name}`,
          "url":`${originData[i].url}`
        }).then((res) => {
          if(i + 1 === originData.length) {
            checkEditOk('originCheck');
          }
        })
        .catch((err) => {
          alert('出處修改有誤請回報管理員');
        });
      }
    }
  }
}

//POST&PUT&DELETE Api編輯內文段落 區分為 1.新增狀態 2.刪除狀態 3.不變狀態
function editScoopContentApi(sectionData) {
  //1.新增狀態：要上傳的段落數量 > 原本的段落數量
  if(sectionData.length > beforeContent.length) {
    //計算要新增幾次，並執行POST Api，再將POST得到的id帶入最終變更資料的陣列中
    for(let i = beforeContent.length; i < sectionData.length; i = i + 1) {
      postScoop_info(`?pk=${scoopId}&index=${sectionData[i].index}`,{
        "scoop_id": `${scoopId}`,
        "index": `${sectionData[i].index}`,
        "header":`${sectionData[i].header}`,
        "info":`${sectionData[i].info}`
      })
      .then((res) => {
        if(!beforeContent.length) {
          checkEditOk('contentCheck');
        }
      }).catch((err) => {
        alert('段落新增有誤請回報管理員');
      });
    }
    for(let i = 0;i < beforeContent.length;i = i + 1) {
      putScoop_info(`?scoop_id=${scoopId}&index=${sectionData[i].index}`, {
        "header":`${sectionData[i].header}`,
        "info":`${sectionData[i].info}`
      }).then((res) => {
        if(i + 1 === beforeContent.length) {
          checkEditOk('contentCheck');
        }
      })
      .catch((err) => {
        alert('段落修改有誤請回報管理員');
      });
    }
  } else if (sectionData.length < beforeContent.length) {
    //2.刪除狀態：要上傳的段落數量 < 原本的段落數量
    for(let i = sectionData.length; i < beforeContent.length; i = i + 1) {
      deleteScoop_info(`?scoop_id=${scoopId}&index=${beforeContent[i].index}`,{
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => {})
      .catch((err) => {
        alert('段落刪除有誤請回報管理員');
      });
    }
    if(!sectionData.length) {
      checkEditOk('contentCheck');
    } else {
      for(let i = 0;i < sectionData.length;i = i + 1) {
        putScoop_info(`?scoop_id=${scoopId}&index=${sectionData[i].index}`, {
          "header":`${sectionData[i].header}`,
          "info":`${sectionData[i].info}`
        }).then((res) => {
          if(i + 1 === sectionData.length) {
            checkEditOk('contentCheck');
          }
        })
        .catch((err) => {
          alert('段落修改有誤請回報管理員');
        });
      }
    }
  } else {
    //3.不變狀態：要上傳的段落數量 ＝ 原本的段落數量
    if(!sectionData.length) {
      checkEditOk('contentCheck');
    } else {
      for(let i = 0;i < sectionData.length;i = i + 1) {
        putScoop_info(`?scoop_id=${scoopId}&index=${sectionData[i].index}`, {
          "header":`${sectionData[i].header}`,
          "info":`${sectionData[i].info}`
        }).then((res) => {
          if(i + 1 === sectionData.length) {
            checkEditOk('contentCheck');
          }
        })
        .catch((err) => {
          alert('段落修改有誤請回報管理員');
        });
      }
    }
  }
}

//PUT 編輯內文圖片
function editScoopInfoImgLoad(uploadData,imgIndex,location) {
  let fileType = 'jpg';
  if (uploadData.type === 'image/jpeg') {
    fileType = 'jpg';
  } else if (uploadData.type === 'image/png') {
    fileType = 'png';
  }

  const formData = new FormData();
  formData.append(
    uploadData.name,
    uploadData.file,
    `sp_${uploadData.path}.${fileType}`,
  );
  // console.log('uploadData',uploadData);
  // console.log('uploadData',uploadData);
  putScoop_info_upload(`?pk=${scoopId}&index=${imgIndex}`, formData, {
    headers: {
      'content-Type': 'multipart/form-data',
    },
  })
  .then((res) => {
    // let infoImgLink;
    let apiData = res.data
    if(location === 'img_up') {
      // infoImgLink = apiData.img_up;
      let spInfoUpSrcLink = 'sp_' + uploadData.path + '.' + fileType;
      // $('.spThumbSrcImg figure').css('background-image',`url(/media/scoop/thumb/${spThumbSrcLink}`);
      $(`.secBt-${imgIndex} .scoopInfoImg-top figure`).css('background-image',`url(/media/scoop/block/${spInfoUpSrcLink})`);
      $(`.secBt-${imgIndex} .scoopInfoImg-top span`).text(`block/${spInfoUpSrcLink}`);
    } else if (location === 'img_down') {
      let spInfoDownSrcLink = 'sp_' + uploadData.path + '.' + fileType;
      // infoImgLink = apiData.img_down;
      $(`.secBt-${imgIndex} .scoopInfoImg-down figure`).css('background-image',`url(/media/scoop/block/${spInfoDownSrcLink})`);
      $(`.secBt-${imgIndex} .scoopInfoImg-down span`).text(`block/${spInfoDownSrcLink}`);
    }
   
  }).catch((err) => {
    console.log('err',err);
    // alert('編輯內文圖片有誤請回報管理員');
  })
}

//-------|API|-------//
//產生基本資料
function updateStatus(statusData) {
  $scoopTitle.val(statusData.title);
  $scoopAuthor.val(statusData.author_id);
  $scoopType.val(statusData.tag);
  $scoopEditor.val(statusData.editor);
  
  //如果有圖片載入，若無值預設使用無圖便img
  if(statusData.spThumbSrc) {
    $('.spThumbSrcImg figure').css('background-image',`url(/media/${statusData.spThumbSrc})`);
    $('.spThumbSrcImg span').text(statusData.spThumbSrc);
  }
}

//產生出處說明
function updateOrigin(originData) {
  for(let i = 0; i < originData.length; i = i + 1) {
    $originArea.append(`<section class="sec secTp-${i + 1}"><div class="originList"><span class="font-lg originList-num">${i + 1}</span></div><div class="origin"><div class="originDescription"> <input class="font-md form-control description" type="text" placeholder="請填入出處說明"/></div><div class="originUrl"><textarea class="font-md form-control url" type="text" placeholder="請填入出處網址"></textarea></div></div><div class="originToolBtn"><div class="font-md btn emptyBtn" emptyTpNum="${i + 1}" type="button"><span class="font-md">清空</span></div><div class="font-md btn deleteBtn" deleteTpNum="${i + 1}" type="button"> <span class="font-md">刪除</span></div></div></section>`);
    $(`.secTp-${i + 1} .description`).val(originData[i].name);
    $(`.secTp-${i + 1} .url`).val(originData[i].url);
  }
  autosize($('textarea'));
}

//產生內文
function updateContent(contentData) {
  for(let i = 0; i < contentData.length; i = i + 1) {
    $contentArea.append(`<section class="sec secBt-${i + 1}"><div class="infoList"><div class="infoList-num"><span class="font-lg">段落${i + 1}</span></div><div class="font-md btn deleteBtn" deletebtnum="${i + 1}" type="button">刪除</div></div><div class="scoopInfoImg-top"><div class="scoopImg"><span class="font-sm">上方圖片</span><figure></figure></div><div class="scoopUploadBtn scoopUploadBtn-top"><div class="font-md btn upLoadImgBtn" data-bs-toggle="modal" data-bs-target="#upload_img_modal" data-bs-whatever="upload_img_modal" imglocation="img_up" imgindex="${i + 1}">編輯</div><div class="font-md btn deleteImgBtn" imglocation="img_up" imgindex="${i + 1}">刪除</div></div></div><div class="scoopInfoImg-down"><div class="scoopImg"><span class="font-sm">下方圖片</span><figure></figure></div><div class="scoopUploadBtn scoopUploadBtn-down"><div class="font-md btn upLoadImgBtn" data-bs-toggle="modal" data-bs-target="#upload_img_modal" data-bs-whatever="upload_img_modal" imglocation="img_down" imgindex="${i + 1}">編輯</div><div class="font-md btn deleteImgBtn" imglocation="img_down" imgindex="${i + 1}">刪除</div></div></div><div class="content-header"><h5 class="font-lg">小標</h5><input class="font-md form-control header" type="text" placeholder="無小標題可跳過"/></div><div class="content"><h5 class="font-lg">內文</h5><textarea class="font-md form-control info" type="text" placeholder="請填寫段落文章"></textarea></div></section>`);
    $(`.secBt-${i + 1} .header`).val(contentData[i].header)
    $(`.secBt-${i + 1} .info`).val(contentData[i].info)

    if(contentData[i].img_up) {
      $(`.secBt-${i + 1} .scoopInfoImg-top figure`).css('background-image',`url(/media/${contentData[i].img_up})`)
      $(`.secBt-${i + 1} .scoopInfoImg-top span`).text(contentData[i].img_up);
    }

    if(contentData[i].img_down) {
      $(`.secBt-${i + 1} .scoopInfoImg-down figure`).css('background-image',`url(/media/${contentData[i].img_down})`)
      $(`.secBt-${i + 1} .scoopInfoImg-down span`).text(contentData[i].img_down);
    }
  }
  autosize($('textarea'));
}

//取得變更後文章的值
function getEditValuePreview() {
  scoopTitleValue = $('.scoopText-tp-1').val();
  scoopAuthorValue = $('.scoopText-tp-2').val();
  scoopTypeValue= $('.scoopText-tp-3').val();
  scoopEditorValue = $('.scoopText-tp-4').val();

  //文章基本資料
  let statusObj = {
    id: `${scoopId}`,//文章編號
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
    $sectionList.append(`<div class="accordion-item" sectionIndex=${index}><div class="accordion-header"><button class="font-lg btn accordionBtn collapsed" type="button" data-bs-toggle="collapse" data-bs-target=".section-${index + 1}">${moverIcon}<h5 class="font-lg dragHandle">段落${index + 1}</h5></button><div class="accordion-collapse collapse section-${index + 1}"><ul class="font-md accordion-body"><li class="moreDetailLi flex-wrap"><div class="moreDetailTag"><h5 class="font-lg text-wrap">${value.header}</h5></div><div class="moreDetailSpace flex-column w-100"><span class="font-md">${value.info}</span></div></li></ul></div></div></div>`);
  })

  afterStatus = statusData;
  afterOrigin = sourceData;
  
  //拖拉段落plugin
  new Sortable($sectionList[0], {
    // handle: '.accordion-item ', //handle's class
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

//上傳圖片
function upload_img(target) {
  let imgLocation = target.attr('imgLocation'); //取得當前點擊的位置
  let imgIndex = target.attr('imgIndex'); //取得當前點擊的序列
  let currentUploadLocation = document.getElementById('scoopImg-upLoad');
  //取消上傳按鈕點擊清空內容
  $('.uploadImgBtn-close').off('click').on('click', function(){
    currentUploadLocation.value = '';
    $('.imgNewTitle').val('');
  });
  
  //popup標題文字變更
  if(imgLocation === 'spThumbSrc') {
    $popUpImgTitle.text('上傳縮圖');
  } else if(imgLocation === 'img_up') {
    $popUpImgTitle.text(`上傳段落${imgIndex} 上方圖片`);
  } else {
    $popUpImgTitle.text(`上傳段落${imgIndex} 下方圖片`);
  }

  //上傳網址按鈕點擊(jquery click事件在相同位置上會被綁定，所以需要off來註銷綁定位置)
  $('.uploadImgBtn-sendOut').off('click').on('click', function(){
    //防呆，不得傳送空值
    if(!currentUploadLocation.value) {
      alert('沒有上傳圖片');
      return;
    }
    
    //第一層判斷，指定檔案類型(jpg/png)
    if (currentUploadLocation.files[0].type === '' || currentUploadLocation.files[0].type === 'image/jpeg' || currentUploadLocation.files[0].type === 'image/png') {
      const _URL = window.URL || window.webkitURL;
      const img = new Image();
      img.src = _URL.createObjectURL(currentUploadLocation.files[0]);
      img.onload = function () {
        const imgWidth = this.width;
        const imgHeight = this.height;
        let $imgNewTitle = $('.imgNewTitle').val(); //改名字的地方

        //第二層判斷，容量大小(1mb)
        if (currentUploadLocation.files[0].size < (1000 * 1024)) {

          //第三層判斷，尺寸(1600*903)
          if (imgWidth === 1600 && imgHeight === 903) {
            let newPassFile = {
              name: `${imgLocation}`,
              file: currentUploadLocation.files[0],
              type: currentUploadLocation.files[0].type,
              path: $imgNewTitle,
            }
            //最終結果導向指定的api執行編輯或移除
            editScoopStatusThumbUpload(newPassFile);
            
            //清空以待下次使用
            currentUploadLocation.value = '';
            $('.imgNewTitle').val('');
          } else if(imgWidth === 2000 && imgHeight === 1200) {
            let newPassFile = {
              name: `${imgLocation}`,
              file: currentUploadLocation.files[0],
              type: currentUploadLocation.files[0].type,
              path: $imgNewTitle,
            }

            //最終結果導向指定的api執行編輯或移除
            editScoopInfoImgLoad(newPassFile,imgIndex,imgLocation);
            
            //清空以待下次使用
            currentUploadLocation.value = '';
            $('.imgNewTitle').val('');
          } else {
            alert('尺寸不符合規定縮圖須為1600x903、段落圖片須為2000x1200', imgWidth, imgHeight);
          }
        } else {
          alert('檔案過大，需小於1mb', `${currentUploadLocation.files[0].size/1000/1024}mb`);
        }
      }
    }
  })
}

//刪除圖片
function deleteImgApi(target) {
  let deleteImgLocation = target.attr('imgLocation'); //取得當前點擊的位置
  let deleteImgIndex = target.attr('imgIndex'); //取得當前點擊的序列

  if(deleteImgLocation === 'spThumbSrc') {
    deleteScoop_thumb_upload(`?pk=${scoopId}`,{
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "spThumbSrc":"",
      }
    })
    .then((res) => {
      $('.spThumbSrcImg span').text('');
      $('.spThumbSrcImg figure').css('background-image','url(../images/noImage.png)');
    })
    .catch((err) => {
      alert('刪除基本資料縮圖有誤請回報管理員');
    })

  } else if (deleteImgLocation === 'img_up') {
    deleteScoop_info_upload(`?pk=${scoopId}&index=${deleteImgIndex}`,{
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "img_up":"",
      }
    })
    .then((res) => {
      $(`.secBt-${deleteImgIndex} .scoopInfoImg-top span`).text('上方圖片');
      $(`.secBt-${deleteImgIndex} .scoopInfoImg-top figure`).css('background-image','url(../images/noImage.png)');
    })
    .catch((err) => {
      alert('刪除段落上圖有誤請回報管理員');
    })
  } else if (deleteImgLocation === 'img_down') {
    getScoop_info_upload(`?pk=${scoopId}&index=${deleteImgIndex}`)
    .then((res) => {
      $(`.secBt-${deleteImgIndex} .scoopInfoImg-down span`).text('下方圖片');
      $(`.secBt-${deleteImgIndex} .scoopInfoImg-down figure`).css('background-image','url(../images/noImage.png)');
    })
    .catch((err) => {
      alert('刪除段落下圖有誤請回報管理員');
    })
  }
}

//預覽圖片
function previewImgBig(target) {
  let previewUrl = target[0].childNodes[0].innerHTML;
  const $imgPreview = $('#imgPreview .img-fluid');
  const $imgTitle = $('#imgPreview .modal-title');
  $imgPreview.attr('src',`/media/${previewUrl}`)
  // console.log('previewUrl',previewUrl);
  $imgTitle.text('預覽圖片：' + previewUrl);
  modalImgPreview.show()
}

//確認更新同步設置避免還沒更新完就轉回主頁
function checkEditOk(string) {
  switch (string) {
    case 'statusCheck':
      statusCheckOk = true;
      break;

    case 'contentCheck':
      contentCheckOk = true;
      break;

    case 'originCheck':
      originCheckOk = true;
      break;
  
    default:
      break;
  }

  if(statusCheckOk && contentCheckOk && originCheckOk) {
    window.location.href=`${SERVER_DOMAIN}/scoop.html`;
  }
}

//點擊執行
function clickGetValue() {
  //預覽圖片
  $('body').on('click', '.scoopImg', function() {
    previewImgBig($(this));
  });

  //變更圖片
  $('body').on('click', '.upLoadImgBtn', function() {
    upload_img($(this));
  });

  //刪除圖片
  $('body').on('click', '.deleteImgBtn', function() {
    deleteImgApi($(this));
  });

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

    editScoopStatusApi(afterStatus);
    editScoopContentApi(afterContent);
    editScoopOriginApi(afterOrigin);
    
  });
}

//登入登出驗證程序
removeApiDataForCloseBrowser('scoopEdit',userCode);
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      getMoreDetail(scoopId);
      clickGetValue();
      break;
  
    default:
      break;
  }
});