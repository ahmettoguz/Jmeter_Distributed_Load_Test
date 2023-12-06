import multer from 'multer';
import path from 'path';

const storageJMX = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './storage/upload/');
    },
    filename: (req, file, cb) => {
        cb(null, `loadtest.jmx`);
    },
});

const uploadJMX = multer({
    storage: storageJMX,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        const extName = path.extname(file.originalname).toLowerCase();
        if (extName === '.jmx')
            cb(null, true);
        else
            cb(new Error('ERROR: Only jmx files can be uploaded!!!'));
    },
});

export default uploadJMX;
