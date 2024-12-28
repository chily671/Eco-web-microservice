import React, {useState, useContext, useEffect} from 'react'
import './AdminUpdateProduct.css'
import upload_area from '../Assets/upload_area.svg'
import { ShopContext } from '../../Context/ShopContext'
import { useParams } from 'react-router-dom';


const AdminUpdateProductPage = () => {

    const {all_product} = useContext(ShopContext);

    const {productId} = useParams();

    const [product, setProduct] = useState({});

    useEffect(() => {
        const temp_product = all_product.find((e)=> e.id === productId);
        setProduct(temp_product);
    }, [all_product, productId]);

    // Tạo một list brand
    const brandList = ['Audemars Piguet', 'Cartier', 'Tudor', 'Breitling', 'Oris',
    'Richard Mille', 'Hublot', 'IWC', 'Jaeger-LeCoultre', 'Longines',
    'Omega', 'Panerai', 'Patek Philippe', 'Seiko', 'Sinn', 'Edox',
    'NOMOS', 'Hamilton', 'Meistersinger', 'Rado', 'TAG Heuer', 'Ebel',
    'A. Lange & Söhne', 'Vacheron Constantin', 'Zenith'];

    const sexList = ["Men's watch/Unisex", "Women's watch"];

    const [image, setImage] = useState(false);

    const [productDetail, setProductDetail] = useState({
        name: '',
        price: 0,
        image: '',
        brand: brandList[0],
        model: '',
        size: '',
        year: '',
        sex: sexList[0],
    });

    useEffect(() => {
        if (product)
            setProductDetail(product);
    }, [product]);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changHandler = (e) => {
        setProductDetail({...productDetail, [e.target.name]: e.target.value});
    }

    const UpdateProduct = async () => {
        console.log(productDetail);
        let responseData;
        let deleteResponse;
        let updatedProduct = productDetail;

        if (image)
        {   let formData = new FormData();

            // Resize image to 1000x1000
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
                canvas.width = 1000;
                canvas.height = 1000;
                ctx.drawImage(img, 0, 0, 1000, 1000);
                canvas.toBlob((blob) => {
                    setImage(blob);
                }, 'image/jpeg', 1);
            }


            formData.append('product', image);

            await fetch('/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                },
                body: formData,
            }).then((response) => response.json()).then((data) => {responseData = data}).catch((err) => console.log(err));

            // Delete old image
            if (responseData.success)
            {
                await fetch('/deleteimage', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({'image': product.image})
                }).then((response) => response.json()).then((data) => {deleteResponse = data}).catch((err) => console.log(err));
            }
        }
        else
        {
            responseData = {success: true, image_url: product.image};
            deleteResponse = {success: true};
        }

        if (responseData.success && deleteResponse.success) 
        {
            updatedProduct.image = responseData.image_url;
            const image_filename = responseData.image_url.substring(responseData.image_url.lastIndexOf('/') + 1);
            console.log(updatedProduct);
            await fetch('/updateproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    Accept: 'application/json',
                },
                body: JSON.stringify(updatedProduct)
            }).then((response) => response.json()).then((data) => {
                data.success?alert('Product updated successfully'):alert('Product not updated')
            }).catch((err) => console.log(err));

            // retrain model
            if (image)
                {
                    await fetch('/retrain', {
                        method: 'POST',
                        body: JSON.stringify({image_filename: image_filename}),
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        }
                    }).then((response) => response.json()).then((data) => {
                        console.log(data.status);
                    }).catch((err) => console.log(err));
                }
            // reload page
            window.location.reload();
        }
    }
    
  return (
    <div className='admin'>
     
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Watch name</p>
            <input value={productDetail.name} onChange={changHandler} type="text" name='name' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetail.price} onChange={changHandler} type="text" name='price' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Product size</p>
            <input value={productDetail.size} onChange={changHandler} type="text" name='size' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Year</p>
            <input value={productDetail.year} onChange={changHandler} type="text" name='year' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Watch model</p>
            <input value={productDetail.model} onChange={changHandler} type="text" name='model' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Watch Brand</p>
            <select value={productDetail.brand} onChange={changHandler} name='brand' className='addproduct-selector'>
                {
                    brandList.map((brand, index) => {
                        return <option key={index} value={brand}>{brand}</option>
                    })
                }
            </select>
        </div>
        <div className="addproduct-itemfield">
            <p>Watch Sex</p>
            <select value={productDetail.sex} onChange={changHandler} name='sex' className='addproduct-selector'>
                {
                    sexList.map((sex, index) => {
                        return <option key={index} value={sex}>{sex}</option>
                    })
                }
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):(product?product.image:upload_area)} className='addproduct-thumbnail-image' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
        </div>
        <button onClick={()=>{UpdateProduct()}} className="addproduct-btn">Update</button>
    </div>
    </div>
  )
}

export default AdminUpdateProductPage