import { popupLogoutProcess,checkKeepLoginOnLoad,removeApiDataForCloseBrowser } from './common/base';
const userCode = localStorage.getItem('code');


//登入登出驗證程序
removeApiDataForCloseBrowser('qa',userCode)
popupLogoutProcess(userCode,900,30)
const checkLoginStatus = checkKeepLoginOnLoad(userCode);
checkLoginStatus.then(function (value) {
  switch (value) {
    case 'admin':
      // 填入預設進入網頁必須載入的function
      break;
  
    default:
      break;
  }
});
