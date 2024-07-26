require('../models/DBConnection');
const Blogs = require('../models/Blogs');
const Users = require('../models/Users');
const bycrpt = require('bcrypt');
const validators = require('../validators');


exports.Homepage = async(req,res)=>{

    let session = req.session.user;
    let user = req.session.username;

    if(session){
        res.render('Home',{title:"home page",isAuth: true , user:user});

    }
    else{
        res.render('Home',{title:"home page",isAuth: false});
    }


}

exports.loginRoute = async(req,res)=> {
    const session = req.session.user;
    if (session) {

        res.render('Home',{title : "Home Page" , isAuth : true});

        return;
    }
    else{
        res.render('login', { title : "Login Page" , isAuth : false });

    }

    
 
}
exports.loginRouteOnPost = async (req,res) => {
    const reqBody = req.body;
    let errors = [];
    let user = {};
    let hasErrors = false;

    console.log("Request body === ", reqBody);

    let { email , password } = reqBody;

    errors = validators.checkLogin(email,password);

    if(errors.length > 0){
        res.json({"msg":"errors in login"});
        return;
    }


    const userres = await Users.findOne({email:email});
    
    
        if(!userres){
            errors.push("No user found");
            res.render('error',{errors:errors,hasErrors:true});
            return;
        }

    let passwordflag = false;

    passwordflag = await bycrpt.compare(password,userres.password);

    if(passwordflag){
             req.session.user = userres.email;
             req.session.userId = userres._id;
             req.session.username = userres.lastName;

             let user = userres.lastName;
             
             res.status(200).render('Home',{title : "Home Page" , isAuth : true , user : user})
    }
    else{
        errors.push("password is wrong");
        res.render('login',{errors:errors,hasErrors:true , isAuth:false});
    }

}

exports.private = async (req,res)=>{
        const username = req.session.user;
        
        let errors = [];
        if (!username) {
            errors.push(`No user with ${username} found.`); 
            res.status(401).render('error', { errors : errors, hasErrors : true });
            return;
        }
        res.redirect('/newBlog');
        const title = `Welcome ${username}`;

    
}

exports.signupRoutes = async (req,res)=>{
    const session = req.session.user;

    if (session) {
        res.redirect('/private');
    }

    res.render('signup', { title : "SignUp page" });
}
exports.signupRoutesOnPost = async (req,res ) =>{
    let reqbody = req.body;
    console.log(reqbody);
    let errors = [];
    let hasErrors = false;


    let email = reqbody.email;
    let password = reqbody.password;
    let firstName = reqbody.firstName;
    let lastName = reqbody.lastName;
    let gender = reqbody.Gender;
    let age = reqbody.age;

    

         //Check that the username and password is provided or not
         if(!email || !firstName || !lastName || !gender || !age || !password){
            errors.push("One of the parameters are not  provided");
        }
        
    
        //Check that the username and password are string type or not
        if (!(typeof firstName == 'string') || !(typeof lastName == 'string') || !(typeof gender == 'string') || !(typeof password == 'string')||!(typeof email == 'string')) {
            errors.push("FirstName or LastName or gender or password or email are incompatible types: String required");
        }
        
    
        //Check that the username and password is empty or not
        if (email == null || email.trim() === ''){
            errors.push("email parameter is empty");
        }
        if (firstName == null || firstName.trim() === ''){
            errors.push("firstName parameter is empty");
        }
        if (lastName == null || lastName.trim() === ''){
            errors.push("lastName parameter is empty");
        }
        if (password == null || password.trim() === ''){
            errors.push("password parameter is empty");
        }
        if (gender == null || gender.trim() === ''){
            errors.push("gender parameter is empty");
        }

            //Check that the username and password contains spaces or not(Between)
         if((/\s/).test(email)){
                errors.push("email parameter contains spaces");
            }
          if((/\s/).test(password)){
              errors.push("password parameter contains spaces");
          }
          if (errors.length > 0) {
            res.status(400)
               .json({"errorlist" : errors});
            return;
        }


    ////validating email parameter
    if (!email.match(/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)){
        errors.push("email parameter is not in valid format");
    }

    //Username should be 4 characters long and password should be 6 character length
    if(password.length < 6){
        errors.push("Password parameter is less than 6 character length");
    }
    

    let saltRounds = 16;
    const hashpassword = await bycrpt.hash(password ,saltRounds )


    
    Users.findOne({ email : email}, async (err, existingUser) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (existingUser) {
            return res.status(400).send({
                error: 'User already exists.'
            });
        } else {
            // in the else condition, the email does not exist before in db, then create the user
            const user = new Users({
                firstName: firstName,
                lastName: lastName,
                email : email,
                password:hashpassword,
                age: age, 
                gender: gender,
                blogsId: [],
                commentsId: []
            })
    
            const newUser = await user.save();
            if(newUser == 'undefined'){//need to check
                res.status(500).render('login', { errors : "Internal Server Error", hasErrors : true, userInfo : newUser, title : "Sign Up Page" });
                return;
            }

            res.redirect('/login');
        
        }
    });
    

}

exports.logoutRoutes = async (req,res) =>{
    req.session.destroy();
    res.render('logout');

}

