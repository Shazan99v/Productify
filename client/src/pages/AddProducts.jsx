import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { toast } from "react-hot-toast";

const AddProducts = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    price: "",
  });

  const [myProducts, setMyProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  /* ================= Fetch My Products ================= */
  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mine = res.data.filter((p) => p.user_id === user?.id);
      setMyProducts(mine);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  /* ================= Form Handling ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setForm({ ...form, price: value.replace(/[^0-9.]/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price) return toast.error("Price is required");

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product Updated!");
      } else {
        await api.post("/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product Added!");
      }

      setForm({ title: "", imageUrl: "", description: "", price: "" });
      setEditingId(null);
      fetchMyProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchMyProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const startEdit = (p) => {
    setForm({
      title: p.title,
      imageUrl: p.image_url,
      description: p.description,
      price: p.price?.toString() || "",
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => navigate("/")}
          className="btn btn-outline btn-primary flex items-center gap-2"
        >
          ← Back to Home
        </button>
      </div>

      {/* Add / Edit Form */}
      <div className="flex justify-center mb-12">
        <div className="card w-full max-w-md bg-base-200 shadow-xl p-6">
          <h2 className="text-xl font-bold text-center mb-4">
            {editingId ? "Edit Product" : "New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Product Name"
              className="input input-bordered w-full"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              className="input input-bordered w-full"
              value={form.imageUrl}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={form.description}
              onChange={handleChange}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price"
              className="input input-bordered w-full"
              value={form.price}
              onChange={handleChange}
              required
            />

            <button className="btn btn-success w-full">
              {editingId ? "Update Product" : "Create Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", imageUrl: "", description: "", price: "" });
                }}
                className="btn btn-outline w-full"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* My Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Products</h2>
        {myProducts.length === 0 && <p className="opacity-60">You haven't added any products yet.</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((p) => (
            <div
              key={p.id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition rounded-xl overflow-hidden"
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  className="h-40 w-full object-cover rounded-t-xl"
                  alt={p.title}
                />
              ) : (
                <div className="h-40 w-full bg-base-300 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="card-body">
                <h3 className="card-title text-lg">{p.title}</h3>
                <p className="text-sm opacity-80">{p.description}</p>
                <p className="font-semibold mt-1">
                  Price: ${Number(p.price || 0).toFixed(2)}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  By: {p.name} | {p.email}
                </div>
                <div className="card-actions justify-end mt-4">
                  <button onClick={() => startEdit(p)} className="btn btn-info btn-sm">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="btn btn-error btn-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProducts;