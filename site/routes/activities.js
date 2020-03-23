const router = require('express').Router();
let Activity = require('../models/activity.model');
const auth = require('../authentication/auth')
const auth_special = require('../authentication/auth_special')
const mongoose = require('mongoose')
const moment = require('moment')

router.get('/', auth, (req, res) => {
  Activity.find({
    userId: req.user._id  // only return stuff for this user
  })
    .then(activities => res.json(activities))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/recent', auth, (req, res) => {
  var globalAmount = 0
  const weekdaysList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let tz = 0

  Activity.aggregate([
    { '$match':
      {
        userId: mongoose.Types.ObjectId(req.user._id),
        verified: true
      }
    },
    {
      '$group': {
        '_id': {
          'dayOfMonth': {'$dayOfMonth': '$createdAt'},
          'dayOfWeek': {'$dayOfWeek': '$createdAt'}
        },
        'dailyPts': { '$sum': '$metaPts' },
        'createdAt': { '$first': '$createdAt' }
      }
    },
    { "$sort": { "createdAt": 1 } }
  ])
    .then(activities => {
      const runningTotalAndDatedActivities = activities.map(doc => {
        globalAmount += doc.dailyPts;
        tz = moment(doc.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).utcOffset()
        return Object.assign(doc, {
          runningPts: globalAmount,
          dayName: weekdaysList[doc._id.dayOfWeek - 1],
          createdDay: moment(doc.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).utc().startOf('day').valueOf()
        });
      })
      const listByWeek = Array.from(Array(7).keys()).map((i) => {
        const dayUnix = moment().utc().startOf('day').subtract(i, 'd').valueOf()
        return ({
          dayUnix: dayUnix,
          runningPts: runningTotalAndDatedActivities.reduce((prev, curr) => {
            return ((curr.createdDay <= dayUnix && dayUnix - curr.createdDay < dayUnix - prev.createdDay) ? curr : prev)
          }, { createdDay: 0, runningPts: 0 }).runningPts, // find closest and less than or 0
          day: weekdaysList[moment().utc().startOf('day').subtract(i, 'd').day()]
        })
      }).sort((i) => i.dayUnix);

      res.json(listByWeek)
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/streak', auth, (req, res) => {
  let streak = 0
  let streakLost = false

  Activity.aggregate([
    { '$match':
      {
        userId: mongoose.Types.ObjectId(req.user._id)
      }
    },
    { '$project': { 'createdDay': { '$dateToString': { date: '$createdAt', format: '%Y-%m-%d'} } } },
    { '$sort': { 'createdDay': -1 }}
  ])
    .then(activities => {
      while (!streakLost) {
        let dayUnix = moment().subtract(streak, 'd').format('YYYY-MM-DD') //.utc().startOf('day').subtract(streak, 'd').valueOf()
        let daysFound = activities.reduce((prev, curr) => curr.createdDay === dayUnix ? prev + 1 : prev, 0)
        if (daysFound) { streak = streak + 1; }
        else { streakLost = true; }
      }

      return res.json(streak)
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/favorites', auth, (req, res) => {
  let streak = 0
  let streakLost = false
  const limit = req.query.limit ? parseInt(req.query.limit) : 10

  Activity.aggregate([
    { '$match':
      {
        userId: mongoose.Types.ObjectId(req.user._id),
        verified: true
      }
    },
    { '$group':
      {
        '_id': '$metaId',
        'metaName': { '$first': '$metaName' },
        'totalPts': { '$sum': '$metaPts' },
        'metaCategory': { '$first': '$metaCategory'}
      }
    },
    { '$sort': { 'totalPts': -1 }},
    { '$limit': limit }
  ])
    .then(activities => {
      return res.json(activities)
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/pts', auth, (req, res) => {
  Activity.aggregate([
    { '$match':
      {
        userId: mongoose.Types.ObjectId(req.user._id),
        verified: true
      }
    },
    {
      '$project': { 'metaPts': 1, 'metaCO2': 1 }
    }
  ])
    .then(activities => res.json({
      totalPts: activities.reduce((a, b) => a + (b['metaPts'] || 0), 0),
      totalCO2: activities.reduce((a, b) => a + (b['metaCO2'] || 0), 0)
    }))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.post('/add', auth, (req, res) => {
  const newActivity = new Activity({
    userId: req.user._id,
    metaName: req.body.metaName,
    metaId: req.body.metaId,
    metaPts: req.body.metaPts,
    metaCO2: req.body.metaCO2,
    metaLimitTimes: req.body.metaLimitTimes,
    metaLimitRate: req.body.metaLimitRate,
    metaVerifyImage: req.body.metaVerifyImage,
    metaVerifyText: req.body.metaVerifyText,
    metaType: req.body.metaType,
    metaCategory: req.body.metaCategory,
    photo: req.body.photo,
    // awsETag: req.body.awsETag,
    // awsVersionId: req.body.awsVersionId,
    // awsUrl: req.body.awsUrl,
    textInput: req.body.textInput,
    viewed: false, // whether the user viewed it
    verified: req.body.verified || false // usually false
  })

  newActivity.save()
    .then(() => res.json('Activity added!'))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/unviewed', auth, (req, res) => {
  Activity.find({
    userId: req.user._id,  // only return stuff for this user
    verified: true,
    viewed: false
  })
    .then(activities => res.json(activities))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.post('/view/:id', auth, (req, res) => {
  Activity.findById(req.params.id)
    .then(activity => {
      activity.viewed = true;

      activity.save()
        .then(() => res.json('Activity Viewed!'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/admin/', auth_special, (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 0
  Activity.find({
    verified: false
  }) // get all activities
    .sort({ '_id': 'asc' })
    .skip(page * limit)
    .limit(limit)
    .then(activities => res.json(activities))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.get('/count/', auth_special, (req, res) => {
  Activity.count({
    verified: false
  })
    .then(count => res.json(count))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.delete('/:id', auth_special, (req, res) => {
  Activity.findByIdAndDelete(req.params.id)
    .then(() => res.json('Activity deleted.'))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.post('/verify/:id', auth_special, (req, res) => {
  Activity.findById(req.params.id)
    .then(activity => {
      activity.verified = true;
      activity.photo = ""; // data saver

      activity.save()
        .then(() => res.json('Activity Verified!'))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;
