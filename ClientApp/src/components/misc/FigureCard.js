import React from 'react';
import './InitialsAvatar.css';

const Card = ({ heading, content }) => {
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card p-2">
                <div className="card-body">
                    <div className="kpi-card-heading">{heading}</div>
                    <div className="h5 mb-0 fw-bold">{content}</div>
                </div>
            </div>
        </div>
    );
};

export default Card;