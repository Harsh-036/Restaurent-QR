import Coupan from "../models/coupan.js";
import Cart from '../models/cart.js'
import User from '../models/user.js'


export const getAllCoupans = async (req, res)=>{
  try {
    const { cartTotal } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId);
    console.log('fetched from database', user);
    //user cart fetch //totalCartPrice ;
    const cart = await Cart.findOne({ userId });
    let totalCartPrice;
    if (cart) {
      totalCartPrice = cart.totalCartPrice;
    }
    console.log(totalCartPrice);

    //how to fetch all coupans than apply map method ;
    const allCoupans = await Coupan.find();
    console.log(allCoupans);

    // const AvailableCoupans = allCoupans.filter((coupan) => {
    //   return (
    //     totalCartPrice > coupan.minOrderAmount &&
    //     new Date() > coupan.validFrom &&
    //     new Date() < coupan.validTo
    //   );
    // });
    // console.log(filteredCoupans)
    //discount value again the totalprice ;

    const CoupansAfterCalculation = allCoupans.map((coupans) => {
      //calculate isAvailable flag
      const isCartPriceMeetsMinOrderAmount =
        totalCartPrice > coupans.minOrderAmount;
      const isCoupanIsValid =
        new Date() > coupans.validFrom && new Date() < coupans.validTo;
      const isUserFirstTime = user.totalOrders === 0;
      const isCoupanIsForFirstOrder = coupans.isFirstOrder;
      console.log(coupans.code, isCartPriceMeetsMinOrderAmount);

      const isAvailable =
        isCartPriceMeetsMinOrderAmount &&
        isCoupanIsValid &&
        (isCoupanIsForFirstOrder ? isUserFirstTime : true);

      let discountAmount;
      if (coupans.discountType) {
        if (coupans.discountType === 'fixedAmount') {
          discountAmount = totalCartPrice - coupans.discountValue;
        }
        if (coupans.discountType === 'percentage') {
          discountAmount = (totalCartPrice * coupans.discountValue) / 100;
        }
        if (coupans.maxDiscount && discountAmount > coupans.maxDiscount) {
          discountAmount = coupans.maxDiscount;
        }
      }
      return {
        _id: coupans._id,

        finalAmount: totalCartPrice - discountAmount,
        code: coupans.code,
        discountType: coupans.discountType,
        description: coupans.description,
        discountAmount,
        isFirstOrder: coupans.isFirstOrder,
        minOrderAmount: coupans.minOrderAmount,
        validFrom: coupans.validFrom,
        validTo: coupans.validTo,
        isAvailable,
        isCartPriceMeetsMinOrderAmount,
        totalCartPrice,
      };
    });
    //  500 * 10 / 100 => 50
    //1000 * 10 / 100 => 100   maxDiscount = 150
    //2000 * 10 / 200 > maxDiscount = 150
    // disocuntValue = maxDiscount;
    res.json({
      CoupansAfterCalculation,
    });
  } catch (error) {}
};



export const registerCoupan = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
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
      discountValue: discountValue || null,
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

// Update coupon
export const updateCoupan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existingCoupan = await Coupan.findOne({
        code: updateData.code,
        _id: { $ne: id }
      });
      if (existingCoupan) {
        return res.status(400).json({ message: 'Coupan code already exists' });
      }
    }

    const updatedCoupan = await Coupan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedCoupan) {
      return res.status(404).json({ message: 'Coupan not found' });
    }

    res.json({
      message: 'Coupan updated successfully',
      coupan: updatedCoupan,
    });
  } catch (error) {
    console.error('Error updating coupan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete coupon
export const deleteCoupan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupan = await Coupan.findByIdAndDelete(id);

    if (!deletedCoupan) {
      return res.status(404).json({ message: 'Coupan not found' });
    }

    res.json({
      message: 'Coupan deleted successfully',
      coupan: deletedCoupan,
    });
  } catch (error) {
    console.error('Error deleting coupan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//validate coupan, applyCoupan
