import React from 'react';

function Card(props) {
    return (
        <label>
            {props.checkbox ? <input type="checkbox" name="card-picked" class="card-checkbox" value={props.cd.index} onChange={() => props.handleChange(props.cd.index)} /> : ''}
            <div className="card-container">
                <p className="card-number">{props.cd.display}</p>
                <img className="card-suit" src={process.env.PUBLIC_URL + props.cd.img} />
            </div>
        </label>
    );
}

export default Card;