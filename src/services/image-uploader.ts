import fs from "fs";
import path from "path";
import multer from "multer";

class ImageUpload {
    mealsDir: string;
    storage: multer.StorageEngine;
    upload: multer.Multer;

    constructor() {
        this.mealsDir = path.join(__dirname, "../../uploads/meals/");

        if (!fs.existsSync(this.mealsDir)) {
            fs.mkdirSync(this.mealsDir, { recursive: true });
        }

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.mealsDir);
            },
            filename: (req, file, cb) => {
                const title = req.body.title || "untitled"; // Título da refeição
                const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "-"); // Sanitize o título
                const extension = path.extname(file.originalname); // Obtém a extensão do arquivo
                const filename = `${sanitizedTitle}-${Date.now()}${extension}`; // Nome do arquivo
                cb(null, filename);
            },
        });

        this.upload = multer({ storage: this.storage });
    }

    getUploadMiddleware() {
        return this.upload.single("image");
    }
}

export default ImageUpload;
