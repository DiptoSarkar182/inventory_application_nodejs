const { body, validationResult } = require("express-validator");
const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const asyncHandler = require('express-async-handler');

exports.director_list = asyncHandler(async (req,res,next)=>{
    const allDirectors = await Director.find({})
     .sort({first_name:1}).exec();

    res.render("director_list", {
        title: "Director List",
        director_list: allDirectors,
    });
});

exports.director_detail = asyncHandler(async (req,res,next)=>{
    const [director, allMoviesByDirector] = await Promise.all([
        Director.findById(req.params.id).exec(),
        Movie.find({director: req.params.id},
            "title summary").exec(),
    ]);

    res.render("director_detail", {
        title: "Director Details",
        director: director,
        director_of_movies: allMoviesByDirector,
    })
})