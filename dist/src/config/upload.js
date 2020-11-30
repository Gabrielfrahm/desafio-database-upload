"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var tmpFolder = path_1.default.resolve(__dirname, '..', '..', 'tmp');
exports.default = {
    directory: tmpFolder,
    storage: multer_1.default.diskStorage({
        destination: tmpFolder,
        filename: function (request, file, callback) {
            // const fileHash = crypto.randomBytes(10).toString('hex');
            // const fileName = `${fileHash}-${file.originalname}`;
            var fileName = "" + file.originalname;
            return callback(null, fileName);
        },
    }),
};
