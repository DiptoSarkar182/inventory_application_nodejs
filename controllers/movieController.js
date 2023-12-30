const { body, validationResult } = require("express-validator");
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

exports.movie_create_get = asyncHandler(async (req, res, next)=>{
    const [allDirectors, allGenres] = await Promise.all([
      Director.find().sort({first_name:1}).exec(),
      Genre.find().sort({name:1}).exec(),
    ]);
  
    res.render("movie_form", {
      title: "Create Movie",
      directors: allDirectors,
      genres: allGenres,
    })
  })

  exports.movie_create_post = [
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
          typeof req.body.genre === "undefined" ? [] : [req.body.genre];
      }
      next();
    },

    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("director", "Director must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("summary", "Summary must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('imdb_url'),
    body("imdb_rating", "IMDB Rating must not be empty").trim().escape(),
    body("genre.*").escape(),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        summary: req.body.summary,
        genre: req.body.genre,
        url: req.body.imdb_url,
        rating: req.body.imdb_rating,
      });
  
      if (!errors.isEmpty()) {
        const [allDirectors, allGenres] = await Promise.all([
          Director.find().sort({ first_name: 1 }).exec(),
          Genre.find().sort({ name: 1 }).exec(),
        ]);
  
        for (const genre of allDirectors) {
          if (movie.genre.includes(genre._id)) {
            genre.checked = "true";
          }
        }
        res.render("movie_form", {
          title: "Create Movie",
          directors: allDirectors,
          genres: allGenres,
          movie: movie,
          errors: errors.array(),
        });
      } else {
        await movie.save();
        res.redirect(movie.movie_url);
      }
    }),
  ];

  exports.movie_delete_get = asyncHandler(async (req, res, next) => {
    const [movie, movieInstances] = await Promise.all([
      Movie.findById(req.params.id).populate("director").populate("genre").exec(),
      MovieInstance.find({ movie: req.params.id }).exec(),
    ]);
  
    if (movie === null) {
      res.redirect("/catalog/movies");
    }
  
    res.render("movie_delete", {
      title: "Delete Movie",
      movie: movie,
      movie_instances: movieInstances,
    });
  });

  exports.movie_delete_post = asyncHandler(async (req, res, next) => {
    const [movie, movieInstances] = await Promise.all([
      Movie.findById(req.params.id).populate("director").populate("genre").exec(),
      MovieInstance.find({ movie: req.params.id }).exec(),
    ]);
  
    if (movie === null) {
      res.redirect("/catalog/movies");
    }
  
    if (movieInstances.length > 0) {
      res.render("movie_delete", {
        title: "Delete Movie",
        movie: movie,
        movieInstances: movieInstances,
      });
      return;
    } else {
      await Movie.findByIdAndDelete(req.body.id);
      res.redirect("/catalog/movies");
    }
  });

  exports.movie_update_get = asyncHandler(async (req, res, next) => {
    const [movie, allDirectors, allGenres] = await Promise.all([
      Movie.findById(req.params.id).populate("director").exec(),
      Director.find().sort({ first_name: 1 }).exec(),
      Genre.find().sort({ name: 1 }).exec(),
    ]);
  
    if (movie === null) {
      const err = new Error("Movie not found");
      err.status = 404;
      return next(err);
    }
  
    allGenres.forEach((genre) => {
      if (movie.genre.includes(genre._id)) genre.checked = "true";
    });
  
    res.render("movie_form", {
      title: "Update Movie",
      directors: allDirectors,
      genres: allGenres,
      movie: movie,
    });
  });

  exports.movie_update_post = [ 
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
          typeof req.body.genre === "undefined" ? [] : [req.body.genre];
      }
      next();
    },
  
   
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("director", "Director must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("summary", "Summary must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('imdb_url'),
    body("imdb_rating", "IMDB Rating must not be empty").trim().escape(),
    body("genre.*").escape(),
  
    
    asyncHandler(async (req, res, next) => {
    
      const errors = validationResult(req);
  
  
      const movie = new Movie({
        title: req.body.title,
        director: req.body.director,
        summary: req.body.summary,
        genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
        url: req.body.imdb_url,
        rating: req.body.imdb_rating,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        const [allDirectors, allGenres] = await Promise.all([
          Director.find().sort({ first_name: 1 }).exec(),
          Genre.find().sort({ name: 1 }).exec(),
        ]);

        for (const genre of allGenres) {
          if (movie.genre.indexOf(genre._id) > -1) {
            genre.checked = "true";
          }
        }
        res.render("movie_form", {
          title: "Update Movie",
          directors: allDirectors,
          genres: allGenres,
          movie: movie,
          errors: errors.array(),
        });
        return;
      } else {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movie, {});
        res.redirect(updatedMovie.movie_url);
      }
    }),
  ];