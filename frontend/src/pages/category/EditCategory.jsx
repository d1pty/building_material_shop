import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http-common";

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get(`/categories/${id}`)
      .then((response) => {
        setName(response.data.name);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  const handleUpdateCategory = () => {
    http
      .put(`/categories/${id}`, { name })
      .then((response) => {
        navigate("/listCategories");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div
      className="container mt-3"
      style={{ background: "#d2b48c", padding: "20px", borderRadius: "10px" }}
    >
      <h2 style={{ color: "#704214" }}>Редактировать категорию</h2>
      <div className="form-group">
        <label style={{ color: "#704214" }}>Название</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ background: "#fff8e1", borderColor: "#704214" }}
        />
      </div>
      <button
        className="btn mt-2"
        onClick={handleUpdateCategory}
        style={{
          backgroundColor: "#ad8b73",
          borderColor: "#704214",
          color: "#fff",
          transition: "background-color 0.3s, color 0.3s",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#704214";
          e.target.style.color = "#d2b48c";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#ad8b73";
          e.target.style.color = "#fff";
        }}
      >
        Обновить категорию
      </button>
    </div>
  );
};

export default EditCategory;
