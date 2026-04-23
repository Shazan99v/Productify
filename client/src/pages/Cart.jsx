import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchData = async () => {
    try {
      const cartRes = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartRes.data || []);

      const wishlistRes = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(wishlistRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeItem = async (itemId, type) => {
    try {
      if (type === "cart") await api.delete(`/cart/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      else await api.delete(`/wishlist/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(`${type === "cart" ? "Removed from cart" : "Removed from wishlist"}`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const addToCartFromWishlist = async (item) => {
    try {
      // Check if already in cart
      if (cartItems.some((cart) => cart.product_id === item.product_id)) {
        toast("Item already in cart");
        return;
      }

      await api.post("/cart", {
        productId: item.product_id,
        quantity: 1,
        price: item.price,
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Added to cart");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  /* ================= Fake Payment + Place Order ================= */
  const placeOrder = async () => {
    if (cartItems.length === 0) return toast.error("Cart is empty");

    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
    const paymentConfirmed = window.confirm(`Total: $${totalPrice.toFixed(2)}\nClick OK to simulate payment.`);

    if (!paymentConfirmed) {
      toast("Payment cancelled");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        await api.post("/orders", {}, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Payment successful! Order placed.");
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to place order");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const itemsToShow = activeTab === "cart" ? cartItems : wishlistItems;

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button className={`btn ${activeTab === "cart" ? "btn-primary" : "btn-outline"}`} onClick={() => setActiveTab("cart")}>
          Cart ({cartItems.length})
        </button>
        <button className={`btn ${activeTab === "wishlist" ? "btn-secondary" : "btn-outline"}`} onClick={() => setActiveTab("wishlist")}>
          Wishlist ({wishlistItems.length})
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {itemsToShow.length === 0 && <p className="text-gray-400">No items in {activeTab}</p>}

          {itemsToShow.map((item) => {
            const itemId = activeTab === "cart" ? item.cart_id : item.wishlist_id;
            return (
              <div key={itemId} className="flex items-center bg-base-200 p-4 rounded-lg shadow-md">
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-md mr-4" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.quantity && <p>Quantity: {item.quantity}</p>}
                  {item.price && <p>Price: ${Number(item.price).toFixed(2)}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => removeItem(itemId, activeTab)} className="btn btn-error btn-sm">
                    Remove
                  </button>

                  {activeTab === "wishlist" && (
                    <button onClick={() => addToCartFromWishlist(item)} className="btn btn-primary btn-sm">
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        {activeTab === "cart" && (
          <div className="space-y-4">
            <div className="card bg-base-200 p-4 shadow-md rounded-lg">
              <h3 className="font-bold text-xl mb-2">Summary</h3>
              <p>Total Items: {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              <button className={`btn btn-success w-full mt-4 ${loading ? "loading" : ""}`} onClick={placeOrder} disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;