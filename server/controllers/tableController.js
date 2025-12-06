import crypto from 'crypto';
import QRCode from 'qrcode';
import Table from '../models/table.js';

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    //generate qr slug 34jklfsdf
    const qrSlug = crypto.randomBytes(6).toString('hex');
    console.log(qrSlug);

    //generate qr code url
    const qrCodeURL = `http://localhost:5173/scan-qr?qr=${qrSlug}`;
    console.log(qrCodeURL);

    //embed this qrCodeURL with qrCode
    QRCode.toDataURL(qrCodeURL, async (err,url)=>{
    console.log(url);
    const qrImage = url;

    const table = new Table({
        tableNumber,
        capacity,
        qrImage,
        qrCodeURL,
        qrSlug,
      });
    await table.save();

    res.status(201).json({
      success: true,
      data: table,
    });
        

});

    
  } catch (error) {
    res.status(500).json({
      message: ('the error is this:',error.message),
    });
  }
};
