import { getSearch_resume_detail,getSearchbar_resume} from './common/restapi'
import { deleteUpdate_drug,deleteUpdate_resume } from './common/restapi';
import { postUpdate_drug,postResume_outline } from './common/restapi';
import { putResume_load,purResume_bless,putUpdate_status,putUpdate_newlife,putUpdate_detect,putUpdate_cure,putUpdate_drug,putUpdate_diagnose } from './common/restapi';
import { popupLogoutProcess,checkKeepLoginOnLoad,makePage,jsHide,removeApiDataForCloseBrowser } from './common/base';
import autosize from 'autosize';

const $editBtn = $('.editBtn')
const $jsEditBefore = $('.jsEditBefore')
const $jsEditAfter = $('.jsEditAfter')
const $editBtnCancel = $('.editBtn-cancel')
const $editBtnSendOut = $('.editBtn-sendOut')
const $input = $('.resumeSearch');
const $searchBtn = $('.resumeBtn');
const $addNewResume = $('#addResume .addBtn');
const $deleteResumeBtn = $('#delete-modalBtn .delete-modalBtn');
const userCode = localStorage.getItem('code');

let numInit = 1//分頁標籤起始位置
let resumeAuthId;//紀錄當下點擊的故事卡會員id
let currentNum;//當前點擊頁碼的數字
let maxLen;//頁碼的最大值
let firstLoad = true;//第一次載入網頁預設頁碼為起始位置
let nameTitle;
let getInputValue;//取得搜尋欄位的值
let beforeChang;//會員編輯異動前
let afterChange;//會員編輯異動後
let drugPk;//新增藥物的流水號
let deleteDrugIndex;//指定欲刪除的藥物編號
let addResumeObj = {
  pk: "",
  card: "1",
  age: "",
  gender: "",
  cancertype: "",
  level: "",
  identity: "",
  family: "",
  myDoctor: ""
}

console.log('%c 1.新增刪除有保護 2.搜尋與顯示資料筆數不同', 'color:red;font-size:30px');
console.log('%c 2.資料庫共有12筆，但GET取得的資料僅4筆，正確要有12筆，詳見resume_status(不可以用PUT取得資料，沒有姓氏且必須回傳pk才有辦法取得資料)', 'color:red;font-size:16px');

//-------|API|-------//
//GET Api取得所有故事卡的（附加搜尋功能）1.主治醫師2.年齡3.病症類型
function getAllResumeData(tag) {
  getSearchbar_resume(`?search=${tag}`)
  .then((res) => {
    //console.log('正確取得顯示的api')
    const apiData = res.data;
    //這隻比較特別因為其他人有count，他沒有
    maxLen = Math.ceil(Number(apiData.results.length)/10);
    updateInfo(apiData.results)
    if(firstLoad) {
      makePage(numInit,maxLen);
    } else {
      makePage(currentNum,maxLen);
    }
    firstLoad = false;
  })
  .catch((err) => {
    alert('取得故事卡有誤，請回報管理員');
    // console.log('顯示的api有錯誤')
  })
}

//GET&PUT Api透過authId取出指定會員故事卡的資訊
function getSpecifyInfo(authId) {
  //故事卡上方資訊
  getSearch_resume_detail(`?pk=${authId}`)
  .then((res) => {
    const authIdApi = res.data;
    updateMoreInfoTop(authIdApi)
  }).catch((err) => {
    alert('取得指定故事卡有誤，請回報管理員');
  })

  //故事卡下方資訊
  putResume_load('',{
    "pk": `${authId}`,
    "card": "1"
  })
  .then((res) => {
    const ApiData = res.data;
    updateMoreInfoBottom(ApiData);
  })
  .catch((err) => {
    alert('取得故事卡內容有誤，請回報管理員');
  })

  //祝福牆內容
  purResume_bless('',{
    "auth_id": "50",
    "page": "1",
    "resume_id": `${authId}`,
    "size": "20"
  })
  .then((res) => {
    let apiData = res.data.results.data
    updateBless(apiData);
  }).catch((err) => {
    alert('取得祝福牆有誤，請回報管理員');
  })
}

//PUT Api編輯故事卡內容，分六隻Api(editData＝ 變更的內容、index＝ 第幾隻API要啟動)
// ['status','newLife','detect','cure','drug','diagnose']
function putEditResumeDetail(editData, index) {
  let jsonEditData = JSON.stringify(editData);

  switch(index) {
    case 0: 
      putUpdate_status('', jsonEditData).then((res) => {}).catch((err) => {
        alert('編輯故事卡有誤，請回報管理員');
      });
      break;
   
    case 1:
      putUpdate_newlife('', jsonEditData).then((res) => {}).catch((err) => {
        alert('編輯故事卡有誤，請回報管理員');
      });
      break;

    case 2:
      putUpdate_detect('', jsonEditData).then((res) => {}).catch((err) => {
        alert('編輯故事卡有誤，請回報管理員');
      });
      break;
    case 3:
      putUpdate_cure('', jsonEditData).then((res) => {}).catch((err) => {
        alert('編輯故事卡有誤，請回報管理員');
      });
      break;
    
    case 4:
      for(let i = 0; i < editData.length;i = i + 1) {
        putUpdate_drug('', JSON.stringify(editData[i])).then((res) => {}).catch((err) => {
          alert('編輯故事卡有誤，請回報管理員');
        });
      }
      break;
    
    case 5:
      putUpdate_diagnose('', jsonEditData).then((res) => {}).catch((err) => {
        alert('編輯故事卡有誤，請回報管理員');
      });
      break;
  }
}

//POST Api新增故事卡
function postAddNewResume(authId,addData) {
  postResume_outline('', {
    pk: `${authId}`,
    card: "1"
  })
  .then((res) => {
    // console.log(res);
    //新增完再修改內容
    putEditResumeDetail(addData,0)
  })
  .catch((err) => {
    alert('新增故事卡有誤，請回報管理員');
  });
}

//DELETE Api刪除故事卡
function deleteResume(authId) {
  deleteUpdate_resume('', {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      pk: `${authId}`,
      card: "1"
    }
  })
  .then((res) => {
    // console.log(res);
  })
  .catch((err) => {
    alert('刪除故事卡有誤，請回報管理員');
  });
}

//POST Api新增藥物 新增指定 會員編號 的藥物(藥物流水號後台自動設定，僅新增不能填寫內容)
function postAddDrugData() {
  postUpdate_drug('',{
    pk: `${resumeAuthId}`,
    card: "1",
    isAdd: "yes",
    drug_pk: "",
    name: "",
    effect: ""
  }).then((res) => {
    drugPk = res.data;
    $('.resumeDrug').append(`<div class="moreDetailDrug moreDetailDrug-${drugPk} drugEdit-${$('.moreDetailDrug').length + 1}"><div class="deleteDrugBtn" drugdata=${drugPk} data-bs-toggle="modal" data-bs-target="#deleteDrugModal">X</div><span class="drugNameTitle badge font-sm">藥物名稱</span><input class="form-control font-md" type="text"><span class="drugEffectTitle badge font-sm">副作用與注意事項</span><textarea class="form-control font-md" type="text"></textarea></div>`)
  }).catch((err) => {
    alert('新增藥物有誤，請回報管理員');
  });
}

//DELETE Api刪除藥物 刪除指定 會員編號->藥物流水號
function deleteDrugData(target) {
  let deleteDrugObj = {
    pk: `${resumeAuthId}`,
    card: "1",
    isAdd: "yes",
    drug_pk: `${target}`,
    name: "",
    effect: ""
  }
  deleteUpdate_drug('',{
    headers: {
      "Content-Type": "application/json"
    },
    data: deleteDrugObj
  }).then((res) => {
    $(`.moreDetailDrug-${target}`).empty();
    $(`.moreDetailDrug-${target}`).attr('delete','true');
  }).catch((err) => {
    alert('刪除藥物有誤，請回報管理員');
  });
}

// ------------------------------------------------ //
//更新故事卡顯示區
function updateInfo (data) {
  //若API資料小於10，先將多餘欄位增加class再導入資料  //若資料正常則取消class並導入資料
  if(data.length < 10) {
    jsHide(data.length,'resume')
  }

  //查詢錯誤顯示設定
  if (data.length === 0) {
    $('.wrongSearch').css('display','inline-block');
    $('.wrongSearch').text(`查詢無“${getInputValue}”資料！`);
  } else {
    $('.wrongSearch').css('display','none');
  }

  for (let i = 0; i < data.length; i = i + 1) {
    nameTitle = data[i].user_gender === '0' ? nameTitle = '先生' : nameTitle = '小姐';
    $(`.resume-${i + 1}`).removeClass('js-hide');
    $(`.resume-${i + 1} .span-1`).text(data[i].auth_id);
    $(`.resume-${i + 1} .span-2`).text(`${data[i].firstName}` + `${nameTitle}`);
    $(`.resume-${i + 1} .span-3`).text(data[i].cancertype);
    $(`.resume-${i + 1} .span-4`).text(data[i].myDoctor);
    $(`.resume-${i + 1} .span-5`).text(data[i].time_record);
    $(`.resume-${i + 1} .infoBtn`).attr('resume-authId',data[i].auth_id);
  }
}

//api2 更新故事卡更多內容 上方
function updateMoreInfoTop(authData) {
  let cancerTypeArr = ['皮膚癌','皮膚癌','食道癌','卵巢癌','頭頸癌','血癌','鼻咽癌','肺癌','乳癌','胰臟癌','胃癌','肝癌','大腸癌','直腸癌','子宮癌','子宮頸癌','攝護腺癌','膀胱癌','淋巴癌','原發不明頭頸癌']
  let levelArr = ['一','二','三','四'];
  
  //資料編輯，顯示原有內容
  if(authData.gender === '0') {
    $('.genderMale').attr('selected', '');
  } else {
    $('.genderFemale').attr('selected', '');
  }
  

  if(authData.identity === '0') {
    $('.identity-0').attr('selected', '');
  } else {
    $('.identity-1').attr('selected', '');
  }

  if (authData.family === 'no') {
    $('.familyNo').attr('selected', '');
  } else {
    $('.familyYes').attr('selected', '');
  }

  //給予編輯中的“期數”選取中樣式
  levelArr.map((x, index) => {
    if(x === authData.level) {
      $(`.level-${index + 1}`).attr('selected','')
    } 
  })
  //給予編輯中的“類型”選取中樣式
  cancerTypeArr.map((x, index) => {
    if(x === authData.cancertype) {
      $(`.cancertype-${index + 1}`).attr('selected','')
    } 
  })
  
  $('.myDoctorValue').val(authData.myDoctor).attr('placeholder',authData.myDoctor);
  $('.ageValue').val(authData.age);
  $('.genderValue').val(authData.gender);
  $('.familyValue').val(authData.family);
  $('.levelValue').val(authData.level);

  //資料調整，轉為可供閱讀資料，再轉為陣列帶入
  authData.gender = authData.gender === "1" ? "女性" : "男性";
  authData.identity = authData.identity === "0" ? "本人填寫" : "親友填寫";
  authData.family = authData.family === "1" ? "無" : "有";
  authData.level = authData.level + "期";
  authData.agree = authData.agree.length === 0 ? 0 : authData.agree.length;
  authData.like = authData.like.length === 0 ? 0 : authData.like.length;
  authData.addBookmark  = authData.addBookmark.length === 0 ? 0 : authData.addBookmark.length;
  
  //取得物件資料的值，並將值依序轉成陣列
  let authDataArr = Object.values(authData);

  //整合，去除無用資料帶入
  authDataArr.splice(9,3);
  authDataArr.splice(11,1);
  authDataArr.map((x, index) => {
    $(`.moreDetail-${index + 1}`).text(x)
  })
}

//api2 更新故事卡更多內容 下方
function updateMoreInfoBottom(data) {
  let drugArr = data.drug;
  
  //每個產出的陣列先整合，清除不必要資料
  let newLifeArr = Object.values(data.newlife);
  newLifeArr.splice(0,3);
  newLifeArr.pop();
  newLifeArr.reverse();
  let detectArr = Object.values(data.detect);
  detectArr.splice(0,5);
  detectArr.pop();
  let cureArr = Object.values(data.cure);
  cureArr.splice(0,3);
  cureArr.pop();
  let diagnoseArr = Object.values(data.diagnose);
  diagnoseArr.splice(0,2);
  diagnoseArr.pop();

  //年月分開，故獨立出來設定
  let detectYear = data.detect.detect_year;
  let detectMonth = data.detect.detect_month;
  if(!detectYear&&!detectMonth) {
    $('.detectTextDate').text('無資料')
  } else if(!detectMonth) {
    $('.detectTextDate span').text(`${detectYear}年`)
    $('.detectDateYear').val(`${detectYear}`)
  } else if(!detectYear) {
    $('.detectTextDate span').text(`${detectMonth}月`)
    $('.detectDateMonth').val(`${detectMonth}`)
  } else {
    $('.detectTextDate span').text(`${detectYear}年${detectMonth}月`)
    $('.detectDateYear').val(`${detectYear}`)
    $('.detectDateMonth').val(`${detectMonth}`)
  }

  //空值則填入無資料，cure中比較特別，多為延伸選項故空值則 "連標題一起隱藏"
  newLifeArr.map((x, index) => {
    if(!x) {
      $(`.newLifeText-${index + 1} span`).text('無資料');
    } else {
      $(`.newLifeText-${index + 1}  span`).text(x);
      $(`.newLifeText-${index + 1}  textarea`).val(x);
    }
  })

  detectArr.map((x, index) => {
    if(!x) {
      $(`.detectText-${index + 1}`).text('無資料')
    } else {
      $(`.detectText-${index + 1} span`).text(x)
    }
    if(index === 0) {
      $('.detectText-1 input').val(x)
    } else {
      $('.detectText-2 textarea').val(x);
    }
  })

  cureArr.map((x, index) => {
    //將json資料轉成中文
    const yes = "有";
    const no = "沒有"
    if(!x) {
      $(`.resumeCure-${index + 1}`).addClass('js-hide');
    } else {
      $(`.resumeCure-${index + 1}`).removeClass('js-hide');
      //每個value都是數字或英文，所以先設好預設值再改成中文
      if(x === "yes") {
        $(`.resumeCure-${index + 1} select`).val(x);
        x = yes
      } else if (x === "no") {
        $(`.resumeCure-${index + 1} select`).val(x);
        x = no
      } else {
        $(`.resumeCure-${index + 1} input`).val(x);
        x = x
      }
      $(`.cureText-${index + 1 }  span`).text(x);
      $(`.cureText-${index + 1 }  textarea`).val(x);
    }
  })

  diagnoseArr.map((x, index) => {
    if(!x) {
      $(`.diagnoseText-${index + 1}`).text('無資料')
    } else {
      $(`.diagnoseText-${index + 1}  span`).text(x);
    }
    //這個類別上面2個使用的編輯為input、下面2個則是用textarea，過做此設定
    if(index < 2) {
      $(`.diagnoseText-${index + 1} input`).val(x);
    } else {
      $(`.diagnoseText-${index + 1} textarea`).val(x);
    }
  })

  //每個故事卡一打開就先刪除上一筆藥物資訊，再新增
  $('.resumeDrug').empty('div')
  if(drugArr.length === 0) {
    $('.resumeDrug').append('<span class="font-md jsEditBefore">無資料</span>');
    drugPk = 0;
  } else {
    //新增藥物用流水號
    for(let i = 0; i < drugArr.length; i = i + 1) {
      $('.resumeDrug').append(`<div class="moreDetailDrug moreDetailDrug-${drugArr[i].drug_pk} drugEdit-${i + 1}"><div class="deleteDrugBtn jsEditAfter" drugdata=${drugArr[i].drug_pk} data-bs-toggle="modal" data-bs-target="#deleteDrugModal">X</div><span class="drugNameTitle badge font-sm">藥物名稱</span><span class="drugName jsEditBefore font-md">${drugArr[i].name}</span><input class="form-control jsEditAfter font-md" type="text"><span class="drugEffectTitle badge font-sm">副作用與注意事項</span><span class="drugEffect jsEditBefore font-md">${drugArr[i].effect}</span><textarea class="form-control jsEditAfter font-md" type="text"></textarea></div>`)
      $(`.drugEdit-${i + 1} input`).val(drugArr[i].name)
      $(`.drugEdit-${i + 1} textarea`).val(drugArr[i].effect)
      drugPk = Number(drugArr[i].drug_pk);
    }
  }
}

//更新bless清單
function updateBless(data) {
  //用於判斷當前留言者為醫師or民眾
  let addTypeBadge;
  
  $('.bless ul').empty('li');
  for(let i = 0;i < data.length; i = i + 1) {
    if(data[i].user_type === '0') {
      addTypeBadge = 'doctorBadge'
      $('.bless ul').append(`<li class="blessLi bless-${i + 1}"><span class="blessTitle font-md">${data[i].auth_id + data[i].firstName + data[i].lastName}</span><span class="badge ${addTypeBadge} font-md">醫師</span><span class="blessText font-md">${data[i].bless}</span></li>`)
    } else {
      addTypeBadge = 'normalBadge'
      $('.bless ul').append(`<li class="blessLi bless-${i + 1}"><span class="blessTitle font-md">${data[i].auth_id}</span><span class="badge ${addTypeBadge} font-md">民眾</span><span class="blessText font-md">${data[i].bless}</span></li>`)
    }
  }
}

//點擊切換更多資訊下方按鈕及顯示內容（顯示內容預設心靈正能量）
function clickChangeButton(target) {
  let btnCurrentType = target.attr('data-type');
  //點擊後加入選取中樣式
    $('.moreDetailBtnArea .btn').removeClass('btnJs-select');
    target.addClass('btnJs-select');

    //在rwd下除target以外的Btn都隱藏
    $('.moreDetailBtnArea .btn').addClass('rwdShowBtn_mobileHide')
    target.removeClass('rwdShowBtn_mobileHide');

  //移除所有顯示樣式，再單獨依照點擊的按鈕添加顯示樣式
  $('.moreDetailResume').removeClass('showResume');
  switch(btnCurrentType) {
    case 'newLife':
      $('.newLife').addClass('showResume');
      break;

    case 'detect':
      $('.detect').addClass('showResume');
      break;

    case 'cure':
      $('.cure').addClass('showResume');
      break;

    case 'diagnose':
      $('.diagnose').addClass('showResume');
      break;

    case 'bless':
      $('.bless').addClass('showResume');
      break;

    default:
      break;
  }
}

//取得當前點擊頁碼
function getCurrentNum(target) {
  currentNum = Number(target.attr('data-value'))
  console.log('currentNum',currentNum);
  console.log('maxLen',maxLen);
  //更新頁籤
  makePage(currentNum,maxLen)
  //更新畫面顯示資料
  getAllResumeData(currentNum)
}

//取得當前點擊故事卡的會員authId
function getResumeIndex (target) {
  //設立一個全域變數記錄當前點擊的會員號碼
  resumeAuthId = Number(target.attr('resume-authId'));
  
  //透過GET取得會員故事卡更多資訊，因為Put給予的內容少了姓氏所以額外再用GET取一個
  getSpecifyInfo(resumeAuthId);
}

//取得故事卡編輯後資料
function getEditValue(first) {
  let authIdValue = $('.authIdValue').text();
  let ageValue = $('.ageValue').val();
  let genderValue = $('.genderValue').val();
  let cancerTypeValue = $('.cancerTypeValue').val();
  let levelValue = $('.levelValue').val();
  let identityValue = $('.identityValue').val();
  let familyValue = $('.familyValue').val();
  let myDoctorValue = $('.myDoctorValue').val();

  let newLife_opinionValue = $('.resumeNewLife-1 textarea').val();
  let newLife_societyValue = $('.resumeNewLife-2 textarea').val();
  let newLife_keepValue = $('.resumeNewLife-3 textarea').val();

  let detect_yearValue = $('.detectDateYear').val();
  let detect_monthValue = $('.detectDateMonth').val();
  let detect_partValue = $('.resumeDetect-1 input').val();
  let detect_symptomValue = $('.resumeDetect-2 textarea').val();

  let cure_operateValue = $('.resumeCure-1 select').val();
  let cure_operate_chemoValue = $('.resumeCure-2 select').val();
  let cure_chemoValue = $('.resumeCure-3 select').val();
  let cure_chemo_wayValue = $('.resumeCure-4 select').val();
  let cure_chemo_effectValue = $('.resumeCure-5 select').val();
  let cure_heatValue = $('.resumeCure-6 select').val();
  let cure_bodyValue = $('.resumeCure-7 select').val();
  let cure_body_wayValue = $('.resumeCure-8 select').val();
  let cure_dnaValue = $('.resumeCure-9 select').val();
  let cure_other_wayValue = $('.resumeCure-10 textarea').val();
  let cure_costValue = $('.resumeCure-11 input').val();

  let diagnose_hospitalValue = $('.resumeDiagnose-1 input').val();
  let diagnose_doctorValue = $('.resumeDiagnose-2 input').val();
  let diagnose_scanValue = $('.resumeDiagnose-3 textarea').val();
  let diagnose_tipValue = $('.resumeDiagnose-4 textarea').val();
  
  //用戶基本資料
  let statusObj = {
    pk: `${authIdValue}`,
    card: "1",
    age: `${ageValue}`,
    gender: `${genderValue}`,
    cancertype: `${cancerTypeValue}`,
    level: `${levelValue}`,
    identity: `${identityValue}`,
    family: `${familyValue}`,
    myDoctor: `${myDoctorValue}`
  };

  //享受人生
  let newLifeObj = {
    pk:`${authIdValue}`,
    card: "1",
    isAdd: "yes",
    newlife_opinion: `${newLife_opinionValue}`,
    newlife_society: `${newLife_societyValue}`,
    newlife_keep: `${newLife_keepValue}`
  };

  //預防與發現
  let detectObj = {
    pk: `${authIdValue}`,
    card: "1",
    isAdd: "yes",
    detect_year: `${detect_yearValue}`,
    detect_month: `${detect_monthValue}`,
    detect_part: `${detect_partValue}`,
    detect_symptom: `${detect_symptomValue}`
  };

  //抗癌治療分享，少兩個cure_operate、cure_dna
  let cureObj = {
    pk: `${authIdValue}`,
    card: "1",
    isAdd: "yes",
    cure_operate_chemo: `${cure_operate_chemoValue}`,
    cure_chemo: `${cure_chemoValue}`,
    cure_chemo_way: `${cure_chemo_wayValue}`,
    cure_chemo_effect: `${cure_chemo_effectValue}`,
    cure_heat: `${cure_heatValue}`,
    cure_body: `${cure_bodyValue}`,
    cure_body_way: `${cure_body_wayValue}`,
    cure_other_way: `${cure_other_wayValue}`,
    cure_cost: `${cure_costValue}`,
    cure_operate: `${cure_operateValue}`,
    cure_dna: `${cure_dnaValue}`
  };

  //看診經驗
  let diagnoseObj = {
    pk: `${authIdValue}`,
    card: "1",
    isAdd: "yes",
    diagnose_hospital: `${diagnose_hospitalValue}`,
    diagnose_doctor: `${diagnose_doctorValue}`,
    diagnose_scan: `${diagnose_scanValue}`,
    diagnose_tip: `${diagnose_tipValue}`
  };

  let drugNameValue;
  let drugEffectValue;
  let drugPkValue;
  let beforeAddDrug = [];//藥物編輯異動前
  let afterAddDrug = [];//藥物編輯異動後

  for(let i = 0; i < $('.moreDetailDrug').length; i = i + 1) {
    let drugObj = {
      pk: `${resumeAuthId}`,
      card: "1",
      isAdd: "yes",
      drug_pk: "",
      name: "",
      effect: ""
    }

    drugNameValue = $(`.drugEdit-${i + 1} input`).val();
    drugEffectValue = $(`.drugEdit-${i + 1} textarea`).val();
    drugPkValue = $(`.drugEdit-${i + 1} .deleteDrugBtn`).attr('drugdata');
    if(!drugEffectValue&&!drugPkValue) {
      continue;
    }
    drugObj.drug_pk = drugPkValue;
    drugObj.name = drugNameValue;
    drugObj.effect = drugEffectValue;
    if(first) {
      beforeAddDrug.push(drugObj);
    } else {
      afterAddDrug.push(drugObj);
    }
  }
  
 
  //點擊編輯按鈕後先輸出一個變更前的資料，點擊送出後再輸出一個變更後的資料，執行比對相同則呼叫Api
  if(first) {
    beforeChang = [statusObj,newLifeObj,detectObj,cureObj,beforeAddDrug,diagnoseObj];
  } else {
    afterChange = [statusObj,newLifeObj,detectObj,cureObj,afterAddDrug,diagnoseObj];
  }
}

//編輯文章按鈕
function editUserDetail() {
  $editBtnCancel.on('click',function() {
    $jsEditBefore.css('display','inline-block');
    $jsEditAfter.css('display','none');
  })

  $editBtnSendOut.on('click',function() {
    //第二次點擊送出按鈕，紀錄變更後資料
    getEditValue(false);
    //判斷故事卡資料是否有異動，若無則不執行api程序
    for(let i = 0; i < afterChange.length; i = i + 1) {
      if (JSON.stringify(beforeChang[i]) !== JSON.stringify(afterChange[i])) {
        //傳入有異動的資料，後面的i代表哪一隻api要啟動
        putEditResumeDetail(afterChange[i],i);
      }
    }
    alert(`完成對會員${afterChange[0].pk}的編輯`);
    
    $jsEditBefore.css('display','inline-block');
    $jsEditAfter.css('display','none');
  })

  $editBtn.on('click',function() {
    //第一次點擊編輯按鈕，用於記錄變更前資料
    getEditValue(true)
    //點擊編輯，顯示所有可修改內容
    $('.cure div').removeClass('js-hide');
    $('.jsEditBefore').css('display','none');
    $('.jsEditAfter').css('display','inline-block');
  })
}

function getDeleteIndex(target) {
  deleteDrugIndex = target.attr('drugdata');
}

//點擊事件取得Value
function clickGetValue() {
  //取得authId
  $('.infoBtn').on('click', function(){
    getResumeIndex($(this));
  });
  //取得當前點擊的頁碼
  $('.pageLink').on('click', function(){
    getCurrentNum($(this));
  });
  //取得故事卡更多點擊的BtnAttr
  $('.moreDetailBtnArea .btn').on('click', function() {
    clickChangeButton($(this));
  });
  //取得欲刪除藥物的流水號
  $('#confirmDeleteDrug').on('click', function() {
    deleteDrugData(deleteDrugIndex);
  })
  $('body').on('click','.deleteDrugBtn',function() {
    getDeleteIndex($(this));
  })
  //點擊新增藥物
  $('.addDrugBtn').on('click',function() {
    postAddDrugData();
  })
  //搜尋故事卡
  $searchBtn.on('click', function() {
    getInputValue = $input.val();
    getAllResumeData(getInputValue)
    $input.val(''); 
  })

  //新增故事卡
  $addNewResume.on('click', function() {
    let $addID = $('#addResume .addId input').val();
    let $addAge = $('#addResume .addAge input').val();
    let $addGender = $('#addResume .addGender select').val();
    let $addLevel = $('#addResume .addLevel select').val();
    let $addCancerType = $('#addResume .addCancerType select').val();
    let $addDoctor = $('#addResume .addDoctor input').val();
    let $addIdentity = $('#addResume .addIdentity select').val();
    let $addFamily = $('#addResume .addFamily select').val();
    
    if(!$addID||!$addAge||!$addGender||!$addLevel||!$addCancerType||!$addDoctor||!$addIdentity||!$addFamily) {
      return
    } else {
      addResumeObj = {
        pk: `${$addID}`,
        card: "1",
        age: `${$addAge}`,
        gender: `${$addGender}`,
        cancertype: `${$addCancerType}`,
        level: `${$addLevel}`,
        identity: `${$addIdentity}`,
        family: `${$addFamily}`,
        myDoctor: `${$addDoctor}`
      }
      //檢查是否已有故事卡，若無才執行新增
      putResume_load('',{
        pk : `${addResumeObj.pk}`,
        card: '1'
      }).then((res) => {
        if(!res.data) {
          postAddNewResume(addResumeObj.pk,addResumeObj)
        } else {
          alert('已有故事卡');
        }
      }).catch(() => {})
    }
  })

  //刪除故事卡
  $deleteResumeBtn.on('click', function() {
    deleteResume(resumeAuthId);
  })
}

//登入登出驗證程序
removeApiDataForCloseBrowser('resume',userCode);
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      getAllResumeData('');
      clickGetValue();
      editUserDetail();
      break;
  
    default:
      break;
  }
});

autosize($('textarea'));
$('.rwdShowBtn_mobile').on('click', function() {
  //在rwd手機模式下點擊更多按鈕會取消隱藏所有Btn
  $('.moreDetailBtnArea .btn').removeClass('rwdShowBtn_mobileHide')
})