"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var csv_parse_1 = __importDefault(require("csv-parse"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// import { getCustomRepository, getRepository } from 'typeorm';
var upload_1 = __importDefault(require("../config/upload"));
var CreateTransactionService_1 = __importDefault(require("./CreateTransactionService"));
// import TransactionRepository from '../repositories/TransactionsRepository';
var ImportTransactionsService = /** @class */ (function () {
    function ImportTransactionsService() {
    }
    ImportTransactionsService.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var createTransaction, csvFilePath, readCSVStream, parseStream, parseCSV, lines, _i, lines_1, data, title, type, value, category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createTransaction = new CreateTransactionService_1.default();
                        csvFilePath = path_1.default.resolve(upload_1.default.directory, 'import_template.csv');
                        readCSVStream = fs_1.default.createReadStream(csvFilePath);
                        parseStream = csv_parse_1.default({
                            from_line: 2,
                            ltrim: true,
                            rtrim: true,
                        });
                        parseCSV = readCSVStream.pipe(parseStream);
                        lines = [];
                        parseCSV.on('data', function (line) {
                            lines.push(line);
                        });
                        return [4 /*yield*/, new Promise(function (resolve) {
                                parseCSV.on('end', resolve);
                            })];
                    case 1:
                        _a.sent();
                        _i = 0, lines_1 = lines;
                        _a.label = 2;
                    case 2:
                        if (!(_i < lines_1.length)) return [3 /*break*/, 5];
                        data = lines_1[_i];
                        title = data[0], type = data[1], value = data[2], category = data[3];
                        // eslint-disable-next-line no-await-in-loop
                        return [4 /*yield*/, createTransaction.execute({
                                title: title,
                                type: type,
                                value: value,
                                category: category,
                            })];
                    case 3:
                        // eslint-disable-next-line no-await-in-loop
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, lines];
                }
            });
        });
    };
    return ImportTransactionsService;
}());
exports.default = ImportTransactionsService;
