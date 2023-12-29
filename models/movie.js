const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: Schema.Types.ObjectId,
        ref: "Director",
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    genre: [{
        type: Schema.Types.ObjectId,
        ref: "Genre",
    }],
    url:{
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
})

MovieSchema.virtual('movie_url').get(function () {
    return `/catalog/movie/${this.id}`;
});


module.exports = mongoose.model("Movie", MovieSchema);