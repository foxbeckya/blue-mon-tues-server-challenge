var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/create', (req, res) => {
    //1. build and store an object based on the model
    //2. send object/instance to the database with User
    //3. send a response with the user object created
    //4. send a response with an error in a .catch
    let userObj={
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    User.create(userObj)
    .then(user => {
        let token = jwt.sign({id: user.id}, 'secret_key', {expiresIn: 60*60*24});
        res.status(200).json({user: user, token: token})
    })
    .catch(err => res.status(500).json({err: err.message}))
 })

router.post('/login', (req, res) => {
    //1. find the user based upon username
    //2. if a user is found, compare passwords
    //3. if passwords match, send 200 and successful response with user data
    //4. if passwords don't match, send error message
    //5. if no user found/any error, send a response with an err message

    User.findOne({where: {username: req.body.username}})
    .then(user =>{
       if (user && bcrypt.compareSync(req.body.password, user.password)){
        let token = jwt.sign({id: user.id}, 'secret_key', {expiresIn: 60*60*24});
           res.status(200).json({message: 'login success', user, token})
       } else {
           res.status(500).json({message: 'invalid credentials'})
       }
    })
    .catch(err => res.status(500).json({error: err.message}))
})


module.exports = router;