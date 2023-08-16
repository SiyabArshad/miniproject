const User = require('../models/User'); 
const multer = require('multer');
const path = require('path');
const ResponseManager = require('../helpers/CustomError'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/profilePictures'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(ResponseManager.errorResponse('User not found', 404));
    }
    upload.single('profilePicture')(req, res, async function (err) {
      if (err) {
        return res.status(500).json(ResponseManager.errorResponse('Profile picture upload failed', 500));
      }
      user.profilePicture = req.file.path;

      await user.save();

      return res.status(200).json(ResponseManager.successResponse({}, 'Profile picture uploaded successfully'));
    });
  } catch (error) {
    console.error('Error while uploading profile picture:', error);
    res.status(500).json(ResponseManager.errorResponse('Internal server error', 500));
  }
};

module.exports = {
  uploadProfilePicture,
};
