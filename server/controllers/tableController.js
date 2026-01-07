import crypto from "crypto";
import QRCode from "qrcode";
import Table from "../models/table.js";
import { successResponse } from "../config/successResponse.js";
import os from "os";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    //generate qr slug 34jklfsdf
    const qrSlug = crypto.randomBytes(6).toString("hex");
    console.log(qrSlug);

    //networ api setup
    console.log(os.networkInterfaces()["Wi-Fi"]);
const networks = os.networkInterfaces();
let ipAddress = null;

for (const name of Object.keys(networks)) {
  for (const el of networks[name]) {
    if (el.family === "IPv4" && !el.internal) {
      ipAddress = el.address;
      break;
    }
  }
  if (ipAddress) break;
}

if (!ipAddress) {
  throw new Error("No IPv4 address found");
}

console.log("Using IP:", ipAddress);


    //generate qr code url
    const qrCodeURL = `http://${ipAddress}:5173/scan-qr?qr=${qrSlug}`;
    console.log(qrCodeURL);

    //embed this qrCodeURL with qrCode
    QRCode.toDataURL(qrCodeURL, async (err, url) => {
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
      message: ("the error is this:", error.message),
    });
  }
};

//get table by slug ;
export const getTableBySlug = async (req, res, next) => {
  try {
    //params //query params //req.body ;
    const { slug } = req.params;
    // console.log(typeof slug)
    const filterObject = { qrSlug: slug, isActive: true };
    console.log(filterObject);

    const table = await Table.findOne({ qrSlug: slug, isActive: true });
    console.log(table);
    if (!table) {
      const error = new Error("No Table found with this slug");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTables = async (req, res, next) => {
  try {
    const tables = await Table.find();
    if (tables.length <= 0) {
      const error = new Error("No tables found");
      error.status = 404;
      throw error;
    }
    successResponse(res, 200, tables);
  } catch (error) {
    next(error);
  }
};

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
      const error = new Error("Table not found");
      error.status = 404;
      throw error;
    }

    successResponse(res, 200, updatedTable);
  } catch (error) {
    next(error);
  }
};

export const toggleTableStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);

    if (!table) {
      const error = new Error("Table not found");
      error.status = 404;
      throw error;
    }

    table.isActive = !table.isActive;
    await table.save();

    successResponse(res, 200, table);
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTable = await Table.findByIdAndDelete(id);

    if (!deletedTable) {
      const error = new Error("Table not found");
      error.status = 404;
      throw error;
    }

    successResponse(res, 200, { message: "Table deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// import os from 'os' ;

// console.log(os.networkInterfaces()['Wi-Fi'])

// const data = os.networkInterfaces()['Wi-Fi']
// let ipAddress = null
// for(const el of data){
// if(el.family === "IPv4")
//     ipAddress = el.address
// }
// console.log(ipAddress)
