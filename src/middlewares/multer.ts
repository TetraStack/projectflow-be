import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1000 * 1000
    }
})