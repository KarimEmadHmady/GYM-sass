import mongoose from 'mongoose';

const gymSettingsSchema = new mongoose.Schema(
  {
    gymName: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    workingHours: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    membershipPlans: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        durationDays: { type: Number, required: true },
        features: [{ type: String }],
      },
    ],
    paymentSettings: {
      cash: { type: Boolean, default: true },
      card: { type: Boolean, default: false },
      onlineGateway: { type: Boolean, default: false },
      gatewayName: { type: String, default: '' },
    },
    policies: {
      terms: { type: String, default: '' },
      privacy: { type: String, default: '' },
      refund: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// ensure single document usage could be enforced at controller level

const GymSettings = mongoose.model('GymSettings', gymSettingsSchema);
export default GymSettings;
