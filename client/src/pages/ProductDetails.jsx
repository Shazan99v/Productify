import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  /* ================= Fetch product ================= */
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data);
    } catch (err) {
      toast.error("Failed to load product");
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to load comments");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchComments();
  }, [id]);

  /* ================= Comments ================= */
  const addComment = async () => {
    if (!commentText) return;
    try {
      await api.post(`/comments/${id}`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentText("");
      fetchComments();
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
      console.error(err);
    }
  };

  /* ================= Cart / Wishlist / Order ================= */
  const addToCart = async () => {
    try {
      const cartRes = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cartRes.data.some((item) => item.product_id === product.id)) {
        toast("Already in cart");
        return;
      }
      await api.post("/cart", {
        productId: product.id,
        quantity: 1,
        price: product.price,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    }
  };

  const addToWishlist = async () => {
    try {
      const wishlistRes = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (wishlistRes.data.some((item) => item.product_id === product.id)) {
        toast("Already in wishlist");
        return;
      }
      await api.post("/wishlist", {
        productId: product.id,
        price: product.price,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.error(err);
    }
  };

  const placeOrder = async () => {
    try {
      const cartRes = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!cartRes.data.some((item) => item.product_id === product.id)) {
        await api.post("/cart", { productId: product.id, quantity: 1, price: product.price }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await api.post("/orders", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to place order");
      console.error(err);
    }
  };

  if (!product) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline btn-primary mb-4 flex items-center gap-2"
      >
        ← Back to Products
      </button>

      {/* Product Card */}
      <div className="card bg-base-200 shadow-xl flex flex-col md:flex-row overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            className="md:w-1/2 h-64 object-cover"
            alt={product.title}
          />
        )}

        <div className="card-body md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-sm opacity-80">{product.description}</p>
          <p className="text-lg font-semibold">Price: ${product.price}</p>
          <div className="text-xs text-gray-500">
            Created by {product.name} ({product.email}) <br />
            {new Date(product.created_at).toLocaleDateString()}
          </div>

          {user && (
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={addToCart}>
                Add to Cart
              </button>
              <button className="btn btn-secondary" onClick={addToWishlist}>
                Add to Wishlist
              </button>
              <button className="btn btn-success" onClick={placeOrder}>
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="card bg-base-200 shadow-xl p-4 space-y-4">
        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

        {user && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="input input-bordered w-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addComment}>
              Post
            </button>
          </div>
        )}

        <div className="space-y-2">
          {comments.length === 0 && (
            <p className="text-gray-400">No comments yet. Be first!</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex justify-between items-start bg-base-100 p-2 rounded-md">
              <div>
                <span className="font-medium">{c.name}</span>:
                <span className="ml-1">{c.text}</span>
                <div className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </div>

              {(user?.id === c.user_id || user?.id === product.user_id) && (
                <button
                  onClick={() => deleteComment(c.id)}
                  className="btn btn-error btn-xs"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;