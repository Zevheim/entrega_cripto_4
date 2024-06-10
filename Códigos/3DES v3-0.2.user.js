// ==UserScript==
// @name         3DES v3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Desencriptar 3DES y mostrar en la página
// @author       You
// @match        *https://cripto.tiiny.site/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function loadScript(url, integrity, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.integrity = integrity;
        script.crossOrigin = 'anonymous';
        script.onload = callback;
        document.head.appendChild(script);
    }

    loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
        'sha384-S3wQ/l0OsbJoFeJC81UIr3JOlx/OzNJpRt1bV+yhpWQxPAahfpQtpxBSfn+Isslc',
        function() {
            function adjustKeyLength(key) {
                if (key.length < 24) {
                    return key.padEnd(24, '\0');
                } else if (key.length > 24) {
                    return key.slice(0, 24);
                }
                return key;
            }

            function decryptWith3DES(encryptedText, key) {
                const adjustedKey = adjustKeyLength(key);
                const encryptedData = CryptoJS.enc.Base64.parse(encryptedText);
                const decrypted = CryptoJS.TripleDES.decrypt({
                    ciphertext: encryptedData
                }, CryptoJS.enc.Utf8.parse(adjustedKey), {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8);
            }

            const textContent = document.body.innerText;
            let extractedKey = textContent.match(/[A-Z]/g).join('');
            extractedKey = adjustKeyLength(extractedKey);

            const divElements = document.querySelectorAll('div[id]');
            console.log('la clave es:', extractedKey, "\n");
            console.log('Los mensajes cifrados son:\n');

            divElements.forEach(function(div) {
                const encryptedText = div.id;
                const decryptedText = decryptWith3DES(encryptedText, extractedKey);
                console.log(encryptedText, ':', decryptedText);


                const decryptedMessageElement = document.createElement('p');
                decryptedMessageElement.textContent = `mensaje descenriptado para ${encryptedText}: ${decryptedText}`;
                div.appendChild(decryptedMessageElement);
            });
        }
    );
})();
