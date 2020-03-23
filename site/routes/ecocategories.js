const mongoose = require('mongoose')
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const moment = require('moment')

let Activity = require('../models/activity.model');
const auth = require('../authentication/auth');

const Schema = mongoose.Schema;

const ecocategorySchema = new Schema(
  {
    fact: String
  }
);

const Ecocategory = mongoose.model('Ecocategory', ecocategorySchema);

router.get('/:id', auth, asyncHandler(async (req, res) => {
    const ecocategory = await Ecocategory.findOne({
      id: req.params.id
    });

    let categoryObject = ecocategory.toObject()
    const availableOpts = await categoryObject.opts.reduce(async (currentPrm, next) => {
      const rate = next.limit.rate;
      const times = next.limit.times;
      const id = next.id;
      const current = await currentPrm;

      if (rate === 'total') {
        const aCount = await Activity.count({
          userId: req.user._id,  // only return stuff for this user
          metaId: id
        })
        if (aCount >= times) {
          next.grayed = true;
        }
      }

      if (rate === 'week') {
        const aCount = await Activity.count({
          userId: req.user._id,  // only return stuff for this user
          metaId: next.id,
          createdAt: {
            '$gte': moment().startOf('week').toDate(),
            '$lte': moment().endOf('week').toDate()
          }
        })
        if (aCount >= times) {
          next.grayed = true;
        }
      }

      if (rate === 'day') {
        const aCount = await Activity.count({
          userId: req.user._id,  // only return stuff for this user
          metaId: next.id,
          createdAt: {
            '$gte': moment().startOf('day').toDate(),
            '$lte': moment().endOf('day').toDate()
          }
        })
        if (aCount >= times) {
          next.grayed = true;
        }
      }

      return current.concat([next]);
    }, [])

    categoryObject.opts = availableOpts
    res.json(categoryObject);
}))

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
