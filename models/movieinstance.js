const mongoose = require('mongoose');
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const MovieInstanceSchema = new Schema({
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
      },
      due_back: { type: Date, default: Date.now },
})


MovieInstanceSchema.virtual("movie_instance_url").get(function () {
   
  return `/catalog/movieinstance/${this.id}`;
});

MovieInstanceSchema.virtual("due_back_formatted").get(function () {
   
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

MovieInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); //format 'YYYY-MM-DD'
});

module.exports = mongoose.model("MovieInstance", MovieInstanceSchema);