
    function updateLikes() {

    id = $('.LikeButton').attr('blogId');

    console.log('i am here in updatelikes'+ id )

    
    var reqUrl = '/Blogs/'+id+'/like'
    
    
    $.post('/Blogs/'+id+'/like',function (response,err) {
        
        console.log("Response=="+response);
        console.log("err=="+err)
        
        if(response.likeCount){
            
        console.log(response.likeCount)

        $('.fa-thumbs-o-up').text(response.likeCount); //your counter on a page
        //and update likes counter with response

        }
        
        else{
            window.location.href = response.redirect;
        }
    });

        
    
}
   