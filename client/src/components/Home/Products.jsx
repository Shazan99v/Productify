import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, products]);

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters */}
      <div className="card bg-base-200 shadow-lg rounded-lg p-5 h-fit sticky top-5">
        <h2 className="text-xl font-bold mb-4 text-primary">Filters</h2>
        <input
          type="text"
          placeholder="Search Product"
          className="input input-bordered w-full mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")} className="btn btn-outline btn-sm w-full">Clear Filters</button>
      </div>

      {/* Products */}
      <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <p className="text-center col-span-full opacity-60">No products found</p>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className="card bg-base-100 shadow-lg hover:shadow-2xl transition rounded-xl overflow-hidden border cursor-pointer"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            {p.image_url ? (
              <img src={p.image_url} className="h-48 w-full object-cover" alt={p.title} />
            ) : (
              <div className="h-48 w-full bg-base-300 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="card-body p-4">
              <h2 className="card-title text-lg font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{p.description || "No description."}</p>
              <p className="font-semibold mt-2">Price: ${p.price}</p>
              <div className="mt-3 flex flex-col space-y-1 text-xs text-gray-500">
                <span>By: {p.name}</span>
                <span>Email: {p.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;