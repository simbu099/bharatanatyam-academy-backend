import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Performances', 'Arangetram', 'Workshops', 'Academy Life', 'Awards'],
      default: 'Performances',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    eventDate: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;