const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    password: {
        type: Number,
        maxLength:100,
        required: true,
    },
});



module.exports = mongoose.model("Admin", AdminSchema);