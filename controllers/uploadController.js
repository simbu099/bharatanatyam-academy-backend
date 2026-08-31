import cloudinary from '../config/cloudinary.js';

// Allowed logical "folders" an uploader may target — keeps admin uploads
// organized in Cloudinary and prevents arbitrary path injection via the
// request body.
const ALLOWED_FOLDERS = ['gallery', 'courses', 'hero', 'guru', 'general'];

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin (or Teacher, for their own profile photo)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const requestedFolder = ALLOWED_FOLDERS.includes(req.body.folder) ? req.body.folder : 'general';
    const folder = `bharatanatyam-academy/${requestedFolder}`;

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            // Keep uploads reasonably sized and web-optimized without
            // distorting the source image's aspect ratio.
            transformation: [{ width: 1920, height: 1920, crop: 'limit', quality: 'auto:good' }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

    const result = await uploadFromBuffer();

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error.message);
    res.status(500).json({ success: false, message: 'Image upload failed. Please try again.' });
  }
};

// @desc    Delete an image from Cloudinary (so replacing/removing a
//          gallery/course image doesn't leave orphaned files behind)
// @route   DELETE /api/upload
// @access  Private/Admin
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId || !publicId.startsWith('bharatanatyam-academy/')) {
      return res.status(400).json({ success: false, message: 'A valid publicId is required' });
    }
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image deletion failed' });
  }
};
