import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../http-common";
import { connect } from "react-redux";

const ListProducts = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = (categoryId = null) => {
    const url = categoryId ? `/products/category/${categoryId}` : "/products";
    http
      .get(url)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchCategories = () => {
    http
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteProduct = (id) => {
    http
      .delete(`/products/${id}`)
      .then(() => {
        fetchProducts(selectedCategory);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  return (
    <div className="container-md mt-3 d-flex">
      {/* Боковая панель с категориями */}
      <div className="categories" style={{ width: "20%", padding: "10px", background: "#f8f9fa", borderRadius: "10px" }}>
        <h5>Категории</h5>
        <ul className="list-group">
          <li className={`list-group-item ${selectedCategory === null ? "active" : ""}`} onClick={() => handleCategorySelect(null)} style={{ cursor: "pointer" }}>
            Все товары
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              className={`list-group-item ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => handleCategorySelect(category.id)}
              style={{ cursor: "pointer" }}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Основной контент */}
      <div className="content" style={{ width: "80%", marginLeft: "20px" }}>
        {user && user.role === "ROLE_ADMIN" && (
          <div className="mt-3 text-center">
            <Link to="/addProduct" className="btn btn-success" style={{ backgroundColor: "#704214", borderColor: "#704214" }}>
              Добавить товар
            </Link>
          </div>
        )}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product, i) => (
            <div key={i} className="col">
              <div className="card h-100" style={{ backgroundColor: "#fff8e1", borderColor: "#704214", padding: "10px", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div style={{ height: "250px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", borderTopLeftRadius: "10px", borderTopRightRadius: "10px", backgroundColor: "#e5d4a1" }}>
                  {product.imagineUrl ? (
                    <img src={`http://localhost:8080${product.imagineUrl}`} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                  ) : (
                    <div style={{ color: "#704214", fontSize: "18px" }}>Без изображения</div>
                  )}
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text"><strong>{product.price} руб.</strong></p>
                </div>
                <div className="text-center mb-2">
                  <Link to={`/product/${product.id}`} className="btn btn-primary" style={{ backgroundColor: "#704214", borderColor: "#704214" }}>Подробнее</Link>
                </div>
                {user && user.role === "ROLE_ADMIN" && (
                  <div className="d-flex justify-content-between px-3 pb-3">
                    <Link className="btn btn-sm btn-primary" to={`/editProduct/${product.id}`} style={{ backgroundColor: "#704214", borderColor: "#704214" }}>Редактировать</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: "#d2691e", borderColor: "#d2691e" }}>Удалить</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ListProducts);
