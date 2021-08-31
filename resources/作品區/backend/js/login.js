import { putBackend_login } from './common/restapi';

const $loginBtn = $('.login-btn');//登入按鈕
let loginObj = {
  code: ''
};


//按enter等同送出
$(window).on('keydown',function(e) {
  if(e.key ==='Enter') {
    $('.login-btn').trigger('click');
  }
})


//核對是否登入成功用的api
function putCheckLoginCode(loginData) {
  putBackend_login('', loginData)
  .then((res) => {
    console.log('data',res.data);
    if(res.data === 'admin') {
      alert('歡迎進入後台管理系統');
      localStorage.setItem('code', loginData.code);
      window.location.href=`${SERVER_DOMAIN}/overview.html`;
    } else {
      alert('驗證錯誤請重新輸入！');
      return;
    }
  })
  .catch((err) => {
    alert(`出現障礙，請聯絡管理員`);
    // console.log(err.response)
  })
}

//-------|API|-------//
//登入按鈕點擊執行
$loginBtn.on('click', function() {
  loginObj.code = $('.loginSpace').val();
  putCheckLoginCode(loginObj);
})

//提示框
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})