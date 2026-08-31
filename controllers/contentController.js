import SiteContent from '../models/SiteContent.js';
import { logAudit } from '../utils/auditLog.js';

const getOrCreateContent = async () => {
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create({});
  }
  return content;
};

// @desc    Get the landing page content (hero, about/guru bio, contact info)
// @route   GET /api/content
// @access  Public
export const getSiteContent = async (req, res) => {
  try {
    const content = await getOrCreateContent();
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    // Fall back to schema defaults if the DB read fails, so the public
    // site never breaks because of a content-store hiccup.
    res.status(200).json({ success: true, data: new SiteContent({}) });
  }
};

// @desc    Update landing page content (hero, about/guru bio, contact info)
// @route   PUT /api/content
// @access  Private/Admin
export const updateSiteContent = async (req, res) => {
  try {
    const content = await getOrCreateContent();
    const { hero, about, contact } = req.body;

    if (hero) content.hero = { ...content.hero.toObject(), ...hero };
    if (about) content.about = { ...content.about.toObject(), ...about };
    if (contact) content.contact = { ...content.contact.toObject(), ...contact };

    await content.save();
    await logAudit(req, 'content.update', 'Updated website landing page content');
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
