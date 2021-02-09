const express = require('express');
const bodyParser = require('body-Parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Promotions = require('../models/promotions');

const promoRouter =  express.Router();
promoRouter.use(bodyParser.json())


//Endpoints without id
promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) =>{ res.sendStatus(200);})
.get(cors.cors,(req,res,next)=>{
    Promotions.find({})
    .then((promotions)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err)=>{next(err)})
    .catch((err)=> next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.create(req.body)
    .then((promotions)=>{
        console.log('Promotion Created',Promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=> next(err));
});

//Endpoints with id
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) =>{ res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotions)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err)=>{next(err)})
    .catch((err)=> next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{$set: req.body}, {new:true})
    .then((promotions)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err)=>{next(err)})
    .catch((err)=> next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>{next(err)})
    .catch((err)=> next(err));
});

module.exports = promoRouter;