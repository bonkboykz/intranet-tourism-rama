import React from 'react';
import './css/DepartmentsCard.css';
import defaultImage from '../../../../../public/assets/dummyStaffImage.png';
import { FaLock } from 'react-icons/fa'; // Import the lock icon

const CommunityCard = ({ name, imageUrl, onDeactivateClick, communityID, type }) => {
  const isPrivate = type === 'private'; // Add a fallback check

  return (
    <div className="staff-member-card">
      <div className="card-header">
        <img src={imageUrl || defaultImage} alt={name} className="staff-member-image" />
      </div>
      <div className="card-body">
        <h3 className="staff-member-name">
          {name} {isPrivate && <FaLock style={{ color: 'black', alignItems: 'center' }} />} {/* Lock icon in black */}
        </h3>
      </div>
      <div className="card-footer items-center">
        <a href={`/communityInner?communityId=${communityID}`}>
          <button
            className="justify-center text-blue-500 font-semibold px-5 rounded-3xl border border-blue-500 bg-transparent hover:bg-blue-700 hover:text-white"
            aria-label="Visit"
            // onClick={onDeactivateClick}
          >
            Visit
          </button>
        </a>
      </div>
    </div>
  );
};



export default CommunityCard;
