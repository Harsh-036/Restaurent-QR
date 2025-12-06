import crypto from 'crypto';
import QRCode from 'qrcode';
import Table from '../models/table.js';
import { successResponse } from '../config/successResponse.js';

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

//get table by slug ;
export const getTableBySlug = async(req,res, next) => {
  try {
    //params //query params //req.body ;
    const {slug}  = req.params  ;
    // console.log(typeof slug)
    const filterObject = {qrSlug : slug , isActive : true} ;
    console.log(filterObject) ;

    const table = await Table.findOne({qrSlug : slug , isActive : true})
    console.log(table)
    if(!table){
       const error = new Error('No Table found with this slug');
       error.status = 404 ;
       throw error
    }
res.status(200).json({
  success : true ,
  data : table
})
  } catch (error) {
   next(error)
  }
}

export const getAllTables = async(req,res, next)=>{
  try {
    const tables = await Table.find();
    if(tables.length <= 0){
      const error = new Error("No tables found")
      error.status = 404 ;
      throw error
    }
   successResponse(res,200,tables)
  } catch (error) {
    next(error)
  }
}

export const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { tableNumber, capacity },
      { new: true, runValidators: true }
    );

    if (!updatedTable) {
      const error = new Error('Table not found');
      error.status = 404;
      throw error;
    }

    successResponse(res, 200, updatedTable);
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTable = await Table.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedTable) {
      const error = new Error('Table not found');
      error.status = 404;
      throw error;
    }

    successResponse(res, 200, { message: 'Table deleted successfully' });
  } catch (error) {
    next(error);
  }
};
