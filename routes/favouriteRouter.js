const express = require('express');
const bodyParser = require('body-Parser');
const mongoose = require('mongoose')
const authenticate = require('../authenticate');

//cors
const cors = require('./cors');

//import  favoriteSchema model
const Favourites = require('../models/favourite');


//Router
const favouriteRouter= express.Router();
favouriteRouter.use(bodyParser.json());

//Routes

favouriteRouter.route('/')
// .options(cors.corsWithOptions, (req,res) =>{ res.sendStatus(200);})
.get(authenticate.verifyUser, (req,res,next)=>{
    Favourites.find({})
    .populate('user')
    .populate('dishes')
    .then((favourites)=>{
        if(favourites){
            current_user_favs= favourites.filter(fav=> fav.user._id.toString() === req.user._id.toString())[0];
            // console.log("fav",favourites[0].user._id);
            // console.log("req",current_user_favs.dishes);
            if(!current_user_favs){
                var err = new Error('You have no favourites please add some!');
                err.status = 404;
                return next(err);
            }
            res.statusCode= 200;
            res.setHeader('Content-Type','application/json');
            res.json(current_user_favs);
        }
        else{
            var err = new Error('You have no favourites please add some!');
            err.status = 404;
            return next(err);
        }
        
    }, (err)=>{next(err)})
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    Favourites.find({})
    .populate('user')
    .populate('dishes')
    .then((favourites)=>{
        var current_user_favs
        //check whether is any fav for the user if nnot then we have to create it and then add dishes
        if(favourites){
            current_user_favs= favourites.filter(fav=> fav.user._id.toString() === req.user._id.toString())[0];
        }
        if(!current_user_favs){
            current_user_favs = new Favourites({
                user: req.user._id
            });
        }
        //now the favourite collection has record of current user
        // now we will push the dishes from req.body
        console.log("current_user_favs",current_user_favs.dishes[0]._id);
        for(let i=0;i<req.body.dishes.length;i++){
            if((req.body.dishes[i]).indexOf(current_user_favs.dishes[i]._id)===-1){
                current_user_favs.dishes.push(req.body.dishes[i]);
            }
        }
        current_user_favs.save()
        .then((FavDishes)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(FavDishes);
        console.log('Favourite Dish Created',FavDishes);
        })
    }, (err)=> next(err))
    .catch((err)=> next(err));
})

favouriteRouter.route('/test')
.get((req,res,next)=>{
    console.log("Hello");
    res.send("Hello!");
})

module.exports = favouriteRouter;

