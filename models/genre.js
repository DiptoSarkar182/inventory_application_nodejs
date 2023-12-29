const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: {
        type: String,
        maxLength:100,
        required: true,
    }
});

GenreSchema.virtual('genre_url').get(function () {
    return `/catalog/genre/${this.id}`;
});


module.exports = mongoose.model("Genre", GenreSchema);