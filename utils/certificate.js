const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Brand colours pulled from the PRD's UI palette
const NAVY = '#1F4E79';
const GOLD = '#C98A2C';
const DARK = '#222222';

// Renders a simple certificate PDF to disk and returns { certificateId, fileUrl }
function generateCertificatePdf({ studentName, eventTitle, eventDate, organizerName }) {
  const certificateId = `CERT-${uuidv4().slice(0, 8).toUpperCase()}`;
  const fileName = `${certificateId}.pdf`;
  const outputDir = path.join(__dirname, '..', 'public', 'uploads', 'certificates');
  const filePath = path.join(outputDir, fileName);

  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FFFFFF');
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke(NAVY);
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke(GOLD);

  doc
    .fillColor(NAVY)
    .fontSize(30)
    .font('Helvetica-Bold')
    .text('Certificate of Participation', 0, 110, { align: 'center' });

  doc
    .fillColor(DARK)
    .fontSize(14)
    .font('Helvetica')
    .text('This certifies that', 0, 170, { align: 'center' });

  doc
    .fillColor(GOLD)
    .fontSize(26)
    .font('Helvetica-Bold')
    .text(studentName, 0, 200, { align: 'center' });

  doc
    .fillColor(DARK)
    .fontSize(14)
    .font('Helvetica')
    .text(`has successfully participated in "${eventTitle}" held on ${eventDate}.`, 80, 250, {
      align: 'center',
      width: doc.page.width - 160,
    });

  doc.fontSize(11).text(`Organized by: ${organizerName}`, 0, 320, { align: 'center' });
  doc.fontSize(9).fillColor('#888888').text(`Verification ID: ${certificateId}`, 0, 360, { align: 'center' });

  doc.end();

  return { certificateId, fileUrl: `/uploads/certificates/${fileName}` };
}

module.exports = { generateCertificatePdf };
