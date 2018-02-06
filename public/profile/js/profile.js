var id = $('.followers-box').attr('id');

$('.clickable').click(function(e){
    $('.widget-fade').toggleClass('w-faded');
    $('.followers-box').toggleClass('followers-displayed');
    $.ajax({
        url: 'php/getFollowers.php',
        method: 'POST',
        dataType: 'text',
        data: {
            getFollowers: 1,
            id: id
        },success: function(follower){
            $('.followers-loading').remove();
            $('.followers-followers').append(follower);
        }
    })
})
$('.widget-fade').click(function(e){
    $('.widget-fade').toggleClass('w-faded');
    $('.followers-box').toggleClass('followers-displayed');
    e.preventDefault();
})
$('#followers-closer').click(function(e){
    $('.widget-fade').fadeOut(500);
    $('.widget-fade').removeClass('w-faded');
    $('.followers-box').removeClass('followers-displayed');
    e.preventDefault();
})