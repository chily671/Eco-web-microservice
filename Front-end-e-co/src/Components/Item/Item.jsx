import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  console.log(props.image)
  return (
    <div className='item '>
     <Link to={`/products/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt="" className='w-6' /></Link> 
        <p>{props.name}</p>
    <div className="item-prices">
        <div className="item-price-new">
            ${props.price}
        </div>
    </div>
    </div>
  )
}

export default Item
