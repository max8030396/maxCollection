$(document).ready(function(){

  const inputer = $('#inputer');
  const btn = $('#btn');
  let userName = ''
  let currenTime = 10;
  let innerLi = $('li');

  function nameRecord() {
    btn.on('click', () => {
      userName = inputer.val();
      inputer.val('');
      const end = setInterval(() => {
        currenTime = currenTime - 1;
        if (currenTime < 1) {
          // alert(`${userName}`);
          clearInterval(end);
          return;
        }
        localStorage.setItem('name', userName);
        // console.log('',localStorage);
      }, 1000);
    })
  }
  function getName (){
    localStorage.getItem(name);
    console.log(localStorage.getItem(name));
    let name = $('<li>/<li>').text(`${userName}`);
    btn.on ('load',function(){
      $('.rank').append(`${userName}`);
    })
  }

  // 選擇模式
  // 輸入名字
  // 名字被提取
  // 遊戲開始
  // 倒數計時
  // 結果Ａ：撞到遊戲結束
  // 跳出視窗
  // 分數印上、名稱顯示
  // 排行榜新增名字、分數(最多只保留五位)

  // 結果Ｂ：時間到遊戲結束
  // 跳出視窗
  // 分數印上、名稱顯示
  // 排行榜新增名字、分數(最多只保留五位)


  nameRecord();
  getName();
})