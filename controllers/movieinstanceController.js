const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const asyncHandler = require('express-async-handler');

exports.movie_instance_list = asyncHandler(
    async(req,res,next)=>{
        const allMovieInstance = await MovieInstance
        .find({}).populate("movie").exec();

        res.render("movie_instance_list", {
            title: "Movie Status Page",
            movie_instance_list: allMovieInstance,
        })
    }
)

exports.movie_instance_detail = asyncHandler(async (req,res,next)=>{
    const movieinstance = await MovieInstance
    .findById(req.params.id).populate("movie").exec();

    if(movieinstance === null){
        const err = new Error("No copy available");
        err.status = 404;
        return next();
    }
    res.render("movie_instance_detail", {
        title: "Movie instance detail",
        movie_instance_detail: movieinstance,
    })
})