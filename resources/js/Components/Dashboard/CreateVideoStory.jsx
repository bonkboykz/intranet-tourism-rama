import React, { useState, useRef, useEffect } from "react";
import defaultImg from '../../../../public/assets/story/upload-photo-story.png';

const CreateVideoStory = ({ goBack, onClose }) => {
    const [video, setVideo] = useState('');
    const [text, setText] = useState('');
    const [previewedText, setPreviewedText] = useState('');

    const fileUploadRef = useRef();
    const videoRef = useRef();

    const handleVideoChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setVideo(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    const handleVideoUpload = (e) => {
      e.preventDefault();
      fileUploadRef.current.click();
    };

    const handleTextChange = (e) => {
      if (!video) {
        alert('Please upload a video first.');
      } else {
        setText(e.target.value);
      }
    };

    const handlePreview = () => {
      setPreviewedText(text);
    };

    const handleReset = () => {
      setVideo('');
      setText('');
      setPreviewedText('');
    };

    const handlePost = () => {
      if (video && text) {
        console.log('Posting story:');
        console.log('Video:', video);
        console.log('Text:', text);
        alert('Story has been posted!');
      } else if (!video && !text) {
        alert('Please upload a video or add text before posting.');
      } else {
        alert('Please add both video and text before posting.');
      }
    };

    return (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-2xl font-bold mb-4 text-center w-full">Create Video Story</h1>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <img src="/assets/icon-close.png" alt="Close" />
          </button>
        </div>
        <div className="flex rounded-lg w-full">
          <div className="w-3/12 p-4 border-r flex flex-col gap-4">
            <textarea
              placeholder="Write your story..."
              value={text}
              onChange={handleTextChange}
              className="resize-none w-full h-48 p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="py-2 px-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 max-w-32 "
              onClick={handlePreview}
            >
              Preview Text
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-neutral-300 text-black rounded-full hover:bg-neutral-400 max-w-32"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-green-600 text-white rounded-full hover:bg-green-700 max-w-32"
              onClick={handlePost}
            >
              Post
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-gray-600 text-white rounded-full hover:bg-gray-700 max-w-32"
              onClick={goBack}
            >
              Go Back
            </button>
          </div>
          <div className="w-9/12 flex justify-center items-center relative p-4">
            {video ? (
              <div className="relative max-h-96 max-w-full">
                <video
                  ref={videoRef}
                  className="max-h-96 max-w-full object-contain rounded-lg"
                  autoPlay
                  onEnded={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % media.length)}
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {previewedText && (
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-center p-2 rounded-b-lg">
                    {previewedText}
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleVideoUpload} className="relative max-h-96 max-w-full">
                <img
                  src={defaultImg}
                  alt="Uploading"
                  className="max-h-96 max-w-full object-contain rounded-lg"
                />
              </button>
            )}
            <input
              type="file"
              ref={fileUploadRef}
              hidden
              accept="video/*"
              onChange={handleVideoChange}
            />
          </div>
        </div>
      </div>
    );
  };

  export default CreateVideoStory;
