const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Generates a unique, unguessable token to embed in a registration's QR code
function generateQrToken() {
  return `CEMS-${uuidv4()}`;
}

// Returns a base64 data URL of the QR image for a given token
async function generateQrImage(token) {
  return QRCode.toDataURL(token, { margin: 2, width: 300 });
}

module.exports = { generateQrToken, generateQrImage };
