import React, { useState, useCallback, useContext } from 'react';
import EditProfilePhoto from './EditProfilePhoto';
import UpdatePhotoButton from './UpdatePhoto';
import './profile.css';
import { useCsrf } from '@/composables';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { OnlineUsersContext, OnlineUsersProvider } from '@/Pages/OnlineUsersContext';

function ProfileImage({ name, src, alt, className, rounded, tag, isOnline}) {
  // console.log("SRC", src);

  let source = null;

  // if (src.startsWith('avatar/')) {
  //   // If src already starts with 'avatar/', map it directly
  //   source = `/storage/${src}`;
  // } else {
  //   // If src doesn't start with 'avatar/', check if it's a placeholder or not
  //   source = src === '/assets/dummyStaffPlaceHolder.jpg'
  //     ? src
  //     : `/avatar/${src}`;
  // }

  if (!src || src.trim() === '') {
    // If src is empty or only contains whitespace, use the UI Avatars URL
    source = src;
  } else if (src.startsWith('avatar/')) {
    // If src already starts with 'avatar/', map it directly
    source = `/storage/${src}`;
  } else {
    // If src doesn't start with 'avatar/', check if it's a placeholder or not
    source = src === '/assets/dummyStaffPlaceHolder.jpg'
      ? src
      : `/avatar/${src}`;
  }


  console.log("SOURCE", source);


  return (
    <div className={`flex overflow-hidden relative z-0 max-w-full aspect-square ${className} max-md:w-32 max-md:justify-start`}>
      <img
        // src={`/storage/${src}` : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${data.name}`}
        src={src ? source : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name}`}
        alt={alt}
        className={`object-cover w-40 h-40 ${rounded ? 'rounded-full' : ''} max-md:w-24 max-md:h-24 max-md:bottom-0`}
      />
      <div
        className={`absolute w-5 h-5 max-md:w-4 max-md:h-4 rounded-full border-2 border-white border-solid stroke-[2px] bottom-2 right-0 left-28 max-md:left-auto max-md:right-8 max-md:bottom-16 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
      </div>
    </div>
  );
}

function ProfileHeader({ backgroundImage, profileImage, name, status, onEditBanner, rounded, username, userId, profileId, tag }) {
  console.log("hhhhhhh", name);
  console.log("PIMAGE", profileImage)

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const csrfToken = useCsrf();
  const authToken = localStorage.getItem('authToken');

  const { onlineUsers } = useContext(OnlineUsersContext); // Access online users from context
  const isOnline = onlineUsers.some(onlineUser => onlineUser.id === userId); // Check if user is online

  const openPopup = () => {
    setIsPopupOpen(true);
    console.log("Popup opened");
  };

  const handleEditBanner = (e) => {
    e.stopPropagation();
    onEditBanner();
  };

  const handleCloseClick = (e) => {
    e?.stopPropagation();
    setIsPopupOpen(false);
    console.log("Popup closed");
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (!isPopupOpen) {
      openPopup();
    }
  };

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentProfileImage(fileUrl);
      setSelectedFile(file);
      setIsPopupOpen(false);
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(currentProfileImage, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setIsUpdatePopupOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCroppedImage = async () => {
    try {
      if (croppedImage) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: blob.type });
        await uploadProfilePhoto(file, userId, setCurrentProfileImage, setSelectedFile, csrfToken, authToken);
        setIsUpdatePopupOpen(false);
        setSelectedFile(null); // Clear selected file after saving
        setCroppedImage(null); // Clear cropped image after saving
      }
    } catch (e) {
      console.error('Error saving cropped image:', e);
      window.location.reload();
    }
  };

  const handleCloseUpdatePopup = (e) => {
    e?.stopPropagation();
    setIsUpdatePopupOpen(false);
    console.log("Update Photo Popup closed");
  };

  const uploadProfilePhoto = async (file, id, setCurrentProfileImage, setSelectedFile, csrfToken, authToken) => {
    const url = `/api/profile/profiles/${profileId}`;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', id);
    formData.append('_method', 'PUT');
    formData.append('name', name); // Add _method to the form data

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, options);

      // Check if the response is ok
      if (!response.ok) {
        console.error('Error response from server:', response.statusText);
        throw new Error('Network response was not ok');
      }

      // Check if the response content is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('Profile photo updated successfully:', data);

        if (data.profile && data.profile.image) {
          const fullPath = data.profile.image;
          setCurrentProfileImage(fullPath);
          setSelectedFile(fullPath);
        }
      } else {
        console.error('Error: Response is not JSON');
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      window.location.reload();
    }
  };


  return (
    <>
    <OnlineUsersProvider>
      <header
        className="flex overflow-hidden bg-white relative z-999 flex-col items-start pt-0 max-md:pt-10 -mt-6 max-md:-mt-10 w-full min-h-[400px] max-md:h-[100px] max-md:px-0 max-md:max-w-full"
        onClick={handleEditBanner}
      >
        <img src={backgroundImage} alt="" className="object-cover relative inset-0 w-full h-[290px] max-md:h-1/3" />

        <div className="flex-row max-md:flex-col z-100 w-auto h-auto bg-white flex gap-4 -mt-16 max-md:-mt-14 max-md:-ml-7 px-10">
          <div onClick={handleIconClick}>
            <div className=" flex">
              <ProfileImage
                src={profileImage}
                alt={`${name}'s profile picture`}
                name={name} rounded={rounded} tag={tag} isOnline={isOnline}
                className="w-40 h-40"
              />
              {isPopupOpen && (
                <EditProfilePhoto
                  onClose={handleCloseClick}
                  onSelectFile={handleSelectFile}
                  userId={userId}
                  userName={name}
                  profileId={profileId}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col w-full self-start mt-16 max-md:mx-0 max-md:-mt-12">
            <div className="flex items-center max-md:ml-0">
              <h1 className="text-3xl font-extrabold text-neutral-800 relative max-md:-mt-4 max-md:text-2xl max-md:mx-2 text-start">{name}</h1>
              {/* <div className="text-lg ml-4 font-semibold text-neutral-800 text-opacity-50 mt-3 max-md:text-md max-md:mt-1">{username}</div> */}
            </div>
            <div className="-mt-2 text-xs font-semibold text-neutral-800 text-opacity-50 max-md:text-sm max-md:ml-2 max-md:-mt-4 ">{status}</div>
          </div>

        </div>
      </header>
      {selectedFile && !croppedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-2xl w-full max-w-3xl">
            <div className="cropper-wrapper">
              <Cropper
                image={currentProfileImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleCropImage} className="bg-blue-500 text-white px-4 py-2 rounded-full">
                Crop
              </button>
            </div>
          </div>
        </div>
      )}
      {croppedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-md">
            <img src={croppedImage} alt="Cropped" className="w-full mb-4" />
            <div className="flex justify-end mt-4">
              <button onClick={handleSaveCroppedImage} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </OnlineUsersProvider>
      {/* {isUpdatePopupOpen && (
        <UpdatePhotoButton onClose={handleCloseUpdatePopup} file={croppedImage} />
      )} */}
    </>
  );
}

export default ProfileHeader;






