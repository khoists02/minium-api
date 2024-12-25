/*
 * Mimium Pty. Ltd. ("LKG") CONFIDENTIAL
 * Copyright (c) 2022 Mimium project Pty. Ltd. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of LKG. The intellectual and technical concepts contained
 * herein are proprietary to LKG and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from LKG.  Access to the source code contained herein is hereby forbidden to anyone except current LKG employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 */
import { getUserId } from "@src/utils/authentication";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, title, cb) => {
        cb(null, "uploads/"); // Files will be stored in the "uploads" folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = getUserId(req);
        cb(null, `${file.fieldname}-${uniqueSuffix}-${path.extname(file.originalname)}`);
    }
});

// File filter: Allow only image uploads
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        //@ts-ignore
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer upload middleware
export const upload = multer({ storage, fileFilter });