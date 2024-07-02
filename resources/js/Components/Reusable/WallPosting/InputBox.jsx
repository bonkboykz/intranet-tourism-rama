import React, { useState, useRef } from "react";
import { Polls } from "./InputPolls";
import { People } from "./InputPeople";
import TagInput from "./AlbumTag";
import '../css/InputBox.css';
import '../../../Pages/Calendar/index.css';

function ShareYourThoughts({ userId, onCreatePoll }) {
  const [inputValue, setInputValue] = useState("");
  const [showPollPopup, setShowPollPopup] = useState(false);
  const [showPeoplePopup, setShowPeoplePopup] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [tags, setTags] = useState([]);
  const textAreaRef = useRef(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClickSend = () => {
    const formData = new FormData();
    formData.append('user_id', userId); // Use the userId prop here
    formData.append('type', 'post');
    formData.append('visibility', 'public');
    formData.append('content', inputValue);
    formData.append('tag', JSON.stringify(tags));

    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    fetch("/api/crud/posts", {
      method: "POST",
      body: formData,
      headers: { Accept: 'application/json' }
    })
    .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setInputValue("");
        setAttachments([]);
        setFileNames([]);
        setTags([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        window.location.reload();
      });
  };

  const handleFileUpload = (file) => {
    setAttachments((prevAttachments) => [...prevAttachments, file]);
    setFileNames((prevFileNames) => [...prevFileNames, file.name]);
  };

  const createFileInputHandler = (accept) => () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      handleFileUpload(file);
    };
    fileInput.click();
  };

  const handleClickImg = createFileInputHandler('image/*');
  const handleClickVid = createFileInputHandler('video/*');
  const handleClickDoc = createFileInputHandler('application/pdf, .doc, .docx, .txt');

  const handleClickPoll = () => {
    setShowPollPopup(true);
  };

  const handleClickPeople = () => {
    setShowPeoplePopup(true);
  };

  const closePopup = () => {
    setShowPollPopup(false);
    setShowPeoplePopup(false);
  };

  return (
    <section className="flex flex-col justify-center text-sm max-w-[610px] text-neutral-800">
      <div className="input-box-container mt-16 flex gap-5 justify-between px-8 pt-5 pb-2 bg-white rounded-2xl shadow-sm max-md:flex-wrap max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col w-full">
          <textarea
            ref={textAreaRef}
            value={inputValue}
            onChange={handleChange}
            placeholder="Share Your Thoughts..."
            className="self-center mt-1 h-8 px-2 text-sm border-none appearance-none resize-none input-no-outline"
          />
          <div className="flex mt-7 items-center">
            <div className="flex gap-3">
              <button>
                <img
                  loading="lazy"
                  src="assets/inputpolls.svg"
                  alt="Icon 1"
                  className="w-[15px] h-auto"
                  onClick={handleClickPoll}
                />
              </button>
              <button>
                <img
                  loading="lazy"
                  src="assets/inputimg.svg"
                  alt="Icon 2"
                  className="w-[15px] h-auto"
                  onClick={handleClickImg}
                />
              </button>
              <button>
                <img
                  loading="lazy"
                  src="assets/inputvid.svg"
                  alt="Icon 3"
                  className="w-[15px] h-auto"
                  onClick={handleClickVid}
                />
              </button>
              <button>
                <img
                  loading="lazy"
                  src="assets/inputdoc.svg"
                  alt="Icon 4"
                  className="w-[15px] h-auto"
                  onClick={handleClickDoc}
                />
              </button>
              <button>
                <img
                  loading="lazy"
                  src="assets/inputpeople.svg"
                  alt="Icon 5"
                  className="w-[10px] h-auto"
                  onClick={handleClickPeople}
                />
              </button>
            </div>
            <div className="file-names-container flex flex-wrap gap-2" style={{ minWidth: `${fileNames.length * 80}px` }}>
              {fileNames.map((name, index) => (
                <div className="flex items-center px-2 py-1 bg-white rounded-lg shadow" key={index}>
                  <div className="file-name text-xs truncate">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleClickSend} className="send-button">
          <div className="send-button-icon">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9e6a4fb4fdc3ecfcef04a0984faf7c2720a004081fccbe4db40b1509a23780?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
              alt=""
            />
          </div>
        </button>
      </div>
      <TagInput tags={tags} setTags={setTags} />
      {showPollPopup && <Polls onClose={closePopup} onCreatePoll={onCreatePoll} />}
      {showPeoplePopup && <People onClose={closePopup} />}
    </section>
  );
}

export default ShareYourThoughts;
