import ThemeSettings, { THEME_IDS } from '../models/ThemeSettings.js';
import { logAudit } from '../utils/auditLog.js';

// There is only ever one settings document. This helper fetches it,
// creating it with defaults on first use.
const getOrCreateSettings = async () => {
  let settings = await ThemeSettings.findOne();
  if (!settings) {
    settings = await ThemeSettings.create({});
  }
  return settings;
};

// @desc    Get the currently active site theme (public — the storefront
//          needs this on every page load, logged in or not).
// @route   GET /api/settings/theme
// @access  Public
export const getActiveTheme = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: {
        activeTheme: settings.activeTheme,
        maintenanceMode: settings.maintenanceMode,
        availableThemes: THEME_IDS,
      },
    });
  } catch (error) {
    // Never let a settings lookup failure break the whole site — fall
    // back to defaults instead of a hard error.
    res.status(200).json({
      success: true,
      data: { activeTheme: 'classicalRoyal', maintenanceMode: false, availableThemes: THEME_IDS },
    });
  }
};

// @desc    Update the active site theme
// @route   PUT /api/settings/theme
// @access  Private/Admin
export const updateActiveTheme = async (req, res) => {
  try {
    const { activeTheme } = req.body;
    if (!THEME_IDS.includes(activeTheme)) {
      return res.status(400).json({
        success: false,
        message: `Invalid theme id. Must be one of: ${THEME_IDS.join(', ')}`,
      });
    }
    const settings = await getOrCreateSettings();
    settings.activeTheme = activeTheme;
    await settings.save();
    await logAudit(req, 'theme.update', `Changed site theme to "${activeTheme}"`);
    res.status(200).json({ success: true, data: { activeTheme: settings.activeTheme } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle maintenance mode for the public site
// @route   PUT /api/settings/maintenance
// @access  Private/Admin
export const updateMaintenanceMode = async (req, res) => {
  try {
    const { maintenanceMode } = req.body;
    if (typeof maintenanceMode !== 'boolean') {
      return res.status(400).json({ success: false, message: 'maintenanceMode must be true or false' });
    }
    const settings = await getOrCreateSettings();
    settings.maintenanceMode = maintenanceMode;
    await settings.save();
    await logAudit(req, 'maintenance.toggle', `${maintenanceMode ? 'Enabled' : 'Disabled'} maintenance mode`);
    res.status(200).json({ success: true, data: { maintenanceMode: settings.maintenanceMode } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
