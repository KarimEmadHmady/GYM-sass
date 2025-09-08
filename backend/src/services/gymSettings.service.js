import GymSettings from '../models/gymSettings.model.js';

export const getGymSettingsService = async () => {
  let doc = await GymSettings.findOne();
  if (!doc) {
    doc = await GymSettings.create({});
  }
  return doc;
};

export const upsertGymSettingsService = async (data) => {
  const doc = await GymSettings.findOneAndUpdate({}, data, { new: true, upsert: true });
  return doc;
};
