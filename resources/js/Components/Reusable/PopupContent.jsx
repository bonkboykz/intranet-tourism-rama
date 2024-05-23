import React, { useState, useRef } from 'react';
import './css/StaffMemberCard.css';
// import DeactivateModal from './DeactivateModal';
import threeDotsIcon from '../../../../public/assets/threeDotButton.png';
// import dummyStaffImage from '../../../../public/assets/dummyStaffImage.png';
import deactivateButton from '../../../../public/assets/deactivateButton.png';
import ViewAdminPopup from '../Reusable/ViewAdminPopup';

const PopupContent = ({ name, role, status, imageUrl, onDeactivateClick }) => {
    const [isThreeDotPopupOpen, setIsThreeDotPopupOpen] = useState(false);
    const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);
    const threeDotButtonRef = useRef(null);
  
    const toggleThreeDotButton = () => {
      setIsThreeDotPopupOpen(!isThreeDotPopupOpen);
    };
  
    const openPopup = () => {
      setIsThreeDotPopupOpen(true);
      console.log("bukak");
    };
  
    const closePopup = () => {
      setIsThreeDotPopupOpen(false);
      console.log("tutup");
    };
  
    const openDeactivateModal = () => {
      setIsThreeDotPopupOpen(false);
      onDeactivateClick();
    };
  
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest(".popup")) {
          closePopup();
        }
      };
  
      if (isThreeDotPopupOpen) {
        document.addEventListener("click", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isThreeDotPopupOpen]);
  
    const handleIconClick = (e) => {
      e.stopPropagation();
      toggleThreeDotButton();
    };
  
    // Position popup next to the three dots icon button
    const getPopupPosition = () => {
      return {
        top: -8,
        left: 90.5, // Add an offset to position it to the right of the button
      };
    };
  
    const handleDelete = (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("Delete button clicked");
    };
  
    const handleDownload = (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("Download button clicked");
    };
  
    const handleManageAdminClick = (e) => {
      e.stopPropagation();
      setIsAdminPopupOpen(true);
    };
  
    const closeAdminPopup = () => {
      setIsAdminPopupOpen(false);
    };
  
    return (
      <div>
        <button
          className="three-dot-button"
          onClick={toggleThreeDotButton}
          ref={threeDotButtonRef}
        >
          <img style={{ width: '40px' }} src={threeDotsIcon} alt="Three dots" onClick={handleIconClick} />
        </button>
        {isThreeDotPopupOpen && (
          <div className="profile-files-popup text-sm">
            <div
              className="staff-member-popup4"
              style={{
                top: `${getPopupPosition().top}px`,
                left: `${getPopupPosition().left}px`,
                position: 'absolute',
                zIndex: 999,
              }}
            >
              <img src="assets/🦆 icon _Rename.svg" alt={name} className="staff-member-popup-image" />
              <button
                className="text-neutral-500 pr-2 mr-12"
                onClick={handleDelete}
              >
                Rename
              </button>
            </div>
            <div
              className="staff-member-popup2"
              style={{
                top: '33.5px',
                left: `${getPopupPosition().left}px`,
                position: 'absolute',
                zIndex: 999,
              }}
            >
              <img src="assets/🦆 icon _image_.svg" alt={name} className="staff-member-popup-image" />
              <button
                className="text-neutral-500 pr-2 mr-14"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
            <div
              className="staff-member-popup5"
              style={{
                top: '74.8px',
                left: `${getPopupPosition().left}px`,
                position: 'absolute',
                zIndex: 999,
              }}
            >
              <img src="assets/🦆 icon _Admin.svg" alt={name} className="staff-member-popup-image" />
              <button
                className="text-neutral-500 pr-2"
                onClick={handleManageAdminClick}
              >
                Manage Admin
              </button>
            </div>
            <div
              className="staff-member-popup3"
              style={{
                top: '116.5px',
                left: `${getPopupPosition().left}px`,
                position: 'absolute',
                zIndex: 999,
              }}
            >
              <img src="assets/🦆 icon _lock_.svg" alt={name} className="staff-member-popup-image" />
              <button
                className="text-neutral-500 pr-2 mr-8"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        )}
        {isAdminPopupOpen && <ViewAdminPopup onClose={closeAdminPopup} />}
      </div>
    );
  };
  
  export default PopupContent;
  
