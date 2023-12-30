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

exports.genre_detail = asyncHandler(async (req,res,next)=>{
    const [genre, moviesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Movie.find({genre:req.params.id}, "title summary").exec(),

    ]);

    if(genre === null){
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }
    res.render("genre_detail", {
        title: "Genre Detail",
        genre: genre,
        genre_movie: moviesInGenre,
    })
})