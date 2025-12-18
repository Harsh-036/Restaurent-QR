import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const staticCartData = {
  userId: "507f1f77bcf86cd799439011",
  items: [
    {
      menuItemId: "507f1f77bcf86cd799439012",
      quantity: 2,
      menuItem: {
        _id: "507f1f77bcf86cd799439012",
        name: "Paneer Tikka",
        description:
          "Marinated cottage cheese cubes grilled to perfection with aromatic spices",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&fit=crop",
        price: 280,
        category: "Main Course",
        isAvailable: true,
      },
    },
    {
      menuItemId: "507f1f77bcf86cd799439013",
      quantity: 1,
      menuItem: {
        _id: "507f1f77bcf86cd799439013",
        name: "Dal Makhani",
        description:
          "Slow-cooked black lentils with butter and cream for a rich taste",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&fit=crop",
        price: 220,
        category: "Main Course",
        isAvailable: true,
      },
    },
    {
      menuItemId: "507f1f77bcf86cd799439014",
      quantity: 3,
      menuItem: {
        _id: "507f1f77bcf86cd799439014",
        name: "Garlic Naan",
        description:
          "Soft tandoor-baked naan brushed with garlic butter",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&fit=crop",
        price: 60,
        category: "Breads",
        isAvailable: true,
      },
    },
    {
      menuItemId: "507f1f77bcf86cd799439015",
      quantity: 1,
      menuItem: {
        _id: "507f1f77bcf86cd799439015",
        name: "Mango Lassi",
        description:
          "Chilled yogurt drink blended with fresh mango pulp",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&fit=crop",
        price: 120,
        category: "Beverages",
        isAvailable: true,
      },
    },
  ],
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(staticCartData.items);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity * item.menuItem.price,
        0
      ),
    [cartItems]
  );

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.menuItemId === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((i) => i.menuItemId !== id));
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your cart feels lonely 😔
        </h2>
        <p className="text-muted-foreground mb-6">
          Add some delicious food to continue
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
        <p className="text-muted-foreground mt-1">
          {cartItems.length} item(s) selected
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.menuItemId}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition"
            >
              <div className="flex flex-col sm:flex-row">
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-full sm:w-44 h-44 object-cover"
                />

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.menuItem.name}
                      </h3>
                      <span className="text-foreground font-bold">
                        ₹{item.menuItem.price}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.menuItem.description}
                    </p>

                    <span className="inline-block text-[11px] uppercase tracking-wider text-muted-foreground border border-border px-3 py-1 rounded-full">
                      {item.menuItem.category}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-secondary border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.menuItemId, -1)
                          }
                          className="p-2 hover:bg-secondary/80 rounded-l-lg"
                        >
                          <Minus className="w-4 h-4 text-secondary-foreground" />
                        </button>
                        <span className="px-4 text-secondary-foreground font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.menuItemId, 1)
                          }
                          className="p-2 hover:bg-secondary/80 rounded-r-lg"
                        >
                          <Plus className="w-4 h-4 text-secondary-foreground" />
                        </button>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="text-foreground font-semibold">
                          ₹{item.quantity * item.menuItem.price}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{Math.round(totalPrice * 0.18)}</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between text-foreground font-semibold">
              <span>Total</span>
              <span>
                ₹{totalPrice + Math.round(totalPrice * 0.18)}
              </span>
            </div>
          </div>

          <button className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition">
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 py-3 border border-border text-foreground rounded-xl hover:bg-card/80 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
