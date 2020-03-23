const mongoose = require('mongoose')
const router = require('express').Router();
const auth = require('../authentication/auth');

const Schema = mongoose.Schema;

const funfactSchema = new Schema(
  {
    fact: String
  }
);

const Funfact = mongoose.model('Funfact', funfactSchema);

router.route('/random').get((req, res) => {
  Funfact.count().exec((err, c) => {
    var random = Math.floor(Math.random() * c)
    Funfact.findOne().skip(random).exec((err, factObject) => {
      res.json(factObject.fact)
    })
  })
})

// router.post('/add', (req, res) => {
//   for (fact in req.body.facts) {
//     const newFact = new Funfact({
//       fact: req.body.facts[fact]
//     })
//
//     newFact.save()
//       .then(() => {})
//   }
//   res.json("All Done")
// })

module.exports = router
