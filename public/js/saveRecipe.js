
    function saveRecipe() {

        Name = $('.SaveRecipeButton').attr('name');
        Category = $('.SaveRecipeButton').attr('Cat');
        SubstituteDiet = $('.SaveRecipeButton').attr('Subs');

    
        console.log(Name);

        $.post('/savedietplans',{"recipe" : Name ,"Category":Category ,"SubstituteDiet": SubstituteDiet   },function (response , err){
            if(response.redirect){
                alert("login required to save recipes");
                settings = 'height='+700+',width='+300+',top='+100+',left='+200+',scrollbars='+true+',resizable'

                window.open('/login',"loginwindow" ,settings)
                return;
            }
            if(response.msg = "Success"){

                console.log(response);

                alert(id+" saved to your diet plans")
            }
            if(err){
                console.log(err);
            }
        })
            
        
    }

// var popupWindow = null;
// function positionedPopup(url,winName,w,h,t,l,scroll){
//c
// popupWindow = window.open(url,winName,settings)
// }
// </script>
// <p><a href="https://www.quackit.com/javascript/examples/sample_popup.cfm" onclick="positionedPopup(this.href,'myWindow','700','300','100','200','yes');return false">Positioned Popup</a></p>