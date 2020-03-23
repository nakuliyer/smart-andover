const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    metaName: String,
    metaId: String,
    metaPts: Number,
    metaCO2: Number,
    metaLimitTimes: Number,
    metaLimitRate: String,
    metaVerifyImage: Boolean,
    metaVerifyText: Boolean,
    metaType: String,
    metaCategory: String,
    photo: String,
    // awsETag: String,
    // awsVersionId: String,
    // awsUrl: String,
    textInput: String,
    verified: Boolean,
    viewed: Boolean
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
