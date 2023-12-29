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
        lifespan = `${DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)} - `;
    }
    else{
        lifespan = "-";
    }
    return lifespan;
})


module.exports = mongoose.model("Director", DirectorSchema);