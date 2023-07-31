"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReference = void 0;
function generateReference() {
    const digits = '0123456789';
    let generatedSeed = '';
    const referenceAppend = 'Belrald-PYK-';
    for (let i = 0; i < 8; i++) {
        generatedSeed += digits.charAt(Math.floor(Math.random() * 10));
    }
    const reference = referenceAppend + generatedSeed;
    return reference;
}
exports.generateReference = generateReference;
//# sourceMappingURL=generateFunc.js.map