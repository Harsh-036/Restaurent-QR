export const getAllCoupans = ()=>{

}

import Coupan from "../models/coupan.js";

export const registerCoupan = async (req, res) => {
  try {
    const {
      code,
      discountType,
      maxDiscount,
      validFrom,
      validTo,
      usageLimit,
      minOrderAmount,
      description,
    } = req.body;

    if (!code || !discountType) {
      return res
        .status(400)
        .json({ message: 'Code and discountType are required' });
    }

    const existingCoupan = await Coupan.findOne({ code: code.toUpperCase() });
    if (existingCoupan) {
      return res.status(400).json({ message: 'Coupan code already exists' });
    }

    const coupanData = {
      code: code.toUpperCase(),
      discountType,
      maxDiscount: maxDiscount || null,
      validFrom: validFrom || new Date(),
      validTo: validTo || null,

      usageLimit: usageLimit || null,
      minOrderAmount: minOrderAmount || 0,

      description: description || '',
      isActive: true,
      usedCount: 0,
    };

    const savedCoupan = await new Coupan(coupanData).save();

    res.status(201).json({
      message: 'Coupan created successfully',
      coupan: savedCoupan,
    });
  } catch (error) {
    console.error('Error registering coupan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
