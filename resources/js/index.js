import { superSlider } from './common/slider'
const $s4_block = $('.sec4_block');
let topperBarHeight;


$('.topperBar-link2, .footer_link1').on('click', function() {
  topperBarHeight = $(window).width() >= 731 ? 98 : 80
  window.scroll({
    top: $('.sec2')[0].offsetTop - topperBarHeight,
    // left: 100,
    // behavior: 'smooth'
  });
})

$('.topperBar-link3, .footer_link2').on('click', function() {
  topperBarHeight = $(window).width() >= 731 ? 98 : 80
  window.scroll({
    top: $('.sec3')[0].offsetTop - topperBarHeight,
    // left: 100,
    // behavior: 'smooth'
  });
})

$('.topperBar-link4, .footer_link3').on('click', function() {
  topperBarHeight = $(window).width() >= 731 ? 98 : 80
  window.scroll({
    top: $('.sec4')[0].offsetTop - topperBarHeight,
    // left: 100,
    // behavior: 'smooth'
  });
})
console.log($('.sec1').offset())
console.log($('.sec2').offset())
console.log($('.sec3').offset())
console.log($('.sec4').offset())

for(let i = 0; i < $s4_block.length; i = i + 1) {
  superSlider(5000, i + 1);
}
