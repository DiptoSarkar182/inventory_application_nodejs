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
});

exports.director_create_get = asyncHandler(async (req,res,next)=>{
    res.render("director_form",{
        title: "Insert Director",
    })
})

exports.director_create_post = [
    body("first_name")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("First name must be specified.")
  .withMessage("First name has non-alphanumeric characters."),

  body("last_name")
  .trim()
  .isLength({min:1})
  .escape()
  .withMessage("Last name must be specified")
  .withMessage("Last name has non-alphanumeric characters."),

  body("date_of_birth", "Invalid date of birth")
  .optional({values:"falsy"})
  .isISO8601()
  .toDate(),

  body("date_of_death", "Invalid date of death")
  .optional({values:"falsy"})
  .isISO8601()
  .toDate(),

  asyncHandler(async (req, res, next)=>{
    const errors = validationResult(req);
    const director = new Director({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if(!errors.isEmpty()){
      res.render("director_form", {
        title: "Insert director",
        director: director,
        errors: errors.array(),
      })
      return;
    } else{
      await director.save();
      res.redirect(director.director_url);
    }
  })
]

exports.director_delete_get = asyncHandler(async (req, res, next) => {
    const [director, allMoviesByDirector] = await Promise.all([
      Director.findById(req.params.id).exec(),
      Movie.find({ director: req.params.id }, "title summary").exec(),
    ]);
  
    if (director === null) {
      res.redirect("/catalog/directors");
    }
  
    res.render("director_delete", {
      title: "Delete Director",
      director: director,
      director_movies: allMoviesByDirector,
    });
  });

  exports.director_delete_post = asyncHandler(async (req, res, next) => {
      await Director.findByIdAndDelete(req.body.directorid);
      res.redirect("/catalog/directors");
  });


  exports.director_update_get = asyncHandler(async (req, res, next) => {
    const director = await Director.findById(req.params.id).exec();
    
    if (director === null) {
      const err = new Error("Director not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("director_form", { 
        title: "Update Director Info",
        director: director 
    });
  });

  exports.director_update_post = [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .withMessage("First name has non-alphanumeric characters."),
    body("last_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Family name must be specified.")
      .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
    body("date_of_death", "Invalid date of death")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const director = new Director({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        res.render("director_form", {
          title: "Update Director",
          director: director,
          errors: errors.array(),
        });
        return;
      } else {
        await Director.findByIdAndUpdate(req.params.id, director);
        res.redirect(director.director_url);
      }
    }),
  ];