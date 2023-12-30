const express = require('express');
const router = express.Router();

const director_controller = require('../controllers/directorController');
const genre_controller = require('../controllers/genreController');
const movie_controller = require('../controllers/movieController');
const movie_instance_controller = require('../controllers/movieinstanceController');

router.get("/", movie_controller.index);

router.get("/movies", movie_controller.movie_list);
router.get("/movie/:id", movie_controller.movie_detail);

router.get("/directors", director_controller.director_list);
router.get("/director/:id", director_controller.director_detail);

router.get("/genres", genre_controller.genre_list);
router.get("/genre/:id", genre_controller.genre_detail);

router.get("/movieinstances", movie_instance_controller.movie_instance_list);
router.get("/movieinstance/:id", movie_instance_controller.movie_instance_detail);






module.exports = router;