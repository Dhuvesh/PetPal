import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required']
  },
  age: {
    type: String,
    required: [true, 'Pet age is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  weight: {
    type: String,
    required: [true, 'Weight is required']
  },
  breed: {
    type: String,
    required: [true, 'Breed is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  traits: [{
    type: String
  }],
  characteristics: [{
    type: String
  }],
  photos: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;