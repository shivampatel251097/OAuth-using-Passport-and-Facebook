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

        for(let i =0;i<req.body.dishes.length;i++){
            for(let j=0;j<current_user_favs.dishes.length;j++){
                if(req.body.dishes[i]==current_user_favs.dishes[j]._id){
                    i=i+1;
                }
            }
            current_user_favs.dishes.push(req.body.dishes[i]);
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

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.send('PUT operation not supported on /favoirites');
    console.log('PUT operation not supported on /favoirites');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Favourites.find({})
    .populate('user')
    .populate('dishes')
    .then((favourites)=>{
        if(favourites){
            current_user_favs_remove= favourites.filter(fav=> fav.user._id.toString() === req.user._id.toString())[0];
            if(current_user_favs_remove){
                current_user_favs_remove.remove()
                .then((deleted)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(deleted);
                },(err)=>next(err));
            }
            else{
                var err = new Error('You have no favourites.');
                err.status = 404;
                return next(err);
            }
        }
        else{
            var err = new Error('You have no favourites');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

favouriteRouter.route('/:dishID')
.get(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.send('GET operation is not supported on /favoirites/'+req.params.dishID);
    console.log('GET operation not supported on /favoirites');
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Favourites.find({})
    .populate('user')
    .populate('dishes')
    .then((favourites)=>{
        var current_user_favs
        if(favourites){
            current_user_favs = favourites.filter(favs => favs.user._id.toString()=== req.user._id.toString())[0];
        }
        if(!current_user_favs){
            current_user_favs =  new Favourites({
                "user":req.user._id
            });
        }
        var flag
        for(let j=0;j<current_user_favs.dishes.length;j++){
            if(req.params.dishID==current_user_favs.dishes[j]._id){
                flag=true;
            }
        }
        if(!flag){
            current_user_favs.dishes.push(req.params.dishID);
        }
        current_user_favs.save()
        .then((Fav)=>{
            res.statusCode=201;
            res.setHeader("Content-Type","application/json");
            res.json(Fav);
        },(err)=>next(err))
        .catch((err)=>next(err));
    },(err)=>next(err))
    .catch((err)=>next(err));
})

module.exports = favouriteRouter;

