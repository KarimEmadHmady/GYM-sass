import { getGymSettingsService, upsertGymSettingsService } from '../services/gymSettings.service.js';

export const getGymSettings = async (req, res) => {
  try {
    const settings = await getGymSettingsService();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGymSettings = async (req, res) => {
  try {
    const updated = await upsertGymSettingsService(req.body);
    res.status(200).json({ message: 'Gym settings updated successfully', settings: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
