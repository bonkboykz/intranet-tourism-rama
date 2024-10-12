// DepartmentsCard.jsx
import React, { useRef } from 'react';
import './css/DepartmentsCard.css';
import defaultImage from '../../../../../public/assets/dummyStaffImage.png';
import deleteIcon from '../../../../../public/assets/deleteicon.svg';

const DepartmentsCard = ({ name, imageUrl, onDeleteClick, departmentID }) => {
  const threeDotButtonRef = useRef(null);

  return (
    <div className="staff-member-card">
      <div className="card-header">
        <img src={imageUrl || defaultImage} alt={`${name} Banner`} className="staff-member-image" />
        <button
          className="status-button"
          onClick={() => onDeleteClick(departmentID)}
          ref={threeDotButtonRef}
        >
          <img style={{ width: '40px' }} src={deleteIcon} alt="Delete Button" />
        </button>
      </div>
      <div className="card-body">
        <h3 className="staff-member-name">{name}</h3>
      </div>
      <div className="card-footer items-center justify-center">
        <a href={`/departmentInner?departmentId=${departmentID}`}>
          <button
            className="justify-center text-blue-500 font-semibold px-5 rounded-3xl border border-blue-500 bg-transparent hover:bg-primary-700 hover:text-white"
            aria-label="Visit"
          >
            Visit
          </button>
        </a>
      </div>
    </div>
  );
};

export default DepartmentsCard;
