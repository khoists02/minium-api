import { getUserId } from "@src/utils/authentication";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, title, cb) => {
        cb(null, "uploads/"); // Files will be stored in the "uploads" folder
    },
    filename: (req, file, cb) => {
        console.log(req.file, { file });
        const uniqueSuffix = Date.now() + '-' + getUserId(req);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter: Allow only image uploads
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        //@ts-ignore
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer upload middleware
export const upload = multer({ storage, fileFilter });