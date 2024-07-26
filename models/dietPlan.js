const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({

    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'Users'},
    RecipeName : {type : String , required:true},
    MealType : {type : String , required:true },
    Category : {type:String,required : true},
    image : {type: String , required:true},
    Calories : {type : Number , required:true},
    substitutePlanType: {type : String , required:true}

});


module.exports = mongoose.model('dietPlan', dietPlanSchema);