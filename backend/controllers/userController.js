import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

//memory storage so we can upload directly to Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    // Define allowed fields to prevent unauthorized updates
    const allowedUpdates = ['name', 'email', 'bio', 'location']; // Adjust as needed
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });


    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msg: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation error', error: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};


export const uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              resource_type: 'image',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          

          uploadStream.end(req.file.buffer);
        });
      };


      const result = await uploadToCloudinary();
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: result.secure_url },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json({
        msg: 'Avatar uploaded successfully',
        user,
        avatarUrl: result.secure_url
      });

    } catch (err) {
      console.error('Upload avatar error:', err);
      if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ msg: 'Only image files are allowed' });
      }
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  }
];