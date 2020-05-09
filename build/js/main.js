function divide(first, second) {
  return first / second;
}

console.log(divide(4, 2));
console.log(divide(34, 2));

$(function () {

  $('.intro-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: false,
  });

  $('.intro__item').on('click', function(event) {
  var id = $(this).attr('data-id');
    $('#'+id).toggleClass('active');
    $('#'+id+'-375').toggleClass('active');
    $(this).toggleClass('current');
    return false;
  }); 
  
  $('.intro__description-cross').on('click', function(event) {
    $('.intro__description').removeClass('active');
    $('.intro__item').removeClass('current');
    return false;
  }); 

  $('.trusted--slider .trusted__items').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
  });

  $('.industries__tabs .js-trigger').click(function() {
    var id = $(this).attr('data-tab'),
      content = $('.js-content[data-tab="'+ id +'"]');
    
    $('.js-trigger.active').removeClass('active'); // 1
    $(this).addClass('active'); // 2
    
    $('.js-content.active-tab').removeClass('active-tab'); // 3
    content.addClass('active-tab'); // 4
  });

  $('.tab-link__wrapper--slider ').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    // infinite: false,
    variableWidth: true,
    centerMode: true,
    focusOnSelect: true,
  });

  $('.slider-reviews').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    responsive:[
      {
        breakpoint: 481,
        settings:{
          slidesToShow: 3,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 2000,
          variableWidth: true,
          centerMode: true,
        }
      }
    ]
  });

  $('.story__slider').slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
  });
  
  $('.accordion__item .js-label').click(function() {
    var id = $(this).attr('data-tab'),
      content = $('.js-wrapper[data-tab="'+ id +'"]');
    
    // $('.js-label.active').removeClass('active'); // 1
    $(this).toggleClass('active'); // 2
    
    // $('.js-wrapper.active-wrap').removeClass('active-wrap'); // 3
    content.toggleClass('active-wrap'); // 4
  });


  // $('.menu__btn').on('click', function(){
  //   $('.menu__list').slideToggle();
  // }); Для бургера!

  //   $('.class').slick({
  //   dots: true,
  //   arrows: false,
  //   slidesToShow: 4,
  //   slidesToScroll: 4,
  // }); Обычный одиночный слайдер!

  //  $('.slider-for').slick({
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   fade: true,
  //   asNavFor: '.slider-nav'
  // });
  // $('.slider-nav').slick({
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   asNavFor: '.slider-for',
  //   dots: true,
  //   centerMode: true,
  //   focusOnSelect: true
  // }); Двойной слайдер!


  // $('.wrapper .tab').on('click', function(event) {
  // var id = $(this).attr('data-id');
  //   $('.wrapper').find('.tab-item').removeClass('active-tab').hide();
  //   $('.wrapper .tabs').find('.tab').removeClass('active');
  //   $(this).addClass('active');
  //   $('#'+id).addClass('active-tab').fadeIn();
  //   return false;
  // }); Для табов!

  // $('.accordion__item .js-label').click(function() {
  //   var id = $(this).attr('data-tab'),
  //     content = $('.js-wrapper[data-tab="'+ id +'"]');
  //   $(this).toggleClass('active'); 
  //   content.toggleClass('active-wrap'); 
  // });
  // вариант аккордеона и добавления класса

});