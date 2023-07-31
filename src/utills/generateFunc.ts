export function generateReference() {
    const digits = '0123456789';
    let generatedSeed = '';
    const referenceAppend = 'Belrald-PYK-';

    for (let i = 0; i < 8; i++) {
        generatedSeed += digits.charAt(Math.floor(Math.random() * 10));
    }

    const reference = referenceAppend + generatedSeed;
    return reference;


}