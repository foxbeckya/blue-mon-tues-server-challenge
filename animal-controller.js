var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Animal = sequelize.import('../models/animal');

router.post('/create', (req, res) => {
    let animalObj={
        name: req.body.name,
        legNumber: req.body.legNumber,
        predator: req.body.predator
    }
    Animal.create(animalObj)
    .then(animal => {
        res.status(200).json({message: 'animal created', animal})
    })
    .catch(err => res.status(500).json({err: err.message}))
})

 router.delete('/delete/:id', (req,res) => {
    var animal= req.params.id;

    Animal.destroy({
        where: {id: animal}
    }).then(
        function deleteLogSuccess(animal){
            res.send("you removed an animal");
        },
        function deleteLogError(err){
            res.send(500, err.message);
        }
    );
});

router.put('/update/:id', (req,res) => {
    var animal=req.params.id;

    Animal.update({
        animal}, {
        where: {id: animal}
    }).then(
        function updateSuccess(updatedLog) {
            res.send ("you updated an animal");
        },
        function updateError(err){
            res.send(500, err.message); 
        }
    )
});

module.exports = router;