const { body, validationResult } = require("express-validator");
const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const Admin = require('../models/admin');
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

exports.movie_instance_create_get = asyncHandler(async (req, res, next) => {
    const allMovies = await Movie.find({}, "title").sort({ title: 1 }).exec();
  
    res.render("movie_instance_form", {
      title: "Create Movie Instance",
      movie_list: allMovies,
    });
});

exports.movie_instance_create_post = [
    body("movie", "Movie must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const movieInstance = new MovieInstance({
          movie: req.body.movie,
          imprint: req.body.imprint,
          status: req.body.status,
          due_back: req.body.due_back,
        });
    
        if (!errors.isEmpty()) {
          const allMovies = await Movie.find({}, "title").sort({ title: 1 }).exec();
    
          res.render("movie_instance_form", {
            title: "Create Movie Instance",
            movie_list: allMovies,
            selected_book: movieInstance.movie._id,
            errors: errors.array(),
            movieinstance: movieInstance,
          });
          return;
        } else {
          await movieInstance.save();
          res.redirect(movieInstance.movie_instance_url);
        }
      }),
];

exports.movie_instance_delete_get = asyncHandler(async (req, res, next) => {
    const movieInstance = await MovieInstance.findById(req.params.id)
      .populate("movie")
      .exec();
  
    if (movieInstance === null) {
      res.redirect("/catalog/movieinstances");
    }
  
    res.render("movie_instance_delete", {
      title: "Delete movie Instance",
      movieinstance: movieInstance,
    });
  });

  exports.movie_instance_delete_post = [
    body("password", "wrong password"),
    asyncHandler(async (req, res, next) => {

      const passwordExists = await Admin.findOne({
        password:req.body.password
      }).exec();
      if(!passwordExists){
        res.send('wrong password');
      }
      else{
        await MovieInstance.findByIdAndDelete(req.body.id);
        res.redirect("/catalog/movieinstances");
      }
  })];

  exports.movie_instance_update_get = asyncHandler(async (req, res, next) => {
    const [movieInstance, allMovies] = await Promise.all([
      MovieInstance.findById(req.params.id).populate("movie").exec(),
      Movie.find(),
    ]);
  
    if (movieInstance === null) {
      const err = new Error("Movie copy not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("movie_instance_form", {
      title: "Update Movie Instance",
      movie_list: allMovies,
      selected_movies: movieInstance.movie._id,
      movieinstance: movieInstance,
    });
  });

  exports.movie_instance_update_post = [
    body("movie", "Movie must be specified").trim().isLength({ min: 1 }).escape(),
    body("imprint", "Imprint must be specified")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
  
    
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
     
      const movieInstance = new MovieInstance({
        movie: req.body.movie,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        const allMovie = await Movie.find({}, "title").exec();
  
        res.render("movie_instance_form", {
          title: "Update Movie Instance",
          movie_list: allMovie,
          selected_movie: movieInstance.movie._id,
          errors: errors.array(),
          movieinstance: movieInstance,
        });
        return;
      } else {
        await MovieInstance.findByIdAndUpdate(req.params.id, movieInstance, {});
        
        res.redirect(movieInstance.movie_instance_url);
      }
    }),
  ];