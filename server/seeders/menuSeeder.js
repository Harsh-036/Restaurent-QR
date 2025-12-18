import mongoose from 'mongoose';
import Menu from '../models/menu.js';
import dbConnect from '../config/database.js';


const menuItems = [
  {
    "name": "Paneer Tikka",
    "description": "Marinated paneer cubes grilled to perfection with spices",
    "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
    "price": 299,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Veg Spring Rolls",
    "description": "Crispy rolls stuffed with fresh vegetables",
    "image": "https://images.unsplash.com/photo-1604909053196-0b3b1c38c5e5?w=800&h=600&fit=crop",
    "price": 249,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Cheese Balls",
    "description": "Golden fried cheese balls with crunchy coating",
    "image": "https://images.unsplash.com/photo-1625944230945-1b7dd2c5f3c1?w=800&h=600&fit=crop",
    "price": 269,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Crispy Corn",
    "description": "Deep fried corn tossed with spices",
    "image": "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop",
    "price": 229,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Hara Bhara Kabab",
    "description": "Spinach and green pea kababs shallow fried",
    "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8b3a?w=800&h=600&fit=crop",
    "price": 259,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Garlic Bread",
    "description": "Toasted bread topped with garlic butter",
    "image": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&h=600&fit=crop",
    "price": 199,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Chilli Paneer",
    "description": "Paneer cubes tossed in spicy chilli sauce",
    "image": "https://images.unsplash.com/photo-1628294896516-344152572ee8?w=800&h=600&fit=crop",
    "price": 289,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "French Fries",
    "description": "Classic crispy salted fries",
    "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&h=600&fit=crop",
    "price": 179,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Stuffed Mushrooms",
    "description": "Mushrooms stuffed with cheese and herbs",
    "image": "https://images.unsplash.com/photo-1625944230946-babfe1fdbfc2?w=800&h=600&fit=crop",
    "price": 279,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Veg Manchurian",
    "description": "Fried veg balls in Indo-Chinese gravy",
    "image": "https://images.unsplash.com/photo-1630409346695-2c07b2c9d8cf?w=800&h=600&fit=crop",
    "price": 269,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Paneer Pakora",
    "description": "Gram flour coated paneer fritters",
    "image": "https://images.unsplash.com/photo-1617196037304-5e3f2c9f7e4a?w=800&h=600&fit=crop",
    "price": 249,
    "category": "Starters",
    "isAvailable": true
  },
  {
    "name": "Nachos with Salsa",
    "description": "Crispy nachos served with salsa dip",
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop",
    "price": 239,
    "category": "Starters",
    "isAvailable": true
  },

  {
    "name": "Paneer Butter Masala",
    "description": "Paneer cooked in rich tomato butter gravy",
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop",
    "price": 399,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "name": "Veg Biryani",
    "description": "Aromatic rice cooked with vegetables and spices",
    "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop",
    "price": 349,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "name": "Dal Makhani",
    "description": "Slow cooked black lentils with cream",
    "image": "https://images.unsplash.com/photo-1626776876729-babf3f0c8c85?w=800&h=600&fit=crop",
    "price": 329,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "name": "Shahi Paneer",
    "description": "Paneer in creamy cashew gravy",
    "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
    "price": 389,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "name": "Veg Fried Rice",
    "description": "Stir fried rice with vegetables",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
    "price": 299,
    "category": "Main Course",
    "isAvailable": true
  },
  {
    "name": "Kadhai Paneer",
    "description": "Spicy paneer cooked with capsicum and onions",
    "image": "https://images.unsplash.com/photo-1645177628172-a7c34a5d2e58?w=800&h=600&fit=crop",
    "price": 379,
    "category": "Main Course",
    "isAvailable": true
  },
  {
  "name": "Malai Kofta",
  "description": "Soft paneer koftas in creamy tomato gravy",
  "image": "https://images.unsplash.com/photo-1631515242873-9c8cdb7f4c42?w=800&h=600&fit=crop",
  "price": 389,
  "category": "Main Course",
  "isAvailable": true
},
{
  "name": "Palak Paneer",
  "description": "Paneer cubes cooked in spinach gravy",
  "image": "https://images.unsplash.com/photo-1628294896409-9f63c19e781f?w=800&h=600&fit=crop",
  "price": 359,
  "category": "Main Course",
  "isAvailable": true
},
{
  "name": "Chole Masala",
  "description": "Punjabi style spicy chickpea curry",
  "image": "https://images.unsplash.com/photo-1604908177225-3b7c4c9a6e9f?w=800&h=600&fit=crop",
  "price": 299,
  "category": "Main Course",
  "isAvailable": true
},
{
  "name": "Rajma Chawal",
  "description": "Red kidney beans curry served with rice",
  "image": "https://images.unsplash.com/photo-1626509653294-96b86c09f70f?w=800&h=600&fit=crop",
  "price": 319,
  "category": "Main Course",
  "isAvailable": true
},
{
  "name": "Veg Kofta Curry",
  "description": "Mixed vegetable koftas in spicy gravy",
  "image": "https://images.unsplash.com/photo-1645177628403-bb5b5e2ad653?w=800&h=600&fit=crop",
  "price": 349,
  "category": "Main Course",
  "isAvailable": true
},
{
  "name": "Jeera Rice",
  "description": "Steamed basmati rice tempered with cumin",
  "image": "https://images.unsplash.com/photo-1603133872678-5c40e2c9b89c?w=800&h=600&fit=crop",
  "price": 219,
  "category": "Main Course",
  "isAvailable": true
},

{
    "name": "Cold Coffee",
    "description": "Chilled coffee with milk and ice",
    "image": "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?w=800&h=600&fit=crop",
    "price": 179,
    "category": "Beverages",
    "isAvailable": true
  },
  {
    "name": "Fresh Lime Soda",
    "description": "Refreshing lime soda with mint",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    "price": 149,
    "category": "Beverages",
    "isAvailable": true
  },
  {
  "name": "Masala Chai",
  "description": "Indian spiced tea with milk",
  "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop",
  "price": 99,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Green Tea",
  "description": "Hot refreshing green tea",
  "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop",
  "price": 119,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Strawberry Shake",
  "description": "Creamy strawberry milkshake",
  "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop",
  "price": 199,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Mango Shake",
  "description": "Fresh mango blended milkshake",
  "image": "https://images.unsplash.com/photo-1626074353767-fdb7c1c7d2c5?w=800&h=600&fit=crop",
  "price": 219,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Watermelon Juice",
  "description": "Fresh watermelon juice",
  "image": "https://images.unsplash.com/photo-1597306691225-69ef217d3c4c?w=800&h=600&fit=crop",
  "price": 159,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Orange Juice",
  "description": "Freshly squeezed orange juice",
  "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop",
  "price": 169,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Iced Tea",
  "description": "Chilled lemon iced tea",
  "image": "https://images.unsplash.com/photo-1558640479-824e4c7f0b6b?w=800&h=600&fit=crop",
  "price": 149,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Hot Chocolate",
  "description": "Rich and creamy hot chocolate",
  "image": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop",
  "price": 199,
  "category": "Beverages",
  "isAvailable": true
},
{
  "name": "Buttermilk",
  "description": "Traditional salted chaas",
  "image": "https://images.unsplash.com/photo-1626074353770-87f2f0b5c7e8?w=800&h=600&fit=crop",
  "price": 89,
  "category": "Beverages",
  "isAvailable": true
},
{
    "name": "Chocolate Shake",
    "description": "Thick chocolate milkshake",
    "image": "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=600&fit=crop",
    "price": 199,
    "category": "Beverages",
    "isAvailable": true
  },

  {
    "name": "Chocolate Brownie",
    "description": "Rich chocolate brownie",
    "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop",
    "price": 199,
    "category": "Dessert",
    "isAvailable": true
  },
  {
    "name": "Gulab Jamun",
    "description": "Soft milk dumplings in sugar syrup",
    "image": "https://images.unsplash.com/photo-1626509653291-5f8fdc3c2f64?w=800&h=600&fit=crop",
    "price": 149,
    "category": "Dessert",
    "isAvailable": true
  },
  {
    "name": "Ice Cream Sundae",
    "description": "Vanilla ice cream with chocolate sauce",
    "image": "https://images.unsplash.com/photo-1590080877777-38a51c9d1d56?w=800&h=600&fit=crop",
    "price": 179,
    "category": "Dessert",
    "isAvailable": true
  },
  {
  "name": "Rasgulla",
  "description": "Soft spongy cottage cheese balls in syrup",
  "image": "https://images.unsplash.com/photo-1626509653301-ec0aafc8b8c6?w=800&h=600&fit=crop",
  "price": 159,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Rasmalai",
  "description": "Cottage cheese dumplings in saffron milk",
  "image": "https://images.unsplash.com/photo-1606313564283-b5a4f14f7a2c?w=800&h=600&fit=crop",
  "price": 179,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Chocolate Cake",
  "description": "Moist chocolate layered cake",
  "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
  "price": 249,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Vanilla Ice Cream",
  "description": "Classic vanilla ice cream scoop",
  "image": "https://images.unsplash.com/photo-1599785209798-786432b228bc?w=800&h=600&fit=crop",
  "price": 129,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Strawberry Ice Cream",
  "description": "Creamy strawberry ice cream",
  "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
  "price": 139,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Fruit Salad",
  "description": "Seasonal fresh fruits bowl",
  "image": "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&h=600&fit=crop",
  "price": 159,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Kesar Kulfi",
  "description": "Traditional saffron flavored kulfi",
  "image": "https://images.unsplash.com/photo-1626074353775-0c7f99a9f875?w=800&h=600&fit=crop",
  "price": 169,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Brownie with Ice Cream",
  "description": "Warm brownie served with vanilla ice cream",
  "image": "https://images.unsplash.com/photo-1606313564211-9a8e4f5cfdc5?w=800&h=600&fit=crop",
  "price": 249,
  "category": "Dessert",
  "isAvailable": true
},
{
  "name": "Caramel Custard",
  "description": "Classic caramel custard pudding",
  "image": "https://images.unsplash.com/photo-1626074353778-7c2e5f1c9b0e?w=800&h=600&fit=crop",
  "price": 179,
  "category": "Dessert",
  "isAvailable": true
}
];

const seedMenu = async () => {
  try {

    await dbConnect();
    console.log('Database connected');

   
    await Menu.deleteMany({});
    console.log('Cleared existing menu items');

   
    const insertedItems = await Menu.insertMany(menuItems);
    console.log(`Successfully seeded ${insertedItems.length} menu items`);

  
    const categories = await Menu.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nMenu items by category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} items`);
    });

 
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding menu:', error);
    process.exit(1);
  }
};


seedMenu();
