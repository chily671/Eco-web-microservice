import React from 'react'
import './Recommend.css'
import Item from '../Item/Item'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const Recommend = () => {
  
const {recommend} = useContext(ShopContext)


  return (
    <div className='popular'>
      <h1>Recommend for you</h1>
      <hr />
      <div className="popular-item">
      {(recommend.length === 0) ? <h1>Loading...</h1> :
        recommend.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} />
        })}
      </div>
    </div>
  )
}

export default Recommend
