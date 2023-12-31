const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const DirectorSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    last_name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    date_of_birth: {
        type: Date,//yyyy-mm-dd
    },
    date_of_death: {
        type: Date,//yyyy-mm-dd
    },
    image:{
         type: String,
    },
});

DirectorSchema.virtual('director_url').get(function () {
    return `/catalog/director/${this.id}`;
});


DirectorSchema.virtual("nameForMovieList").get(function(){
    let fullName = "";
    if(this.first_name && this.last_name){
        fullName = `Dir. ${this.first_name} ${this.last_name}`;
    }
    return fullName;
});

DirectorSchema.virtual("name").get(function(){
    let fullName = "";
    if(this.first_name && this.last_name){
        fullName = `${this.first_name} ${this.last_name}`;
    }
    return fullName;
});

DirectorSchema.virtual("lifespan").get(function(){
    let lifespan = "";
    if(this.date_of_death && this.date_of_birth){
        lifespan = `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)}`;
    }
    else if(this.date_of_birth){
        const dob = DateTime.fromJSDate(this.date_of_birth);
        const today = DateTime.now();
        const age = today.diff(dob, 'years').years;
        lifespan = `${Math.floor(age)} years old`;
    }
    else{
        lifespan = "No Info";
    }
    return lifespan;
})

DirectorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
  });
  
DirectorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});


module.exports = mongoose.model("Director", DirectorSchema);