import cloudinary from '../config/cloudinary.js';
import Menu from '../models/menu.js';

// CREATE MENU

export const createMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu',
    });

    const menuItem = await Menu.create({
      ...req.body,
      image: result.secure_url,
    });

    res.status(201).json({
      data: menuItem,
      message: 'New menu item added',
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error while creating menu item' });
  }
};


// GET MENU (WITH CATEGORY FILTER)

export const getMenu = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category; // filter by category
    }

    const menuItems = await Menu.find(filter);

    res.status(200).json({
      data: menuItems,
      message: 'Menu fetched successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
};


// UPDATE MENU ITEM

export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    // If image is provided → upload new image to cloudinary
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'menu',
      });
      updateData.image = upload.secure_url;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({
      data: updatedMenu,
      message: 'Menu updated successfully',
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Server error while updating menu' });
  }
};


// DELETE MENU ITEM

export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Server error while deleting menu' });
  }
};


//menucontroller=> isAvailable field true or false;

// TOGGLE isAvailable TRUE/FALSE

export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    return res.status(200).json({
      message: "Availability toggled successfully",
      isAvailable: menuItem.isAvailable,
      data: menuItem,
    });
  } catch (error) {
    console.error("Error toggling availability:", error);
    return res.status(500).json({ message: "Server error while updating availability" });
  }
};


// DIRECT UPDATE isAvailable (true / false)

// export const updateAvailability = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isAvailable } = req.body;

//     const updatedMenu = await Menu.findByIdAndUpdate(
//       id,
//       { isAvailable },
//       { new: true }
//     );

//     if (!updatedMenu) {
//       return res.status(404).json({ message: "Menu item not found" });
//     }

//     return res.status(200).json({
//       message: "Availability updated successfully",
//       data: updatedMenu,
//     });
//   } catch (error) {
//     console.error("Error updating availability:", error);
//     return res.status(500).json({ message: "Server error while updating availability" });
//   }
// };