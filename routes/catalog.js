const express = require('express');
const router = express.Router();

const director_controller = require('../controllers/directorController');
const genre_controller = require('../controllers/genreController');
const movie_controller = require('../controllers/movieController');
const movie_instance_controller = require('../controllers/movieinstanceController');

router.get("/", movie_controller.index);

router.get("/movies", movie_controller.movie_list);
router.get("/movie/:id", movie_controller.movie_detail);
router.get("/movies/create", movie_controller.movie_create_get);
router.post("/movies/create", movie_controller.movie_create_post);
router.get("/movie/:id/delete", movie_controller.movie_delete_get);
router.post("/movie/:id/delete", movie_controller.movie_delete_post);
router.get("/movie/:id/update", movie_controller.movie_update_get);
router.post("/movie/:id/update", movie_controller.movie_update_post);

router.get("/directors", director_controller.director_list);
router.get("/director/:id", director_controller.director_detail);
router.get("/directors/create", director_controller.director_create_get);
router.post("/directors/create", director_controller.director_create_post);
router.get("/director/:id/delete", director_controller.director_delete_get);
router.post("/director/:id/delete", director_controller.director_delete_post);
router.get("/director/:id/update", director_controller.director_update_get);
router.post("/director/:id/update", director_controller.director_update_post);

router.get("/genres", genre_controller.genre_list);
router.get("/genre/:id", genre_controller.genre_detail);
router.get("/genres/create", genre_controller.genre_create_get);
router.post("/genres/create", genre_controller.genre_create_post);
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);
router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);

router.get("/movieinstances", movie_instance_controller.movie_instance_list);
router.get("/movieinstance/:id", movie_instance_controller.movie_instance_detail);
router.get("/movieinstances/create", movie_instance_controller.movie_instance_create_get);
router.post("/movieinstances/create", movie_instance_controller.movie_instance_create_post);
router.get("/movieinstance/:id/delete", movie_instance_controller.movie_instance_delete_get);
router.post("/movieinstance/:id/delete", movie_instance_controller.movie_instance_delete_post);
router.get("/movieinstance/:id/update", movie_instance_controller.movie_instance_update_get);
router.post("/movieinstance/:id/update", movie_instance_controller.movie_instance_update_post);

module.exports = router;