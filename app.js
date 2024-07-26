const express = require('express');
const app = express();
const configRoutes = require('./routes');
const fileUpload = require('express-fileupload');
const session =  require('express-session')

app.use(express.json());



const static = express.static(__dirname + '/public');
app.use('/public', static);

const exphbs = require('express-handlebars');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(fileUpload());

//save cookie
app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 6000000 }
  })
);

//Logging Middleware
app.use(async (req, res, next) => {
    if (req.session.user) {
        console.log("Authenticated User");
    } else {
        console.log("Non-Authenticated User");
    }
    next();


});

//Authentication middleware
app.use('/private', async (req, res, next) => {
    if (req.session.user) { 
        next();
    } else {
        res.status(403).render("login", { error: "user is not logged in" });
        return;
    }
});

app.use('/newBlog',async(req,res,next)=>{
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }
});

app.use('/Blog',async (req,res,next) =>{
    if(req.session.userId){
        next();
    }
    else{
        if(req.method == 'GET'){
           next();
        }
        else{
            res.redirect('/login');
        }
    }
});






configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
