import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../http-common";
import { connect } from "react-redux";

const ListCategories = ({ user }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleDeleteCategory = (id) => {
    http
      .delete(`/categories/${id}`)
      .then(() => {
        fetchCategories();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div
      className="container-md mt-3"
      style={{ background: "#d2b48c", padding: "20px", borderRadius: "10px" }}
    >
      <div className="row">
        <div className="col-sm-12 mt-2">
          <div className="list-group">
            {categories.map((category, i) => (
              <div
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: "#fff8e1",
                  borderColor: "#704214",
                  marginBottom: "10px",
                }}
              >
                {i + 1}. {category.name}
                {user && user.role === "ROLE_ADMIN" && (
                  <div>
                    <Link
                      className="btn btn-sm btn-primary me-2"
                      to={`/editCategory/${category.id}`}
                      style={{
                        backgroundColor: "#704214",
                        borderColor: "#704214",
                      }}
                    >
                      Редактировать
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteCategory(category.id)}
                      style={{
                        backgroundColor: "#d2691e",
                        borderColor: "#d2691e",
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-12 mt-2">
          {user && user.role === "ROLE_ADMIN" && (
            <Link
              to="/addCategory"
              className="btn btn-success"
              style={{ backgroundColor: "#704214", borderColor: "#704214" }}
            >
              Добавить категорию
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ListCategories);
