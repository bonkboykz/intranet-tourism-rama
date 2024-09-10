import React, { useEffect, useState } from "react";

const ImageComponent = ({ src, alt, className, onClick }) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className={className}
    style={{ objectFit: "cover", width: "100%", height: "100%", cursor: "pointer" }}
    onClick={onClick}
  />
);

// const ImageProfile = ({ selectedItem, userId }) => {
//   const [images, setImages] = useState([]);

  // useEffect(() => {
  //   fetch("/api/resources/resources")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const imagePaths = data.data.data
  //         .filter((item) => {
  //           // Check if the item is an image and belongs to the specified user
  //           const fileExtension = item.path.split('.').pop().toLowerCase();
  //           return (
  //             ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension) &&
  //             item.user_id === userId
  //           );
  //         })
  //         .map((item) => ({
  //           src: `/storage/${item.path}`,
  //           alt: `Description ${item.id}`,
  //           category: item.attachable_type // Adjust as per your condition
  //         }));
  //       setImages(imagePaths);
  //     })
  //     .catch((error) => console.error("Error fetching images:", error));
  // }, [userId]);

//   // Filter images based on selectedItem
//   const filteredImages = selectedItem === "All" ? images : images.filter((image) => image.category === selectedItem);

//   return (
//     <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-6">
//       <header>
//         <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-2">
//           Images
//         </h1>
//         <hr className="underline" />
//       </header>
//       <section className="mt-8 max-md:max-w-full sm::max-s-full">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//           {filteredImages.length > 0 ? (
//             filteredImages.map((img, index) => (
//               <figure key={index} className="flex flex-col">
//                 <ImageComponent
//                   src={img.src}
//                   alt={img.alt}
//                   className="grow shrink-0 w-full h-full"
//                 />
//               </figure>
//             ))
//           ) : (
//             <p>No Images available...</p>
//           )}
//         </div>
//       </section>
//     </section>
//   );
// };

// const ImageProfile = ({ selectedItem, userId, accessableType, accessableId, filterBy }) => {
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     fetch("/api/resources/resources")
//       .then((response) => response.json())
//       .then((data) => {
//         const imagePaths = data.data.data
//           .filter((item) => {
//             const fileExtension = item.path.split('.').pop().toLowerCase();

//             if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
//               if (filterBy === 'user') {
//                 return item.user_id === userId;
//               } else if (filterBy === 'department') {
//                 console.log("filtering depaer", item);
                
//                 return item.attachable.accessibilities.some(accessibility =>
//                   accessibility.accessable_type === accessableType &&
//                   accessibility.accessable_id === accessableId
//                 );
//               }
//             }
//             return false;
//           })
//           .map((item) => ({
//             src: `/storage/${item.path}`,
//             alt: `Description ${item.id}`,
//             category: item.attachable_type // Adjust as per your condition
//           }));
//         setImages(imagePaths);
//       })
//       .catch((error) => console.error("Error fetching images:", error));
//   }, [userId, accessableType, accessableId, filterBy]);

const ImageProfile = ({ selectedItem, userId, accessableType, accessableId, filterBy }) => {
  const [images, setImages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const openPopup = (index) => {
    setCurrentMediaIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    let apiUrl = '/api/resources/resources?';

    if (filterBy === 'user') {
      console.log("userrrr");
      apiUrl += `with[]=attachable.accessibilities`;
    } else if (filterBy === 'department') {
      apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const imagePaths = data.data.data
          .filter((item) => {
            const fileExtension = item.path.split('.').pop().toLowerCase();

            // console.log("ITEM", item);
            return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension) && item.attachable?.type !== 'story';
            
          })
          .map((item) => ({
            src: `/storage/${item.path}`,
            alt: `Description ${item.id}`,
            category: item.attachable_type, // Adjust as per your condition
            type: item.attachable?.type 
          }));
        setImages(imagePaths);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, [userId, accessableType, accessableId, filterBy]);

  const filteredImages = selectedItem === "All" ? images : images.filter((image) => image.category === selectedItem);

  console.log("FI", filteredImages);
  

  return (
    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
      <header>
        <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
          Images
        </h1>
        <hr className="underline" />
      </header>
      <section className="mt-8 max-md:max-w-full sm::max-s-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredImages.length > 0 ? (
            filteredImages.map((img, index) => (
              <figure key={index} className="flex flex-col">
                <ImageComponent
                  src={img.src}
                  alt={img.alt}
                  className="grow shrink-0 w-full h-full"
                  onClick={() => openPopup(index)}
                />
              </figure>
            ))
          ) : (
            <p>No Images available...</p>
          )}
        </div>
      </section>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-row w-full justify-center items-start">
            <div className="bg-white lg:p-6 p-4 rounded-2xl max-w-3xl max-h-screen relative max-md:mx-4">
              <button onClick={closePopup} className="absolute top-2 right-2">
                <img src="/assets/cancel.svg" alt="Close icon" className="ml-4 w-5 h-5" />
              </button>
              <div className="flex justify-center w-full">
                <div className="bg-gray-200 h-full w-full flex justify-center items-center">
                  <img
                    key={images[currentMediaIndex].src}
                    src={images[currentMediaIndex].src}
                    alt="Current attachment"
                    className="w-[500px] h-[500px] object-contain rounded-none"
                  />
                </div>
              </div>
              <div className="flex justify-center mt-4 overflow-x-auto w-full">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer mx-1 ${currentMediaIndex === index ? 'border-2 border-blue-500' : ''}`}
                    onClick={() => setCurrentMediaIndex(index)}
                  >
                    <img
                      src={img.src}
                      alt="Thumbnail"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const VideoComponent = ({ src, alt, className }) => (
  <video controls className={className}>
    <source src={src} type="video/mp4" />
    {alt}
  </video>
);

const VideoProfile = ({ selectedItem, userId, accessableType, accessableId, filterBy }) => {
  const [videos, setVideos] = useState([]);

  // useEffect(() => {
  //   fetch("/api/resources/resources")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const videoPaths = data.data.data
  //         .filter((item) => {
  //           // Check if the item is a video, you can adjust the condition based on your API response
  //           const fileExtension = item.path.split('.').pop().toLowerCase();
  //           return (
  //             ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'].includes(fileExtension) &&
  //             item.user_id === userId
  //           );
  //         })
  //         .map((item) => ({
  //           src: `/storage/${item.path}`,
  //           alt: `Description ${item.id}`,
  //           category: item.attachable_type // Adjust as per your condition
  //         }));
  //       setVideos(videoPaths);
  //     })
  //     .catch((error) => console.error("Error fetching videos:", error));
  // }, [userId]);


  useEffect(() => {
    let apiUrl = '/api/resources/resources?';

    if (filterBy === 'user') {
      apiUrl = apiUrl;
    } else if (filterBy === 'department') {
      apiUrl += `scopes[0][accessfor]=posts&scopes[0][accessableBy][]=${accessableType}&scopes[0][accessableBy][]=${accessableId}&with[]=attachable.accessibilities`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const videoPaths = data.data.data
          .filter((item) => {
            const fileExtension = item.path.split('.').pop().toLowerCase();

            return ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'].includes(fileExtension);
          })
          .map((item) => ({
            src: `/storage/${item.path}`,
            alt: `Description ${item.id}`,
            category: item.attachable_type // Adjust as per your condition
          }));
        setVideos(videoPaths);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, [userId, accessableType, accessableId, filterBy]);




  // Filter videos based on selectedItem
  const filteredVideos = selectedItem === "All" ? videos : videos.filter((video) => video.category === selectedItem);

  return (
    <section className="flex flex-col px-4 pt-4 py-3 pb-3 max-w-[1500px] max-md:px-5 bg-white rounded-lg shadow-custom mt-4">
      <header>
        <h1 className="text-2xl font-bold text-neutral-800 max-md:max-w-full pb-0">
          Videos
        </h1>
        <hr className="underline" />
      </header>
      <section className="mt-8 max-md:max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <figure key={index} className="flex flex-col">
                <VideoComponent
                  src={video.src}
                  alt={video.alt}
                  className="grow shrink-0 max-w-full aspect-[1.19] w-full"
                />
              </figure>
            ))
          ) : (
            <p>No Videos available...</p>
          )}
        </div>
      </section>
    </section>
  );
};

export { ImageProfile, VideoProfile };
