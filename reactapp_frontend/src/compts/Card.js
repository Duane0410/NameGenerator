import React from "react";
import './home-style.css';

function Card({title,imageUrl,body})
{
    return(
        <div className="card-container">
           <div classname="image-container">
                 
           </div>
           <div className="card-title">
            {title}
           </div>
           {/* <div className="card-body">
            {body}
           </div> */}
           <div className="btn">
            <button>
                <a>
                    View more
                </a>
            </button>
           </div>
        </div>
    )
}

export default Card