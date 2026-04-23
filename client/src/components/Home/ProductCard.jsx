import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="card bg-base-100 dark:bg-base-300 shadow-lg rounded-xl overflow-hidden">
      
      <figure>
        <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {product.title}
          {product.badge && <span className="badge badge-primary ml-2">{product.badge}</span>}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{product.desc}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
              {product.owner[0]}
            </div>
          </div>
          <span className="text-sm">{product.owner}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;