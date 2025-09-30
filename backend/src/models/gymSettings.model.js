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
    membershipCardStyle: {
      headerColor: { type: String, default: '#007bff' },
      backgroundColor: { type: String, default: '#f8f9fa' },
      textColor: { type: String, default: '#000000' },
      accentColor: { type: String, default: '#007bff' },
      headerTitle: { type: String, default: 'GYM MEMBERSHIP' },
      showGymName: { type: Boolean, default: true },
      showMemberEmail: { type: Boolean, default: false },
      showValidUntil: { type: Boolean, default: true },
      logoUrl: { type: String, default: '' },
      logoWidth: { type: Number, default: 60 },
      logoHeight: { type: Number, default: 60 },
    },
  },
  { timestamps: true }
);

// ensure single document usage could be enforced at controller level

const GymSettings = mongoose.model('GymSettings', gymSettingsSchema);
export default GymSettings;
