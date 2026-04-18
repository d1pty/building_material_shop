import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http-common";

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); 
  const [currentImage, setCurrentImage] = useState(null); 
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    http
      .get("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    http
      .get(`/products/${id}`)
      .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setCurrentImage(response.data.imagineUrl);
        setPreviewImage(null); 

        if (response.data.productCategories && response.data.productCategories.length > 0) {
          setSelectedCategory(response.data.productCategories[0].category.id);
        }

        if (!response.data.variants || response.data.variants.length === 0) {
          setVariants([{ characteristicName: "NONE", characteristicValue: "NONE" }]);
        } else {
          setVariants(response.data.variants);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setPreviewImage(objectURL);
    }
  };

  const handleVariantChange = (index, e) => {
    const updatedVariants = [...variants];
    updatedVariants[index][e.target.name] = e.target.value;
    setVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { characteristicName: "", characteristicValue: "" }]);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpdateProduct = () => {
    if (!name.trim()) {
      alert("Пожалуйста, введите наименование товара.");
      return;
    }
  
    if (!description.trim()) {
      alert("Пожалуйста, введите описание товара.");
      return;
    }
  
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Пожалуйста, введите корректную цену (больше 0).");
      return;
    }
  
    if (!selectedCategory) {
      alert("Пожалуйста, выберите категорию.");
      return;
    }
  
    if (!file && !currentImage) {
      alert("Пожалуйста, выберите изображение.");
      return;
    }
  
    let variantsToSend = [...variants];
    if (
      variantsToSend.length === 0 ||
      (variantsToSend.length === 1 &&
        variantsToSend[0].characteristicName.trim() === "" &&
        variantsToSend[0].characteristicValue.trim() === "")
    ) {
      variantsToSend = [{ characteristicName: "NONE", characteristicValue: "NONE" }];
    } else {
      const isVariantsValid = variantsToSend.every(
        (variant) =>
          variant.characteristicName.trim() !== "" &&
          variant.characteristicValue.trim() !== ""
      );
      if (!isVariantsValid) {
        alert("Пожалуйста, заполните все характеристики вариантов или удалите пустые.");
        return;
      }
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
  
    if (file) {
      formData.append("file", file);
    }
  
    formData.append("variants", JSON.stringify(variantsToSend));
    formData.append("categories", JSON.stringify([selectedCategory]));
  
    http
      .put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/listProducts");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <div className="container mt-3 p-4 rounded" style={{ background: "#d2b48c" }}>
      <h2 className="text-center mb-4" style={{ color: "#704214" }}>Редактировать продукт</h2>

      <div className="row">
        <div className="col-md-4 d-flex flex-column align-items-center">
          {previewImage || currentImage ? (
            <img
              src={previewImage || `http://localhost:8080${currentImage}`}
              alt="preview"
              className="img-thumbnail"
              style={{ maxWidth: "100%", maxHeight: "250px", objectFit: "contain" }}
            />
          ) : (
            <div
              className="border d-flex align-items-center justify-content-center"
              style={{ width: "100%", height: "250px", background: "#fff8e1", color: "#704214" }}
            >
              Нет изображения
            </div>
          )}
          <label className="btn btn-warning mt-3">
            Выбрать изображение
            <input type="file" hidden onChange={handleFileChange} />
          </label>
        </div>

        <div className="col-md-8">
          <div className="form-group mb-3">
            <label style={{ color: "#704214" }}>Наименование</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            />
          </div>

          <div className="form-group mb-3">
            <label style={{ color: "#704214" }}>Описание</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            />
          </div>

          <div className="form-group mb-3">
            <label style={{ color: "#704214" }}>Цена</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            />
          </div>

          <div className="form-group mb-3">
            {variants
              .filter(
                (variant) =>
                  !(variant.characteristicName === "NONE" && variant.characteristicValue === "NONE")
              )
              .map((variant, index) => (
                <div key={index} className="d-flex mb-2">
                  <input
                    type="text"
                    className="form-control me-2"
                    name="characteristicName"
                    placeholder="Характеристика"
                    value={variant.characteristicName}
                    onChange={(e) => handleVariantChange(index, e)}
                    style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
                  />
                  <input
                    type="text"
                    className="form-control me-2"
                    name="characteristicValue"
                    placeholder="Значение"
                    value={variant.characteristicValue}
                    onChange={(e) => handleVariantChange(index, e)}
                    style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveVariant(index)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddVariant}
            >
              Добавить вариант
            </button>
          </div>

          <div className="form-group mb-3">
            <label style={{ color: "#704214" }}>Категория</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-success w-100"
            onClick={handleUpdateProduct}
            style={{ backgroundColor: "#704214", borderColor: "#704214" }}
          >
            Обновить товар
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
