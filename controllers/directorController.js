const { body, validationResult } = require("express-validator");
const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const Admin = require('../models/admin');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const multer = require("multer"); // For uploading images

/// ADD IMAGES ///

// Set up multer storage and file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/director");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer upload instance and add file size limit.
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 300 * 1024 } // 300KB limit
});

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
  upload.single("image"),
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
      image: req.file ? req.file.filename : null,
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

  exports.director_delete_post = [
    body("password", "wrong password"),

    asyncHandler(async (req, res, next) => {
    const [director] = await Promise.all([
      Director.findById(req.params.id).exec(),
    ]);
    const passwordExists = await Admin.findOne({
      password:req.body.password
    }).exec();
    if(!passwordExists){
      res.send('wrong password');
    } else{
      const imageFileName = director.image;
      await Director.findByIdAndDelete(req.body.directorid);
      if(imageFileName){
        const imagePath = path.join(__dirname, "../public/uploads/director", imageFileName);
        try {
          fs.unlinkSync(imagePath);
      } catch (err) {
          console.error(`Error deleting image file: ${err.message}`);
      }
      }
      res.redirect("/catalog/directors");
    }
  })];

  let director_to_update;

  exports.director_update_get = asyncHandler(async (req, res, next) => {
    const director = await Director.findById(req.params.id).exec();
    director_to_update = director.image;

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
    upload.single("image"),
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
        image: req.file ? req.file.filename : null,
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
        if(director_to_update){
          const imagePath = path.join(__dirname, "../public/uploads/director", director_to_update);
          try {
            fs.unlinkSync(imagePath);
        } catch (err) {
            console.error(`Error deleting image file: ${err.message}`);
        }
        }
        res.redirect(director.director_url);
      }
    }),
  ];