const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next)=>{
    const [
        numMovies,
        numMovieInstances,
        numAvailableMovieInstances,
        numDirectors,
        numGenres,
    ] = await Promise.all([
        Movie.countDocuments({}).exec(),
        MovieInstance.countDocuments({}).exec(),
        MovieInstance.countDocuments({status:"Available"}).exec(),
        Director.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ])

    res.render('index', {
        title: "Movie Rent Home Page",
        movie_count: numMovies,
        movie_instance_count: numMovieInstances,
        movie_instance_available_count: numAvailableMovieInstances,
        directors_count: numDirectors,
        genre_count: numGenres,
    });
})

exports.movie_list = asyncHandler(async (req,res,next)=>{
    const allMovies = await Movie.find({}, "title director")
     .sort({title:1})
     .populate("director")
     .exec();
    res.render("movie_list", {
        title: "Movies List",
        movie_list: allMovies,
    })
});

exports.movie_detail = asyncHandler(async (req,res,next)=>{
    const [movie, movieIntances] = await Promise.all([
        Movie.findById(req.params.id).populate("director")
        .populate("genre").exec(),
        MovieInstance.find({movie:req.params.id}).exec(),
    ]);

    if(movie === null){
        const err = new Error("movie not found");
        err.status = 404;
        return next();
    }
    res.render("movie_detail", {
        title: "Movie Details",
        movie: movie,
        movie_intances: movieIntances,
    })
})