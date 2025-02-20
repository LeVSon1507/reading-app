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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CombineImagePage;
var pdf_lib_1 = require("pdf-lib");
var fs = require("fs/promises"); // or 'fs' if not using async/await
function CombineImagePage() {
    function combineImagesToPdf(imagePaths, outputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var pdfDoc, _i, imagePaths_1, imagePath, imageBytes, image, page, _a, width, height, imageAspectRatio, pageAspectRatio, scaledWidth, scaledHeight, xOffset, yOffset, error_1, pdfBytes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                    case 1:
                        pdfDoc = _b.sent();
                        _i = 0, imagePaths_1 = imagePaths;
                        _b.label = 2;
                    case 2:
                        if (!(_i < imagePaths_1.length)) return [3 /*break*/, 8];
                        imagePath = imagePaths_1[_i];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fs.readFile(imagePath)];
                    case 4:
                        imageBytes = _b.sent();
                        return [4 /*yield*/, pdfDoc.embedPng(imageBytes)];
                    case 5:
                        image = _b.sent();
                        page = pdfDoc.addPage();
                        _a = page.getSize(), width = _a.width, height = _a.height;
                        imageAspectRatio = image.width / image.height;
                        pageAspectRatio = width / height;
                        scaledWidth = void 0, scaledHeight = void 0;
                        if (imageAspectRatio >= pageAspectRatio) {
                            scaledWidth = width;
                            scaledHeight = width / imageAspectRatio;
                        }
                        else {
                            scaledHeight = height;
                            scaledWidth = height * imageAspectRatio;
                        }
                        xOffset = (width - scaledWidth) / 2;
                        yOffset = (height - scaledHeight) / 2;
                        page.drawImage(image, {
                            x: xOffset,
                            y: yOffset,
                            width: scaledWidth,
                            height: scaledHeight,
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        console.error("Error processing image ".concat(imagePath, ":"), error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [4 /*yield*/, pdfDoc.save()];
                    case 9:
                        pdfBytes = _b.sent();
                        return [4 /*yield*/, fs.writeFile(outputPath, pdfBytes)];
                    case 10:
                        _b.sent(); // or fs.writeFileSync if not async
                        return [2 /*return*/];
                }
            });
        });
    }
    // Example usage:
    var imagePaths = [
        "src/app/combine-image/pdf-storage/1.jpg",
        "src/app/combine-image/pdf-storage/1.jpg",
    ];
    var outputPath = "src/app/combine-image/output-pdf";
    combineImagesToPdf(imagePaths, outputPath)
        .then(function () { return console.log("PDF created successfully!"); })
        .catch(console.error);
    return null;
}
