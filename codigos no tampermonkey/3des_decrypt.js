const CryptoJS = require('crypto-js');

function adjustKeyLength(key) {
    if (key.length < 24) {
        // en caso de que la llave sea menor a 24, se paddea hasta llegar a ese número.
        return key.padEnd(24, '\0');
    } else if (key.length > 24) {
        // en caso de que la llave sea mayor, se trunca
        return key.slice(0, 24);
    }
    return key;
}

function decryptWith3DES(encryptedText, key) {
    // se llama la función para ajustar largo
    const adjustedKey = adjustKeyLength(key);

    // se convierte el texto de base64 a binario
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);

    // configuración utilizada con crypto js para desencriptar
    const decrypted = CryptoJS.TripleDES.decrypt({
        ciphertext: encryptedData
    }, CryptoJS.enc.Utf8.parse(adjustedKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    // los datos desencriptados se pasan a texto plano
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const encryptedText = 'xEopI5pGBCQ=';   // string a desencriptar
const key = 'SEGUROSEGUROSEGUROSEGURO'; // llave

const decryptedText = decryptWith3DES(encryptedText, key);
console.log('Decrypted text:', decryptedText);
