import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../redux/couponSlice';
import Sidebar from '../Sidebar';

const CouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupon);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    minOrderAmount: '',
    description: '',
    isFirstOrder: false,
  });

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        validFrom: formData.validFrom || new Date().toISOString(),
        validTo: formData.validTo ? new Date(formData.validTo).toISOString() : null,
      };

      if (editingCoupon) {
        await dispatch(updateCoupon({ id: editingCoupon._id, couponData })).unwrap();
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || '',
      maxDiscount: coupon.maxDiscount || '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validTo: coupon.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : '',
      minOrderAmount: coupon.minOrderAmount || '',
      description: coupon.description || '',
      isFirstOrder: coupon.isFirstOrder || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await dispatch(deleteCoupon(id)).unwrap();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      minOrderAmount: '',
      description: '',
      isFirstOrder: false,
    });
    setEditingCoupon(null);
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Fixed Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="ml-64 p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Coupons Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              Add New Coupon
            </button>
          </div>

          {error && <div className="text-red-400 mb-4">Error: {error}</div>}

          {/* Coupon Form */}
          {showForm && (
            <div className="mb-8 bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixedAmount">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Discount (optional)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valid From</label>
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valid To (optional)</label>
                  <input
                    type="date"
                    name="validTo"
                    value={formData.validTo}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order Amount</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                    rows="3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFirstOrder"
                      checked={formData.isFirstOrder}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    First Order Only
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Coupons List */}
          {loading && !showForm && <div className="text-gray-300">Loading coupons...</div>}

          {!loading && !error && (
            <div className="space-y-4">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <div
                    key={coupon._id || coupon.code}
                    className="p-4 border rounded-lg transition bg-white/5 border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">{coupon.code}</div>
                        <div className="text-sm text-gray-300 mt-1">{coupon.description}</div>
                        <div className="text-sm text-gray-400 mt-2">
                          Type: {coupon.discountType} | Value: {coupon.discountValue}
                          {coupon.maxDiscount && ` | Max: ₹${coupon.maxDiscount}`}
                        </div>
                        <div className="text-sm text-gray-400">
                          Min Order: ₹{coupon.minOrderAmount || 0} |
                          Available: {coupon.isAvailable ? 'Yes' : 'No'}
                          {coupon.isFirstOrder && ' | First Order Only'}
                        </div>
                        <div className="text-sm text-gray-400">
                          Valid: {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : 'N/A'} -
                          {coupon.validTo ? new Date(coupon.validTo).toLocaleDateString() : 'No expiry'}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-300 text-center py-8">No coupons available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
