import React, { useState } from "react";
import "./AdminAddProduct.css";
import upload_area from "../Assets/upload_area.svg";

const AdminAddProduct = () => {
  // Tạo một list brand
  const brandList = [
    "Audemars Piguet",
    "Cartier",
    "Tudor",
    "Breitling",
    "Oris",
    "Richard Mille",
    "Hublot",
    "IWC",
    "Jaeger-LeCoultre",
    "Longines",
    "Omega",
    "Panerai",
    "Patek Philippe",
    "Seiko",
    "Sinn",
    "Edox",
    "NOMOS",
    "Hamilton",
    "Meistersinger",
    "Rado",
    "TAG Heuer",
    "Ebel",
    "A. Lange & Söhne",
    "Vacheron Constantin",
    "Zenith",
  ];

  const sexList = ["Men's watch/Unisex", "Women's watch"];

  const [image, setImage] = useState(false);
  const [productDetail, setProductDetail] = useState({
    name: "",
    price: 0,
    image: "",
    brand: brandList[0],
    model: "",
    size: "",
    year: "",
    sex: sexList[0],
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changHandler = (e) => {
    setProductDetail({ ...productDetail, [e.target.name]: e.target.value });
  };

  const AddProduct = async () => {
    // Check if all fields are filled
    if (
      productDetail.name === "" ||
      productDetail.price === 0 ||
      productDetail.model === "" ||
      productDetail.size === "" ||
      productDetail.year === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    // Check if there is an image
    if (!image) {
      alert("Please upload an image");
      return;
    }

    console.log(productDetail);
    let responseData;
    let product = productDetail;

    let formData = new FormData();
    // Resize image to 1000x1000
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx.drawImage(img, 0, 0, 1000, 1000);
      canvas.toBlob(
        (blob) => {
          setImage(blob);
        },
        "image/jpeg",
        1
      );
    };

    formData.append("product", image);

    await fetch("/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        responseData = data;
      })
      .catch((err) => console.log(err));

    if (responseData.success) {
      product.image = responseData.image_url;

      const image_filename = responseData.image_url.substring(
        responseData.image_url.lastIndexOf("/") + 1
      );
      console.log(product);
      await fetch("/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          Accept: "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((response) => response.json())
        .then((data) => {
          data.success
            ? alert("Product added successfully")
            : alert("Product not added");
        })
        .catch((err) => console.log(err));

      // retrain model
      await fetch("/retrain", {
        method: "POST",
        body: JSON.stringify({ image_filename: image_filename }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.status);
        })
        .catch((err) => console.log(err));
    } else {
      alert(responseData.message);
    }
  };

  return (
    <div className="admin">
      <div className="add-product">
        <div className="addproduct-itemfield">
          <p>Watch name</p>
          <input
            value={productDetail.name}
            onChange={changHandler}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetail.price}
            onChange={changHandler}
            type="text"
            name="price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Product size</p>
          <input
            value={productDetail.size}
            onChange={changHandler}
            type="text"
            name="size"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Year</p>
          <input
            value={productDetail.year}
            onChange={changHandler}
            type="text"
            name="year"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Watch model</p>
          <input
            value={productDetail.model}
            onChange={changHandler}
            type="text"
            name="model"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Watch Brand</p>
          <select
            value={productDetail.brand}
            onChange={changHandler}
            name="brand"
            className="addproduct-selector"
          >
            {brandList.map((brand, index) => {
              return (
                <option key={index} value={brand}>
                  {brand}
                </option>
              );
            })}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>Watch Sex</p>
          <select
            value={productDetail.sex}
            onChange={changHandler}
            name="sex"
            className="addproduct-selector"
          >
            {sexList.map((sex, index) => {
              return (
                <option key={index} value={sex}>
                  {sex}
                </option>
              );
            })}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="addproduct-thumbnail-image"
              alt=""
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <button
          onClick={() => {
            AddProduct();
          }}
          className="addproduct-btn"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default AdminAddProduct;
