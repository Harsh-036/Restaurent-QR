import cloudinary from '../config/cloudinary.js';
import Menu from '../models/menu.js'
console.log(cloudinary);
export const createMenu = async (req, res) => {
  // how can i access the image path here
  console.log(req.file);
  console.log(req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const filePath = req.file.path;
    console.log(filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu',
    });
    console.log(result);
    console.log('Creating menu item with data:', { ...req.body, image: result.secure_url });
    const menuItem = await Menu.create({
      ...req.body,
      image: result.secure_url,
    });
    console.log('Menu item created:', menuItem);
    res.status(201).json({
      data: menuItem,
      message: 'New menu item added',
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error while creating menu item' });
  }
};

//name ,description ,  price = {req.body};

export const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    res.status(200).json({
      data: menuItems,
      message: 'Menu items fetched successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
};