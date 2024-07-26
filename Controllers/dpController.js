require('../models/DBConnection');
validators = require('../validators');
const isImageURL = require('image-url-validator').default;
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');


const dietPlansDb = require('../models/dietPlan');
const { response } = require('express');

exports.dietPlans = async (req,res)=>{

    const session = req.session.user;
    let isAuth = false;

    if(session){
        isAuth = true;
    }

    res.render('dietPlans',{title : "Diet Plan Page", isresponse:false});

}  

exports.dietPlansonPost = async (req,res) =>{
    const session = req.session.user;
    let isAuth = false;

    if(session){
        isAuth = true;
    }

    try{
            

    const reqbody = req.body;

    let {total_calories , dietCategory ,subtitutediet , MealType  } = reqbody;



    if(isNaN(total_calories)){
        throw new Error("total Calories or meals is not a number");
    }
    
    total_calories = parseFloat(total_calories);
    //meals = parseInt(meals);


    // ranges = {
    //     "breakfast":[0.25,0.35],
    //     "lunch":[0.35,0.4],
    //     "Dinner": [0.25,0.35],
    //     "Snack1": [0.05,0.1],
    //     "Snack2": [0.05,0.1]
    // }


    url =  "https://api.edamam.com/api/recipes/v2?type=public&app_id="+
    process.env.APIID+"&app_key="+process.env.APIKEY+"&diet="+subtitutediet+"&health="+dietCategory+"&mealType="+MealType+"&calories="+total_calories/2+"-"+total_calories;


    const recipes = await axios.get(url )


    let response = [];

    if(recipes.count <= 0){
        throw new Error("error in response object");

    }
    for(let i = 0 ; i< 5 ;i++){

        idx = between(1,recipes.data.hits.length);

        console.log(recipes.data.hits[idx]);

        let res = recipes.data.hits[idx].recipe;

        console.log(res);
        let rec = {
            "name": res.label,
            "img":res.image,
            "Calories": Math.round(res.calories / res.yield),
            "recipe-link": res.url,
            "Category": dietCategory,
            "subtitutediet":subtitutediet
            
        }

        response.push(rec);
    }

    res.render('dietPlans',{title : "Diet Plan Page", isResponse : true ,response : response} );

    



    }catch(err){
        console.log(err);
        res.status(400).render('error',{error:[err]});
    }

}

exports.saveDietPlans = async (req,res) => {

    const session = req.session.user;
    let isAuth = true;

    if(!session){
        isAuth = false;
        
        res.send({redirect : '/login'});
        return;
    }


    const userId = req.session.userId;

    const reqbody = req.body;

    let recipe = req.body.recipe;
    let Category = req.body.Category;
    let substitutePlanType = req.body.SubstituteDiet;



    let errors = validators.checkRecipe(recipe,Category,substitutePlanType);

    if(errors){
        console.log(errors);
        res.status(400).send({"msg":"error in post body"})
    }

    try{

        var apipath = 'https://api.edamam.com/search';

       const Rdata =  await axios.get(apipath, {
        params: {
            q: recipe,
            app_id: process.env.APIID,
            app_key: process.env.APIKEY,
        }
        });

        let getRecipe = {}

        if(recipe === Rdata.data.hits[0].recipe.label){
            console.log(Rdata.data.hits[0].recipe.label)
            getRecipe = Rdata.data.hits[0].recipe;
        }
        else{
            
        for (let i = 0 ; i< Rdata.data.hits.length ; i++){

            if(recipe === Rdata.data.hits[i].recipe.label){
                getRecipe = Rdata.data.hits[i].recipe;
                break;
            }

        }

        }

         const dietPlan = await new dietPlansDb({

             userId : userId,
             RecipeName : getRecipe.label,
             MealType : getRecipe.mealType[0],
             Category : getRecipe.healthLabels[0],
             image : getRecipe.image,
             Calories : getRecipe.calories / getRecipe.yield,
             substitutePlanType:getRecipe.dietLabels[0],

         });
        dietPlan.save().then((obj)=>{
            console.log(obj);
            res.status(200).send({"msg":"Success"})
        })


    }catch(err){
        console.log(err);
        res.status(400).send({"msg":err});
    }



    
}


exports.mydietplans = async (req,res)=>{

    const session = req.session.userId;

    if(!session){
        res.status(400).render('Unauthorized');
        return;
    }

    const getdietplans = await dietPlansDb.find({userId:session, mealType : 'Breakfast'}).lean();

    console.log(getdietplans);

    res.status(200).render('mydietplans',{title : "My Saved Diet Plans" , response : getdietplans});





}

function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }