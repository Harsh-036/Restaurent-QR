import Cart from '../models/cart.js';
import Menu from '../models/menu.js';
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, userId, quantity = 1 } = req.body;

    //step 1
    let cart = await Cart.findOne({ userId });
    //if cart not exist create a new cart
    if (!cart) {
      cart = new Cart({ userId, items: [], totalCartPrice: 0 });
    }

    console.log(cart)

    let menu = await Menu.findById(menuItemId);
    if (!menu) {
      res.send('no menu item found');
    }
    console.log('menu' , menu)

    const existingMenuItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );
    console.log(existingMenuItem);
    //existing cart => quantiy += 1  , existing cart.items.push
    if (!existingMenuItem) {
      cart.items.push({ menuItemId, quantity });
    } else {
      existingMenuItem.quantity += 1;
    }

    cart.totalCartPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity * menu.price;
    }, 0);
    await cart.save();

    res.status(201).json({
        message : "Items added to cart successfully"
    })
  } catch (error) {}
};

//menuItemiD , userId , quantity=1

// {
//     userId : 'lkfjkfdjsf' ,
//     items : [{menuItemId : 'fdfsdfjd', quantity : 1}]
// }

//removeItemCart 
//increase
//decrease
//clear cart