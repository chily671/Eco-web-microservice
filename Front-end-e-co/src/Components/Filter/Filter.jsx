import React from 'react'
import './Filter.css'
import all_product from '../Assets/all_product'

function FilterView({menuItems}) {
    return (
        <div className='Filter'>
            <div className='Type'>
                <p>Filter by:</p>
            </div>
            <div className='Buttons'>
                {
                    menuItems.map((val, i) => (
                        <button key={i} className="Other">
                            {val}
                        </button>
                    ))
                }  
                <button className='Other'>All</button>
            </div>
            <div className='None'>
                <p>Show current collection</p>
            </div>
        </div>
    )
}

export default FilterView