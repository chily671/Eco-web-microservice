import React from 'react'
import Item from '../Item/Item'
import './NewCollections.css'
import { useState } from 'react'
import { useEffect } from 'react'


const NewCollections = () => {
  
  const [new_collection, setNew_collection] = useState([]);

  
  useEffect(()=>{
    fetch('/newcollection')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])
  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.price}  />
        })}
      </div>
    </div>
  )
}

export default NewCollections
