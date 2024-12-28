import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.jpg'

const Hero = ({ onScroll}) => {
  function ButtonComponent({ onScroll }) {
    return (
      <div>
        <button onClick={onScroll}>Scroll to Component B</button>
      </div>
    );
  }
  return (
    <div className='hero bg-black'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
            <div className="hero-hand-icon">
                <p>new</p>
                <img src={hand_icon} alt="" />
                
            </div>
            <p>collection</p>
            <p>for everyone</p>
        </div>
        <div className="hero-lastest-btn" onClick={onScroll} >
            <div>Lastest collection</div>
            <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  )
}

export default Hero
