require('../models/DBConnection');
const Blogs = require('../models/Blogs');
const Users = require('../models/Users');
const validators = require('../validators');
const comments = require('../models/Comments');
const mongoose = require('mongoose');


exports.getlatestblogs = async(req,res)=>{
    try {
        const limitNumber = 20;
        const allBlogs = await Blogs.find({}).sort({ _id: -1 }).limit(limitNumber);
        console.log(allBlogs)
        res.render('getlatestblogs', { title: 'latest blogs', allBlogs } );
      } catch (error) {
        res.status(500).send({message: error.message || "Error Occured" });
      }
}

exports.submitNewBlog = async ( req,res,next)=>{
    const session = req.session.user;
    const user = req.session.username;

    if(!session){
      res.status(400).render('Unauthorized');
    }
    else{
      res.status(200).render('submitNewBlog',{title:"Create Blog Page", isAuth : true ,user :user})
    }
}

exports.submitNewBlogOnPost = async (req,res) =>{
    try {

        let user = req.session.user;
        console.log(user);
        if(!user){

            return res.redirect('/login');
        }

        let id = req.session.userId;
        console.log(req.body);

        let blogTitle = req.body.title;
        let blogBody = req.body.body;
        let blogDate = req.body.date;

        const errors = validators.checkBlogparams(blogTitle,blogBody,blogDate);

        if(errors){
            throw new Error(errors);
        }

        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files where uploaded.');
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() + imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.satus(500).send(err);
          })
    
        }
    
        const userdata = await Users.findOne({_id:req.session.userId});
        let authorname = userdata.firstName+" "+userdata.lastName;

        const newBlog = new Blogs({
          userid:id,
          author: authorname,
          title: blogTitle,
          body: blogBody,
          picture: newImageName,
          dateCreated:blogDate,
          commentId:[],
          likes_count : 0,
          //likedUsers: []
        });
        
        const blog = await newBlog.save();




        Users.findOneAndUpdate(
                      { _id: req.session.userId }, 
                     { $push: { blogsId: blog._id  } },
                     function (error, success) {
                     if (error,success) {
                           console.log(error);
                     } else {
                            console.log(success);
                        }
        });


        res.redirect('/myblogs');

      } catch (error) {
        let err = [];
        console.log(error);
        err.push('error in submit blogs');
        res.render('error',{errors:err,hasErrors : true});
      }
}

exports.getBlogbyId = async(req,res) => {
  var ObjectId = require('mongoose').Types.ObjectId;

  session = req.session.username;
  let isAuth = false;
  let user = ''
  if(session)
  {
    isAuth = true;
    user = req.session.username;

  }
  
  try {
    let blogId = req.params.id;
    if(ObjectId.isValid(blogId)){

      const blog = await Blogs.findById(blogId);

      let sendblog = {}
      sendblog._id = blog._id;
      sendblog.title = blog.title;
      sendblog.body = blog.body;
      sendblog.Author = blog.author;
      sendblog.dateCreated = blog.dateCreated
      sendblog.picture = blog.picture
      sendblog.likes = blog.likes_count
      let Allcomments = []

      if ( blog.commentId.length > 0){
         
        for(let i = 0 ; i < blog.commentId.length ; i++){
          var eachComments ={}

          var getcomment = await comments.findById(blog.commentId[i]);
        
          eachComments.text = getcomment.text;

          const userdata = await Users.findById(getcomment.userId);

          eachComments.name = userdata.firstName + " "+ userdata.lastName;
          eachComments.gender = userdata.gender;

          Allcomments.push(eachComments);
          

        }
       
      }
      res.render('blog', { title: 'Blog by id ', blog : sendblog , comments : Allcomments , isAuth: true , user:user} );
    }
    else{
      throw new Error('Invalid id passed')
    }
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }

}

exports.saveComment = async(req,res) => {

  let session = req.session.user;

  if(session){
    let userid = req.session.userId;
    let blogid = req.params.id;
    let text = req.body.content;

    const comment = await new comments({
      userId : userid,
      blogId : blogid,
      text : text
    });

    const savedComment = await comment.save() 
  
    const users = await Users.findById(userid);
    await users.commentsId.unshift(savedComment._id);
    await users.save();

    const currblog = await Blogs.findById(blogid);

    await currblog.commentId.unshift(savedComment._id);

    currblog.save().then(() => res.redirect('/Blogs/'+blogid))
    .catch((err)=> {
      console.log(err)
    })

  }
  else{
    res.redirect('/login');
  }
}
 
exports.updatelikes = async(req,res) => {

  let session = req.session.user;

  console.log("session ==="+session)

  userId  = req.session.userId;
  blogid = req.params.id;
  blogid = blogid.trim();

  if(!mongoose.isValidObjectId(blogid)){
    console.log('Invalid blogid')
  }
  blogid = require('mongoose').Types.ObjectId(blogid)

  if(session){
    try{
    counter = 1;

    liked_users = []

    const Blog = await Blogs.find({_id : blogid});

    // const state = await Blogs.find({likedUsers: userId},{limit : 1})

    // console.log(state.length === 0);
    // if(state.length == 0){
    //   liked_users.push(userId);
    // }


 
    const updatedBlog = await Blogs.updateOne({_id:blogid},{$inc:{likes_count:counter}})
   // const updateLikes = await Blogs.updateOne({_id : blogid} ,{$push:{likedUsers : liked_users}})

    if(updatedBlog.modifiedCount != 0){
      const getBlog = await Blogs.findById(blogid);

       console.log("likes count -======"+ getBlog.likedUsers.length)

        res.status(200).send({likeCount: getBlog.likes_count , isLiked : true});


    } }
    catch(err){
      console.log(err);    }
  }
  else{
    res.status(200).send({redirect : '/login'})
  }
}

exports.getmyblogs = async (req,res)=>{

  const session = req.session.userId;

  if(!session){
    res.status(400).render('Unauthorized',{title:"404 error",isAuth : false });
  }

  try{
    const blogs = await Blogs.find({userid : session}).sort({ _id: -1 }).lean();

    res.status(200).render('myBlogs',{
      title:"My Blogs Page",
      isAuth : true,
      blogs : blogs,
      user: req.session.username
    })

  }
  catch(err){
    res.status(400).render('error',{msg : err});
  }





}