import mongoose from 'mongoose';

const performanceRequestSchema = new mongoose.Schema(
  {
    organizerName: {
      type: String,
      required: [true, 'Organizer / Client name is required'],
      trim: true,
    },
    organization: {
      type: String,
      default: 'Private Event / Festival',
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    eventType: {
      type: String,
      enum: ['Cultural Festival', 'Corporate Gala', 'Temple Annual Festival', 'Private Celebration', 'School/College Event', 'International Showcase'],
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    troupeSize: {
      type: String,
      enum: ['Solo Performance (Guru)', 'Duet Showcase', 'Group Troupe (4-6 Dancers)', 'Grand Troupe (8+ Dancers with Live Orchestra)'],
      default: 'Group Troupe (4-6 Dancers)',
    },
    estimatedBudget: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'confirmed', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const PerformanceRequest = mongoose.models.PerformanceRequest || mongoose.model('PerformanceRequest', performanceRequestSchema);

export default PerformanceRequest;