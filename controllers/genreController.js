const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const asyncHandler = require('express-async-handler');

exports.genre_list = asyncHandler(async (req,res,next)=>{
    const allGenres = await Genre.find({}).sort({name:1})
    .exec();
    res.render("genre_list", {
        title: "Genre List",
        genre_list: allGenres,
    });
});