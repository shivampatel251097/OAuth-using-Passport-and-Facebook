const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//creating fovoriteSchema
const favouriteSchema = new Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
    dishes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
    }]
},{
    timestamp:true
}
);

var Favourites = mongoose.model('Favourite',favouriteSchema);
module.exports = Favourites;