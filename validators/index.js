exports.checkLogin = ( email,password) => {

    errors = [];
     //Check that the email and password is provided or not
     if(!email){
        errors.push("email parameter is not provided");
        return errors;
    }
    if(!password){
        errors.push("Password parameter is not provided");
        return errors;
    }

    //Check that the email and password are string type or not
    if (!(typeof email == 'string')) {
        errors.push("email parameter is not string type");
        return errors;
    }
    if (!(typeof password == 'string')) {
        errors.push("Password parameter is not string type");
        return errors;
    }

    //Check that the email and password is empty or not
    if (email == null || email.trim() === ''){
        errors.push("email parameter is empty");
        return errors;
    }
    if (password == null || password.trim() === ''){
        errors.push("Password parameter is empty");
        return errors;
    }

    //Check that the email and password contains spaces or not(Between)
    if((/\s/).test(email)){
        errors.push("email parameter contains spaces");
        return errors;
    }
    if((/\s/).test(password)){
        errors.push("Password parameter contains spaces");
        return errors;
    }
    //validating email parameter
        if (!email.match(/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)){
            errors.push("email parameter is not in valid format");
            return errors;
        }
    
    
    if(password.length < 6){
        errors.push("Password parameter is less than 6 character length");
        return errors;
    }

    return errors;
}

exports.checkBlogparams =(title,body,date)=>{
    if(!title){
        return " title are empty"
    } if(!body){
        return " body are empty"
    }  if(!date){
        return " date are empty"
    }
    if (!(typeof title == 'string') || !(typeof body == 'string') || !(typeof date == 'string')) {
        return "Invalid title or body or date String";
    }
    if (title == null || title.trim() === ''){
        return "title parameter is empty";
        
    }
    if (body == null || body.trim() === ''){
        return "body parameter is empty";
        
    }
    if (date == null || date.trim() === ''){
        return "date parameter is empty";
        
    }

}

exports.checkRecipe = ( RecipeName ,Category,SubstituteDiet) =>{

    if(!RecipeName  ){
        return "Error: Recipe Name required";
    }

    if (!(typeof RecipeName == 'string') ){
        return ("Error: RecipeName should be a string  ")
    }
    
    if (RecipeName == null || RecipeName.trim() === ''){
        return "RecipeName parameter is empty";
        
    }
    if(!Category  ){
        return "Error: Recipe Name required";
    }

    if (!(typeof Category == 'string') ){
        return ("Error: RecipeName should be a string  ")
    }
    
    if (Category == null || Category.trim() === ''){
        return "RecipeName parameter is empty";
        
    }
    if(!SubstituteDiet  ){
        return "Error: Recipe Name required";
    }

    if (!(typeof SubstituteDiet == 'string') ){
        return ("Error: RecipeName should be a string  ")
    }
    
    if (SubstituteDiet == null || SubstituteDiet.trim() === ''){
        return "RecipeName parameter is empty";
        
    }
    
    

}