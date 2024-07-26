const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config();



const main = async () =>{

    totalCal = 2000;

    mealType = ['breakfast','lunch','Dinner'];

    total_cal = 100;

    diet_cat = ['vegan','vegetarian']

    subsitute_plan = ['gluten']

    meals_3 = {
        "bf_min" : 0.3, //600
        "bf_max" : 0.35,//
        "lunch_min" : 0.35,
        "lunch_max" : 0.35,
        "dinner_min" : 0.35,
        "dinner_max" : 0.35

    }
    meals_4 = {        
    "bf_min" : 0.25, //600                
    "bf_max" : 0.3,//
    "lunch_min" : 0.35,
    "lunch_max" : 0.4,
    "dinner_min" : 0.25,
    "dinner_max" : 0.3,
    "snack1_min" : 0.05,
    "snack1_max":0.1,

    }
    meal_5 = {
        "bf_min" : 0.25, //600                
    "bf_max" : 0.3,//
    "lunch_min" : 0.35,
    "lunch_max" : 0.4,
    "dinner_min" : 0.25,
    "dinner_max" : 0.3,
    "snack1_min" :0.05,
    "snack1_max":0.1,
    "snack2_min": 0.05,
    "snack2_max": 0.1
    }



    const apipath = 'https://api.edamam.com/api/recipes/v2';

    const bf_recipes = await axios.get('https://api.edamam.com/api/recipes/v2?type=any&app_id='
    +process.env.APIID+'&app_key='
    +process.env.APIKEY+'&diet=balanced&health='
    +diet_cat[1]+'&mealType='+mealType[0]
    +'&calories='+meals_3['bf_min']*totalCal+'-'+meals_3['bf_max']*totalCal+
    '&imageSize=SMALL');

    breakfast = [0.25,0.35]
    lunch = [0.35,0.4]
    dinner = [0.25,0.35]
    snacks1 = [0.05-0.1]
    snaks2 = [0.05 - 0.1]

   
    let meals = 3;

    console.log(Allmeals[0]['breakfast'][0])

    
   
}

main();