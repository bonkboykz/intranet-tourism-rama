import React, { useState, useEffect, useRef } from "react";
import { usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';


function Avatar({ src, alt }) {
  return <img loading="lazy" src={src} alt={alt} className="shrink-0 aspect-square w-[53px]" />;
}

function UserInfo({ name, timestamp }) {
  return (
    <div className="flex flex-col my-auto">
      <div className="text-base font-bold text-neutral-800">{name}</div>
      <div className="mt-3 text-xs text-neutral-800 text-opacity-50">{timestamp}</div>
    </div>
  );
}

function FeedbackOption({ optionText }) {
  return (
    <div className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap">
      <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
      <div className="flex-auto max-md:max-w-full">{optionText}</div>
    </div>
  );
}

function ProfileHeader({ name, timeAgo, profileImageSrc, profileImageAlt }) {
  return (
    <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
      <div className="flex gap-1.5">
        <img loading="lazy" src={profileImageSrc} alt={profileImageAlt} className="shrink-0 aspect-square w-[53px]" />
        <div className="flex flex-col my-auto">
          <div className="text-base font-semibold text-neutral-800">{name}</div>
          <time className="mt-3 text-xs text-neutral-800 text-opacity-50">{timeAgo}</time>
        </div>
      </div>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3c193bbbcd5eca7bf933dad4a6932d076b04eb038d7635c591737bbebdc61ef?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&" alt="" className="shrink-0 self-start aspect-[3.85] w-[19px]" />
    </header>
  );
}

function FeedbackForm() {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const HandleFeedbackClick = (event) => {
    event.preventDefault(); // Prevents the default form submission
    console.log('Sending Form...');
  };

  return (
    <form className="flex gap-3.5 mt-4 max-md:flex-wrap max-md:max-w-full">
      <textarea
        ref={textAreaRef}
        value={inputValue}
        onChange={handleChange}
        placeholder="Give Your Feedback"
        className="grow justify-center items-start px-5 py-3 text-sm leading-5 rounded-md border border-gray-100 border-solid text-neutral-800 text-opacity-50 w-fit max-md:px-5 max-md:max-w-full"
        rows="4"
        style={{ maxHeight: "30px", overflowY: "auto" }}
      />
      <button className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5" onClick={HandleFeedbackClick}>
        Send
      </button>
    </form>
  );
}

function OutputData({ polls }) {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState({});

  const { props } = usePage();
  const { id } = props; // Access the user ID from props


useEffect(() => {
    fetch("/api/crud/posts?with[]=user&with[]=attachments", { // Ensure 'user' relationship is loaded
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log('dd', data.data.data);
        const posts = data.data.data.map((post) => {
          post.attachments = Array.isArray(post.attachments) ? post.attachments : [post.attachments];
          return post;
        });
        setPostData(posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

// const handleLogout = (event) => {
//   event.preventDefault();
//   fetch('/logout', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//           'X-CSRF-Token': csrfToken,
//       },
//   })
//       .then(() => {
//           window.location.href = '/';
//       })
//       .catch((err) => console.error(err));
// };

  const togglePopup = (index) => {
    setIsPopupOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    fetch("/api/crud/posts?with[]=attachments", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(hh, data.data.data);
        const posts = data.data.data.map((post) => {
          post.attachments = Array.isArray(post.attachments) ? post.attachments : [post.attachments];
          return post;
        });
        setPostData(posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const icons = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/594907e3c69b98b6d0101683915b195ce42280c8ba80773ecd95b387436ea664?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&", alt: "Icon 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/202b9f1277b73cbc2e1879918537061084b7287ef0a87b496a5b16d68837ff74?apiKey=0fc34b149732461ab0a1b5ebd38a1a4f&", alt: "Icon 2" },
  ];

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    {polls.map((poll, index) => (
        <div className="input-box-container" style={{ height: "auto", marginTop: "-10px" }} key={poll.id}>
        <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-sm max-w-[610px] max-md:pl-5">
            <ProfileHeader name="Fareez Hishamuddin" timeAgo="1 day ago" profileImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/726408370b648407cc55fec1ee24245aad060d459ac0f498438d167758c3a165?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&" profileImageAlt="Profile image of Thomas" />
            <div className="poll">
            <h3>{poll.content}</h3>
            <ul>
                {poll.options.map((option, i) => (
                <li key={i}>
                    <FeedbackOption optionText={`${option} (${calculatePercentage(poll.id, i)}%)`} onVote={() => handleVote(poll.id, i)} />
                </li>
                ))}
            </ul>
            </div>
            <FeedbackForm />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d36c4e55abf5012ece1a90ed95737b46c9b6970a05e3182fdd6248adca09028e?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&" alt="" className="mt-6 aspect-[4.55] w-[76px]" />
        </article>
        </div>
    ))}
    {postData && postData.map((post, index) => (
        <div key={post.id} className="">

        <article className="mt-4 p-4 border rounded-2xl bg-white border-2 shadow-xl w-[610px] relative">
            <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
            <div className="flex gap-1 mt-2">


            </div>

            {/* icon speaker & 3 dot*/}

            <div className="flex justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1.5 -mt-1">
                            <img loading="lazy" src={post.user.profileImage ?? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`} alt={post.user.name} className="shrink-0 aspect-square w-[53px]" />
                        <div className="flex flex-col my-auto">
                            <div className="text-base font-semibold text-neutral-800">{post.user.name}</div>
                            <time className="mt-1 text-xs text-neutral-800 text-opacity-50">{formatTimeAgo(post.created_at)}</time>
                        </div>
                    </div>
                    <img
                        loading="lazy"
                        src="assets/wallpost-dotbutton.svg"
                        alt="Options"
                        className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer -mt-2"
                        onClick={() => togglePopup(index)}
                    />
                </div>
            </div>


            {isPopupOpen[index] && (
                <div className="absolute bg-white border-2 rounded-xl p-1 shadow-lg mt-6 right-0 w-[160px] h-auto z-10 ">
                <p className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl  p-2" onClick={() => handleEdit(index)}><img className="w-6 h-6" src="/assets/EditIcon.svg" alt="Edit" />Edit</p>
                <div className="font-extrabold text-neutral-800 mb-1 mt-1 border-b-2 border-neutral-300"></div>

                <p className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2" onClick={() => handleDelete(index)}><img className="w-6 h-6" src="/assets/DeleteIcon.svg" alt="Delete" />Delete</p>
                <div className="font-extrabold text-neutral-800 mb-2 mt-1 border-b-2 border-neutral-300"></div>

                <p className="cursor-pointer flex flex-row hover:bg-blue-100 rounded-xl p-2" onClick={() => handleAnnouncement(index)}><img className="w-6 h-6" src="/assets/AnnounceIcon.svg" alt="Announcement" />Announcement</p>
                </div>
            )}
            </header>
            <div
                className=" post-content break-words overflow-hidden"
                style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
                {post.content}
            </div>
            <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 underline max-md:max-w-full">
            {post.tag}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-2">
                {post.attachments.map((attachment, index) => (
                    <div key={index} className="attachment">
                    {attachment.mime_type.startsWith("image/") ? (
                        <img src={`/storage/${attachment.path}`} alt="attachment" className="w-full h-auto rounded-lg" />
                    ) : (
                        <a href={`/storage/${attachment.path}`} download className="block w-full h-24 bg-gray-100 rounded-lg text-xs font-semibold text-center leading-24">
                        Download {attachment.file_name}
                        </a>
                    )}
                    </div>
                ))}
            </div>

            <div className="flex justify-start gap-2 w-5 h-5 mt-2">
                <img src='/assets/likeforposting.svg' alt="Like" className="w-6 h-6 cursor-pointer" />
                <img src='/assets/commentforposting.svg' alt="Comment" className="w-6 h-6 cursor-pointer" />
                <img src='/assets/shareforposting.svg' alt="Share" className="w-6 h-6 cursor-pointer" />
            </div>

        </article>
        </div>
    ))}
    </>
);
}

export default OutputData;
