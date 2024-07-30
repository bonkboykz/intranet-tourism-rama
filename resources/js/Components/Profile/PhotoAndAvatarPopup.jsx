import * as React from "react";

function Avatar({ src, alt, isSelected, onClick }) {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={`shrink-0 aspect-square w-[94px] cursor-pointer hover:scale-125 transition-transform duration-300 ${isSelected ? 'border-4 border-blue-500' : ''}`}
      onClick={onClick}
    />
  );
}

function PhotoAndAvatarPopup({ onClose, userId, csrfToken, authToken, profileImage, setProfileImage, userName }) {
  const [selectedAvatar, setSelectedAvatar] = React.useState(null);

  const avatars = [
    { src: "assets/Avatar 1.png", alt: "Avatar 1" },
    { src: "assets/Avatar 2.png", alt: "Avatar 2" },
    { src: "assets/Avatar 3.png", alt: "Avatar 3" },
    { src: "assets/Avatar 4.png", alt: "Avatar 4" },
    { src: "assets/Avatar 5.png", alt: "Avatar 5" },
    { src: "assets/Avatar 6.png", alt: "Avatar 6" },
    { src: "assets/Avatar 7.png", alt: "Avatar 7" },
    { src: "assets/Avatar 8.png", alt: "Avatar 8" },
    { src: "assets/Avatar 9.png", alt: "Avatar 9" },
    { src: "assets/Avatar 10.png", alt: "Avatar 10" },
    { src: "assets/Avatar 11.png", alt: "Avatar 11" },
    { src: "assets/Avatar 12.png", alt: "Avatar 12" },
    { src: "assets/Avatar 13.png", alt: "Avatar 13" },
    { src: "assets/Avatar 14.png", alt: "Avatar 14" },
    { src: "assets/Avatar 15.png", alt: "Avatar 15" },
  ];

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar.src);
  };

  const handleSaveClick = async () => {
    if (!selectedAvatar) {
      alert("Please select an avatar to save.");
      return;
    }

    try {
      // Fetch the image as a blob
      const response = await fetch(selectedAvatar);
      const blob = await response.blob();

      // Create a file from the blob
      const file = new File([blob], `${selectedAvatar.split('/').pop()}`, { type: blob.type });

      const formData = new FormData();
      formData.append('image', file);
      formData.append('user_id', userId);
      formData.append('_method', 'PUT');
      formData.append('name', userName);

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      };

      const saveResponse = await fetch(`/api/profile/profiles/${userId}`, options);
      const data = await saveResponse.json();

      if (!saveResponse.ok) {
        console.error('Error response from server:', data);
        throw new Error('Network response was not ok');
      }

      console.log('Avatar updated successfully:', data);
      setProfileImage(selectedAvatar); // Update the profile image in the parent component
      onClose(); // Close the popup
    } catch (error) {
      console.error('Error updating avatar:', error);
      // window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 shadow-custom">
      <div className="p-2 rounded-3xl w-2xl" onClick={(e) => e.stopPropagation()}>
        <section className="flex flex-col py-2.5 bg-white rounded-3xl w-[700px]">
          <div className="flex flex-col pr-2.5 pl-5 w-full">
            <header className="flex gap-5 items-start text-2xl font-bold text-neutral-800">
              <h1 className="flex-auto mt-5">Pick an Avatar</h1>
            </header>
            <div className="grid grid-cols-6 gap-3 mt-9  px-2">
              {avatars.map((avatar) => (
                <div className="w-[90px] h-[90px]" key={avatar.src}>
                  <Avatar
                    src={avatar.src}
                    alt={avatar.alt}
                    isSelected={selectedAvatar === avatar.src}
                    onClick={() => handleAvatarClick(avatar)}
                  />
                </div>
              ))}
            </div>
          </div>
          <footer className="flex gap-2.5 self-end m-4 mr-6 text-sm font-bold text-center">
            <button onClick={onClose} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">
              Cancel
            </button>
            <button onClick={handleSaveClick} className="flex flex-col justify-center text-white">
              <span className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full">Save</span>
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default PhotoAndAvatarPopup;
