import mongoose from 'mongoose';

// Singleton document (there is only ever one row) holding the currently
// active site-wide theme. The 10 available theme ids are validated here
// AND in the frontend's themes.js — keep both lists in sync.
const THEME_IDS = [
  'classicalRoyal',
  'templeSaffron',
  'peacockTeal',
  'royalIndigo',
  'kanchipuramSilk',
  'emeraldNritya',
  'sandalwoodIvory',
  'midnightMysore',
  'rosewoodBlush',
  'onyxGold',
];

const themeSettingsSchema = new mongoose.Schema(
  {
    activeTheme: {
      type: String,
      enum: THEME_IDS,
      default: 'classicalRoyal',
    },
    // When true, the public-facing site shows a maintenance notice instead
    // of the normal pages. Admin/teacher login and dashboards remain
    // fully accessible so staff can still turn it back off.
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ThemeSettings = mongoose.model('ThemeSettings', themeSettingsSchema);

export { THEME_IDS };
export default ThemeSettings;
