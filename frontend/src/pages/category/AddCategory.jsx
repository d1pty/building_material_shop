import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../http-common";

const AddCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleAddCategory = () => {
    http
      .post("/categories", { name })
      .then((response) => {
        navigate("/ListCategories");
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
      <h2 style={{ color: "#704214" }}>Добавление категории</h2>
      <div className="form-group">
        <label style={{ color: "#704214" }}>Наименование</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
        />
      </div>
      <button
        className="btn btn-success mt-2"
        onClick={handleAddCategory}
        style={{ backgroundColor: "#704214", borderColor: "#704214" }}
      >
        Добавить
      </button>
    </div>
  );
};

export default AddCategory;
