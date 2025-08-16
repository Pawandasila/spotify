import DataURIParser from "datauri/parser.js";
import path from 'path'

const getBuffer = (file: Express.Multer.File) => {
    const parser = new DataURIParser();

    const extname = path.extname(file.originalname);
    return parser.format(extname, file.buffer);
};

export default getBuffer;