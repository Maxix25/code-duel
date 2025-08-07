import multer from 'multer';
import getUsernameByToken from './utils/getUsernameByToken';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        const username = getUsernameByToken(req.cookies.token);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${username}${fileExtension}`);
    }
});

export const upload = multer({ storage });