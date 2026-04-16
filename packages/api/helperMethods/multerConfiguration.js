const path = require('path');
const { BadRequestError } = require('../errors');


const getConfiguration = () => {
  return {
    dest: 'uploads/', limits: {
      fileSize: 2 * 1024 * 1024, // 2MB (in bytes)

    },
    fileFilter: (req, file, cb) => {
      // Define allowed extensions using regex
      const fileTypes = /jpeg|jpg|png|gif/;
      // Check extension name
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime type
      const mimeType = fileTypes.test(file.mimetype);

      if (extName && mimeType) {
        return cb(null, true);
      } else {
        cb(new BadRequestError(req.t('badImageFileType')));
      }
    }
  };
};

module.exports = { getConfiguration };