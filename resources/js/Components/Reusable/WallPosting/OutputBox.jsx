import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import EditPost from './EditPost';
import Comment from './Comment';
import MentionedName from './MentionedName';
import LikesPopup from './LikesPopup';
import './index.css'
import { useCsrf } from "@/composables";
import PostAttachments from './PostAttachments'
import announce from '../../../../../public/assets/announcementIcon2.svg'

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


function ProfileHeader({ name, timeAgo, profileImageSrc, profileImageAlt }) {
  return (
    <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full lg:w-[610px] md:w-[610px] sm:w-[610px]">
      <div className="flex gap-1.5">
        <img loading="lazy" src={profileImageSrc} alt={profileImageAlt} className="shrink-0 aspect-square w-[53px]" />
        <div className="flex flex-col my-auto">
          <div className="text-base font-semibold text-neutral-800">{name}</div>
          <time className="mt-3 text-xs text-neutral-800 text-opacity-50">{timeAgo}</time>
        </div>
      </div>
    </header>
  );
}

function FeedbackForm() {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFeedbackClick = (event) => {
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
      <button className="flex flex-col justify-center my-auto text-xs font-semibold leading-5 text-center text-white whitespace-nowrap px-6 py-2 bg-red-500 rounded-2xl max-md:px-5" onClick={handleFeedbackClick}>
        Send
      </button>
    </form>
  );
}

function FeedbackOption({ optionText, onVote }) {
  return (
    <div
      className="flex gap-2.5 px-3.5 py-2.5 mt-4 text-sm leading-5 bg-gray-100 rounded-3xl text-neutral-800 max-md:flex-wrap cursor-pointer"
      onClick={onVote}
    >
      <div className="shrink-0 self-start w-3 bg-white rounded-full h-[11px]" />
      <div className="flex-auto max-md:max-w-full">{optionText}</div>
    </div>
  );
}


function OutputData({ polls, filterType, filterId, userId, loggedInUserId, postType, variant }) {
  const [pollos, setPollos] = useState(polls);
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [likedUsers, setLikedUsers] = useState({});
  const [showLikesPopup, setShowLikesPopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const csrfToken = useCsrf();


async function fetchData() {
  try {
    let allPosts = [];
    let currentPage = 1;
    let lastPage = 1;

    // Fetch posts data from all pages
    do {
      const postsResponse = await fetch(`/api/posts/posts?with[]=user&with[]=attachments&with[]=accessibilities&page=${currentPage}&with[]=comments`, {
        method: "GET",
      });
      if (!postsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const postsData = await postsResponse.json();

      // Add the data from the current page to allPosts
      allPosts = allPosts.concat(postsData.data.data.map((post) => {
        post.attachments = Array.isArray(post.attachments) ? post.attachments : [post.attachments];
        return post;
      }));

      // Update pagination info
      currentPage++;
      lastPage = postsData.data.last_page;
    } while (currentPage <= lastPage);

    const postsWithUserProfiles = await Promise.all(allPosts.map(async (post) => {
      const userProfileResponse = await fetch(`/api/users/users/${post.user_id}?with[]=profile`, {
        method: "GET",
      });
      const userProfileData = await userProfileResponse.json();
      post.userProfile = userProfileData.data;

      if (Array.isArray(post.accessibilities) && post.accessibilities.length > 0) {
        const departmentNames = await Promise.all(post.accessibilities.map(async (accessibility) => {
          if (accessibility.accessable_type === accessibility.accessable_type) {
            const departmentResponse = await fetch(`/api/department/departments/${accessibility.accessable_id}`);
            const departmentData = await departmentResponse.json();
            return departmentData.data.name;
          }
          return null;
        }));
        post.departmentNames = departmentNames.filter(name => name !== null).join(', ');
      } else {
        post.departmentNames = null;
      }

      return post;
    }));

    // Separate announcements and other posts
    const announcements = postsWithUserProfiles.filter(post => post.type === 'announcement');
    const otherPosts = postsWithUserProfiles.filter(post => post.type !== 'announcement');

    // Sort announcements by updated_at descending (latest first)
    announcements.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Sort other posts by created_at descending (latest first)
    otherPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Merge announcements with other posts
    const sortedPosts = [...announcements, ...otherPosts];

sortedPosts.forEach(post => fetchLikedUsers(post));


    // console.log("SORTEDPOST", sortedPosts);

    setPostData(sortedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    setLoading(false);
  }
}

const fetchLikedUsers = (post) => {
  if (Array.isArray(post.likes)) {
    const uniqueUserIds = [...new Set(post.likes)];

    uniqueUserIds.forEach(user_id => {
      if (user_id) {
        fetch(`/api/users/users/${user_id}?with[]=profile`, {
          method: "GET",
        })
        .then((response) => response.json())
        .then(({ data }) => {
          setLikedUsers(prevState => ({
            ...prevState,
            [post.id]: {
              ...prevState[post.id],
              [user_id]: {
                name: data.name,
                image: data.profile?.image, // Assuming `data.profile.image` contains the image URL
              }
            }
          }));
        })
        .catch((error) => {
          console.error(`Error fetching user data for user_id ${user_id}:`, error);
        });
      }
    });
  }
};

useEffect(() => {
  fetchData();
}, []);


    // Filter posts based on accessable_type and accessable_id
  let filteredPostData = postData.filter(post => post.type !== 'story');

  if (filterType !== null && filterId !== null) {
    filteredPostData = filteredPostData.filter((post) => {
      if (Array.isArray(post.accessibilities) && post.accessibilities.length > 0) {
        return post.accessibilities.some(accessibility =>
          accessibility.accessable_type === filterType && accessibility.accessable_id == filterId
        );
      }
      return false;
    });
  }

// Separate announcements and non-announcements
const announcements = filteredPostData.filter(post => post.type === 'announcement');
const nonAnnouncements = filteredPostData.filter(post => post.type !== 'announcement');

// Reverse the non-announcement posts
const reversedNonAnnouncements = filterType ? [...nonAnnouncements] : [...nonAnnouncements];

// console.log("REVERSEDNON", reversedNonAnnouncements);

// Combine announcements at the top with the reversed non-announcement posts
const finalPosts = [...announcements, ...reversedNonAnnouncements];


// console.log("FINAL", finalPosts);



  const togglePopup = (index) => {
    setIsPopupOpen((prevState) => {
      // If the clicked popup is already open, close it
      if (prevState[index]) {
        return {};
      }
      // Otherwise, open the clicked popup and close all others
      return { [index]: true };
    });
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (post) => {
    setCurrentEditPost(post);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      // Fetch the post to check if it has accessibilities
      const postToDelete = postData.find(post => post.id === postIdToDelete);


      // console.log("LLLL", postToDelete.comments.pivot.id);
    //   postToDelete.comments.forEach(comment => {
    //     console.log("LLLL", comment.pivot.comment_id);
    // });




      if (!postToDelete) {
        console.error(`Post with ID ${postIdToDelete} not found.`);
        return;
      }

      // If the post has accessibilities, delete them first
      if (postToDelete.accessibilities && postToDelete.accessibilities.length > 0) {
        for (const accessibility of postToDelete.accessibilities) {
          const response = await fetch(`/api/posts/post_accessibilities/${accessibility.id}`, {
            method: 'DELETE',
            headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
          });

          if (!response.ok) {
            console.error(`Failed to delete accessibility with ID ${accessibility.id}.`);
            return;
          }
        }
      }

      // If the post has comments, delete them first
      if (postToDelete.comments && postToDelete.comments.length > 0) {
        for (const comment of postToDelete.comments) {
          const response = await fetch(`/api/posts/post_comment/${comment.pivot.id}`, {
            method: 'DELETE',
            headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
          });

          if (response.ok) {
            // console.error(`Failed to delete comment with ID ${comment.pivot.id}.`);
            const response = await fetch(`/api/posts/posts/${comment.pivot.comment_id}`, {
              method: 'DELETE',
              headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
            });

            if (!response.ok) {
              console.error(`Failed to delete comment with ID ${comment.pivot.comment_id}.`);
              return;
            }
            // return;
          }
        }
      }

      // Now delete the post
      const postResponse = await fetch(`/api/posts/posts/${postIdToDelete}`, {
        method: 'DELETE',
        headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
      });

      if (postResponse.ok) {
        setPostData(postData.filter(post => post.id !== postIdToDelete));
      } else {
        console.error(`Failed to delete post with ID ${postIdToDelete}.`);
      }
    } catch (error) {
      console.error(`Error deleting post with ID ${postIdToDelete}:`, error);
    } finally {
      setShowDeletePopup(false);
      setIsPopupOpen(false);
    }
  };

  const confirmDelete = (postId) => {
    setPostIdToDelete(postId);
    setShowDeletePopup(true);
  };


  function calculatePercentage(pollId, optionIndex) {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return 0;

    const totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);
    const optionVotes = poll.options[optionIndex].votes;

    return totalVotes === 0 ? 0 : ((optionVotes / totalVotes) * 100).toFixed(2);
  }

  const handleVote = (pollId, optionIndex) => {
    setPollos(prevPolls =>
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map((option, i) =>
            i === optionIndex ? { ...option, votes: option.votes + 1 } : option
          );
          return { ...poll, options: updatedOptions };
        }
        return poll;
      })
    );
  };


  const handleAnnouncement = async (post) => {
    try {
      const newType = post.type === 'announcement' ? 'post' : 'announcement';
      const response = await fetch(`/api/posts/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        // body: JSON.stringify({ type: newType }),
        body: JSON.stringify({ type: newType, user_id: String(post.user.id), visibility: "public" }),
      });

      if (response.ok) {
        // Update the postData state with the new type
        setPostData(prevData =>
          prevData.map(p =>
            p.id === post.id ? { ...p, type: newType } : p
          )
        );
        setIsPopupOpen(false);
        fetchData();
      } else {
        console.error('Failed to update post type');
      }
    } catch (error) {
      console.error('Error updating post type:', error);
    }
  };

    // Function to handle liking a post
    const handleLike = async (postId) => {
      try {
        const response = await fetch(`/api/posts/posts/${postId}/like`, {
          method: 'POST',
          headers: { 'X-CSRF-Token': csrfToken },
        });

        if (response.ok) {
          setLikedPosts((prevLikedPosts) => ({
            ...prevLikedPosts,
            [postId]: true,
          }));
          fetchData(); // Refetch the data to update the post likes count
        } else {
          console.error("Failed to like the post");
        }
      } catch (error) {
        console.error("Error liking the post:", error);
      }
    };

    // Function to handle unliking a post
    const handleUnlike = async (postId) => {
      try {
        const response = await fetch(`/api/posts/posts/${postId}/unlike`, {
          method: 'POST',
          headers: { 'X-CSRF-Token': csrfToken },
        });

        if (response.ok) {
          setLikedPosts((prevLikedPosts) => ({
            ...prevLikedPosts,
            [postId]: false,
          }));
          fetchData(); // Refetch the data to update the post likes count
        } else {
          console.error("Failed to unlike the post");
        }
      } catch (error) {
        console.error("Error unliking the post:", error);
      }
    };

    const isPostLikedByUser = (post) => {
      return post.likes && post.likes.includes(loggedInUserId);
    };


    const openCommentPopup = (post) => {
      // console.log("Bukak Jap", post);

      setSelectedPost(post);
      setIsCommentPopupOpen(true);
    };



// const renderContentWithTags = (content, mentions) => {

//   console.log("GG", mentions);


//   const mentionNames = mentions ? JSON.parse(mentions).map(person => person.name) : [];

//   const tagRegex = new RegExp(mentionNames.map(name => `\\b${name}\\b`).join('|'), 'g');


//   // Regex to match URLs starting with https
//   const urlRegex = /https:\/\/[^\s]+/g;

//   // Replace URLs with anchor tags
//   const replaceUrls = (text) => {
//       return text.split(urlRegex).reduce((acc, part, index) => {
//           if (index === 0) return [part];
//           const urlMatch = text.match(urlRegex)[index - 1];
//           return [...acc,
//               <a
//                   href={urlMatch}
//                   key={index}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ color: 'blue', textDecoration: 'underline' }} // Style for blue URL
//               >
//                   {urlMatch}
//               </a>,
//               part
//           ];
//       }, []);
//   };

//   // Replace tags with span and URLs with anchor tags
//   const parts = content?.split(tagRegex);
//   const formattedContent = parts?.reduce((acc, part, index) => {
//       if (index === 0) return replaceUrls(part);

//       // Get the matched tag
//       const tagMatch = content?.match(tagRegex)[index - 1];
//       const tagName = tagMatch.replace('@', '');

//       // Check if the tag name matches any mention name
//       const isMentioned = mentionNames.includes(tagName);

//       // Apply the blue color if the tag is a mentioned name
//       return [
//           ...acc,
//           <span
//               className={`tagged-text ${isMentioned ? 'text-blue-500' : ''}`}
//               key={`tag-${index}`}
//           >
//               {tagMatch}
//           </span>,
//           ...replaceUrls(part)
//       ];
//   }, []);

//   return formattedContent;
// };

const renderContentWithTags = (content, mentions) => {
  const mentionData = mentions ? JSON.parse(mentions) : [];
  const mentionNames = mentionData.map(person => person.name);

  // Regex to match mentions and URLs starting with https
  const tagRegex = new RegExp(mentionNames.map(name => `@${name}`).join('|'), 'g');
  const urlRegex = /https:\/\/[^\s]+/g;

  // Replace content with mentions and URLs
  const replaceContent = (text) => {
    const combinedRegex = new RegExp(`(${urlRegex.source}|${tagRegex.source})`, 'g');

    const parts = text?.split(combinedRegex).filter(Boolean);

    return parts?.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            href={part}
            key={`url-${index}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }

      const mentionMatch = mentionNames.find(name => `@${name}` === part);
      if (mentionMatch) {
        const mention = mentionData.find(person => `@${person.name}` === part);
        if (mention) {
          return (
            <MentionedName key={`mention-${index}`} name={mention.name} userId={mention.id} />
          );
        }
      }

      return part;
    });
  };

  return replaceContent(content);
};

    // console.log("HEHEHHE", postData);





    const handleLikesClick = (postId) => {
      // Handle the display of liked users
      // const likedUserNames = likedUsers[postId] ? Object.values(likedUsers[postId]) : [];
      // alert(`Liked by: ${likedUserNames.join(", ")}`);
      setSelectedPostId(postId);
      setShowLikesPopup(true);
    };

    // const postFilter = finalPosts.filter(post => {
    //   if (!postType) return true;
    //   if (postType === 'mention') {
    //     return post.mentions && post.mentions.some(mention => mention.user_id === loggedInUserId);
    //   }
    //   return post.type === postType;
    // });

    // const postFilter = finalPosts.filter(post => {
    //   if (!postType) return true;

    //   if (postType === 'mention') {
    //     if (post.mentions) {
    //       try {
    //         const mentions = JSON.parse(post.mentions);
    //         return Array.isArray(mentions) && mentions.some(mention => parseInt(mention.id) === loggedInUserId);
    //       } catch (error) {
    //         console.error('Error parsing mentions:', error);
    //         return false;
    //       }
    //     }
    //     return false;
    //   }

    //   return post.type === postType;
    // });


    // const postFilter = finalPosts.filter(post => {
    //   console.log("POSTING", post);

    //   if (!postType) return true;
    //   if (postType === 'mention') {
    //     return post.mentions && JSON.parse(post.mentions).length > 0;
    //   }
    //   return post.type === postType;
    // });

    // const postFilter = finalPosts.filter(post => {
    //   console.log("POSTING", post);

    //   if (!postType) return true;

    //   // Handle mention type
    //   if (postType === 'mention') {
    //     return post.mentions && JSON.parse(post.mentions).length > 0;
    //   }

    //   // Handle image, video, and file types based on the attachment extensions
    //   if (postType === 'image' || postType === 'video' || postType === 'file') {
    //     const validExtensions = {
    //       image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    //       video: ['mp4', 'mov', 'avi'],
    //       file: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    //     };

    //     return post.attachments.some(attachment =>
    //       validExtensions[postType].includes(attachment.extension)
    //     );
    //   }

    //   // Handle announcement type
    //   if (postType === 'announcement') {
    //     return post.type === 'announcement';
    //   }

    //   // Default filter by type
    //   return post.type === postType;
    // });




    // Define the filtering function
const filterPosts = (post) => {
  // console.log("POSTING", post);

  if (!postType) return true;

  // Handle mention type
  if (postType === 'mention') {
    return post.mentions && JSON.parse(post.mentions).length > 0;
  }

  // Handle image, video, and file types based on the attachment extensions
  if (postType === 'image' || postType === 'video' || postType === 'file') {
    const validExtensions = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov', 'avi'],
      file: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    };

    return post.attachments.some(attachment =>
      validExtensions[postType].includes(attachment.extension)
    );
  }

  // Handle announcement type
  if (postType === 'announcement') {
    return post.type === 'announcement';
  }

  // Default filter by type
  return post.type === postType;
};

// Apply the filter function to both postData and finalPosts
const PostDataFiltered = postData.filter(filterPosts);
const filteredFinalPosts = finalPosts.filter(filterPosts);



  return (
    <>
      {polls?.map((poll) => (
        console.log("POLL", poll),

        <div className="input-box-container" style={{ height: "auto", marginTop: "-10px" }} key={poll.id}>
          <article className="flex flex-col px-5 py-4 bg-white rounded-xl shadow-sm max-w-[610px] max-md:pl-5">
          <div className="flex items-center">
              <ProfileHeader
                  name="Fareez Hishamuddin"
                  timeAgo="1 day ago"
                  profileImageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/726408370b648407cc55fec1ee24245aad060d459ac0f498438d167758c3a165?apiKey=23ce5a6ac4d345ebaa82bd6c33505deb&"
                  profileImageAlt="Profile image of Thomas"
              />
              <img
                  loading="lazy"
                  src="/assets/wallpost-dotbutton.svg"
                  alt="Options"
                  className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                  onClick={() => togglePopup(index)}
              />
          </div>
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
      //profile
      ))}
      {/* {userId ? postData.filter(post => post.user.id === userId && post.type !== 'story' && post.type !== 'files').map((post, index) => { */}
      {userId ? PostDataFiltered.filter(post => {
    const isAuthor = post.user.id === userId;
    const isMentioned = post.mentions && JSON.parse(post.mentions).some(mention => mention.id == userId);
    const isNotStoryOrFiles = post.type !== 'story' && post.type !== 'files' && post.type !== 'comment';

    return (isAuthor || isMentioned) && isNotStoryOrFiles;
    }).map((post, index) => {
        console.log("POSTDATAA", post);

          // Parse the likes string
          let likesCount = 0;

          if (Array.isArray(post.likes)) {
            likesCount = post.likes?.length;
          }


          return (
            <div className="w-full" key={post.id}>
              {/* Conditional Rendering for Announcement */}
              {post.type === 'announcement' && (
                <div className="mt-10 py-2 px-6 border rounded-2xl border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437] ">
                  <div className="mb-2 flex items-center gap-1">
                    <img src={announce} className="flex-shrink-0 rounded-xl w-7 h-7" alt="Announcement" />
                    <div className="text-white text-center font-bold text-lg	ml-2">
                      Announcement
                    </div>
                  </div>
                </div>
              )}

               {/* Birthday Post For Profile */}
               {post.type === 'birthday' && (
                  <article className={`${post.type === 'announcement' ? 'mt-10' : 'mt-10'} p-4 border rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative`}>
                    <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full ">
                      <div className="flex gap-1 mt-2"></div>
                      <div className="flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                        <span className="text-sm font-semibold text-neutral-800 bg-gray-200 rounded-md px-2 py-1 -mt-5">
                          {post.accessibilities?.map((accessibility, index) => (
                            <span key={index}>
                              {accessibility.accessable_type}{": "}
                            </span>
                          ))}
                          {post.departmentNames ? post.departmentNames : post.type}
                        </span>
                        <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full mt-4">
                          <div className="flex gap-1.5 -mt-1">
                            <img
                              loading="lazy"
                              src={
                                post.userProfile.profile?.image
                                  ? (
                                      post.userProfile.profile.image === '/assets/dummyStaffPlaceHolder.jpg'
                                        ? post.userProfile.profile.image
                                        : post.userProfile.profile.image.startsWith('avatar/')
                                          ? `/storage/${post.userProfile.profile.image}`
                                          : `/avatar/${post.userProfile.profile.image}`
                                    )
                                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`
                              }
                              alt={post.user.name}
                              className="shrink-0 aspect-square w-[53px] rounded-image"
                            />
                            <div className="flex flex-col my-auto">
                              <div className="text-base font-semibold text-neutral-800">{post.user.name}</div>
                              <time className="mt-1 text-xs text-neutral-800 text-opacity-50">{formatTimeAgo(post.created_at)}</time>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              loading="lazy"
                              src="/assets/wallpost-dotbutton.svg"
                              alt="Options"
                              className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                              onClick={() => togglePopup(index)}
                            />
                          </div>
                        </div>
                      </div>
                      {isPopupOpen[index] && (
                        <div className="absolute bg-white border-2 rounded-xl p-1 shadow-lg mt-6 right-0 w-[160px] h-auto z-10">
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleEdit(post)}
                          >
                            <img className="w-6 h-6" src="/assets/EditIcon.svg" alt="Edit" />
                            Edit
                          </p>
                          <div className="font-extrabold text-neutral-800 mb-1 mt-1 border-b-2 border-neutral-300"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <img className="w-6 h-6" src="/assets/DeleteIcon.svg" alt="Delete" />
                            Delete
                          </p>
                          <div className="font-extrabold text-neutral-800 mb-2 mt-1 border-b-2 border-neutral-300"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleAnnouncement(post)}
                          >
                            <img className="w-6 h-6" src="/assets/AnnounceIcon.svg" alt="Announcement" />
                            Announcement
                          </p>
                        </div>
                      )}
                    </header>

                    {!post.attachments || post.attachments.length === 0 ? (
                      // Render this block if there are no attachments
                      <>
                        <div>{post.content}</div>
                        <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          {post.mentions ? JSON.parse(post.mentions).map(mention => mention.name).join(', ') : ''}
                        </p>
                      </>
                    ) : (
                      // Render this block if there are attachments
                      <>
                        <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          {post.mentions ? JSON.parse(post.mentions).map(mention => mention.name).join(', ') : ''}
                        </p>
                        <div className="relative flex flex-wrap gap-2 mt-4">
                          {post.attachments.map((attachment, idx) => (
                            <div key={idx} className="relative w-full">
                              <img
                                src={`/storage/${attachment.path}`}
                                alt={`Attachment ${idx + 1}`}
                                className="rounded-xl w-full h-auto object-cover"
                                style={{ maxHeight: '300px' }} // Allowing the image to take up more vertical space
                              />
                              {idx === Math.floor(post.attachments.length / 2) && (
                                <div className="absolute inset-0 flex justify-center items-center p-4">
                                  <span
                                    className="text-5xl font-black text-center text-white text-opacity-90 bg-black bg-opacity-50 rounded-lg"
                                    style={{ maxWidth: '90%', overflowWrap: 'break-word', wordWrap: 'break-word' }}
                                  >
                                    {post.content}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        {isPostLikedByUser(post) ? (
                          <img
                            src="/assets/Like.svg"
                            alt="Unlike"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleUnlike(post.id)}
                          />
                        ) : (
                          <img
                            src="/assets/likeforposting.svg"
                            alt="Like"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleLike(post.id)}
                          />
                        )}
                        {likesCount > 0 && <span className="text-sm font-medium">{likesCount}</span>}
                      </div>
                      <img src="/assets/commentforposting.svg" alt="Comment" className="w-6 h-6 cursor-pointer" onClick={() => openCommentPopup(post)} />
                    </div>
                  </article>
                )}



              {/* Main Post Content */}
              {post.type !== 'birthday' && (
                <article className={`${post.type === 'announcement' ? '-mt-16' : 'mt-10'} p-4 border rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] z-5 relative`}>
                  <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1 mt-2"></div>
                    <div className="flex flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                      <div className="flex w-full items-center justify-between h-auto mb-4">
                      {(post.type !== 'announcement' && post.type !== 'post') && (
                        <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                          {post.accessibilities?.map((accessibility, index) => (
                            <span key={index}>{accessibility.accessable_type}{": "}</span>
                          ))}
                            {post.departmentNames ? post.departmentNames : post.type}
                        </span>
                      )}
                      </div>
                      <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
                        <div className="flex gap-1.5 -mt-1">
                          <img
                            loading="lazy"
                            src={
                              post.userProfile.profile?.image
                                  ? (
                                      post.userProfile.profile.image === '/assets/dummyStaffPlaceHolder.jpg'
                                          ? post.userProfile.profile.image
                                          : post.userProfile.profile.image.startsWith('avatar/')
                                              ? `/storage/${post.userProfile.profile.image}`
                                              : `/avatar/${post.userProfile.profile.image}`
                                  )
                                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`
                            }
                            alt={post.user.name}
                            className="shrink-0 aspect-square w-[53px] rounded-image"
                          />
                          <div className="flex flex-col my-auto ml-1">
                            <div className="text-base font-semibold text-neutral-800">{post.user.name}</div>
                            <time className="mt-1 text-xs text-neutral-800 text-opacity-50">{formatTimeAgo(post.created_at)}</time>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1 -mt-5">
                            {post.accessibilities?.map((accessibility, index) => (
                              <span key={index}>
                                {accessibility.accessable_type}{": "}
                              </span>
                            ))}
                            {post.departmentNames ? post.departmentNames : post.type}
                          </span> */}
                          <img
                            loading="lazy"
                            src="/assets/wallpost-dotbutton.svg"
                            alt="Options"
                            className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                            onClick={() => togglePopup(index)}
                          />
                        </div>
                      </div>
                    </div>
                      {isPopupOpen[index] && (
                        <div className="absolute bg-white border-2 rounded-xl p-1 shadow-custom mt-16 right-0 w-[180px] h-auto z-10">
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleEdit(post)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/EditIcon.svg" alt="Edit" />
                            Edit
                          </p>
                          <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/DeleteIcon.svg" alt="Delete" />
                            Delete
                          </p>
                          <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleAnnouncement(post)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/AnnounceIcon.svg" alt="Announcement" />
                            Announcement
                          </p>
                        </div>
                      )}
                    </header>
                    {/* <div className="post-content break-words overflow-hidden" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </div> */}
                      <article className="post-content">
                        {renderContentWithTags(post.content, post.mentions)}
                      </article>

                    <p className="taging mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                      {/* {post.tag.replace(/[\[\]"]/, '')} */}
                      {post.tag?.replace(/[\[\]"]/g, '') || ''}
                    </p>


                  {/* {post.mentions?.length > 0 && (
                      <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          Tagged People: {JSON.parse(post.mentions).map(person => person.name).join(', ')}
                      </p>
                  )} */}

                  <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                  {post.event?.replace(/[\[\]"]/g, '') || ''}
                  </p>
                  <PostAttachments attachments={post.attachments} />
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      {isPostLikedByUser(post) ? (
                        <img
                          src="/assets/Like.svg"
                          alt="Unlike"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleUnlike(post.id)}
                        />
                      ) : (
                        <img
                          src="/assets/likeforposting.svg"
                          alt="Like"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleLike(post.id)}
                        />
                      )}
                      {likesCount > 0 && <span className="text-sm font-medium">{likesCount}</span>}
                    </div>
                    <img src="/assets/commentforposting.svg" alt="Comment" className="w-6 h-6 cursor-pointer" onClick={() => openCommentPopup(post)} />
                  </div>
                </article>
              )}
            </div>
          )

          // wallposting

        }) : filteredFinalPosts.filter(post => post.type !== 'story' && post.type !== 'files' && post.type !== 'comment').map((post, index) => {
          // Parse the likes string
          let likesCount = 0;
          // let commentsCount = 0;

          if (Array.isArray(post.likes)) {
            likesCount = post.likes?.length;
          }

          const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0; // Count comments directly
          // console.log("couting", post.comments);



          return (
            <div className="w-full" key={post.id}>
              {/* Conditional Rendering for Announcement */}
              {post.type === 'announcement' && (
                // <div className="mt-10 py-2 px-6 border rounded-2xl border-2 shadow-xl w-full lg:w-full md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437]">
                <div className={`${variant === "department" ? "mt-10 py-2 px-6 border rounded-2xl border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437]" : "mt-10 py-2 px-6 border rounded-2xl border-2 shadow-xl w-full lg:w-full md:w-[610px] sm:w-[610px] relative pb-16 bg-[#FF5437]"}`}>
                  <div className="mb-2 flex items-center gap-1">
                    <img src={announce} className="flex-shrink-0 rounded-xl w-7 h-7" alt="Announcement" />
                    <div className="text-white text-center font-bold text-lg	ml-2">
                      Announcement
                    </div>
                  </div>
                </div>
              )}

                {/* Birthday Post For Public Wall Posting */}
                {/* {post.type === 'birthday' && (
                  <article className={`${post.type === 'announcement' ? 'mt-10' : 'mt-10'} p-4 border rounded-2xl bg-white border-2 shadow-xl w-full lg:w-[610px] md:w-[610px] sm:w-[610px] relative`}>
                    <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full ">
                      <div className="flex gap-1 mt-2"></div>
                      <div className="flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                        <span className="text-sm font-semibold text-neutral-800 bg-gray-200 rounded-md px-2 py-1 -mt-5">
                          {post.accessibilities?.map((accessibility, index) => (
                            <span key={index}>
                              {accessibility.accessable_type}{": "}
                            </span>
                          ))}
                          {post.departmentNames ? post.departmentNames : post.type}
                        </span>
                        <div className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full mt-4">
                          <div className="flex gap-1.5 -mt-1">
                            <img
                              loading="lazy"
                              src={
                                post.userProfile.profile?.image
                                  ? (
                                      post.userProfile.profile.image === '/assets/dummyStaffPlaceHolder.jpg'
                                        ? post.userProfile.profile.image
                                        : post.userProfile.profile.image.startsWith('avatar/')
                                          ? `/storage/${post.userProfile.profile.image}`
                                          : `/avatar/${post.userProfile.profile.image}`
                                    )
                                  : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`
                              }
                              alt={post.user.name}
                              className="shrink-0 aspect-square w-[53px] rounded-image"
                            />
                            <div className="flex flex-col my-auto">
                              <div className="text-base font-semibold text-neutral-800">{post.user.name}</div>
                              <time className="mt-1 text-xs text-neutral-800 text-opacity-50">{formatTimeAgo(post.created_at)}</time>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              loading="lazy"
                              src="/assets/wallpost-dotbutton.svg"
                              alt="Options"
                              className="shrink-0 my-auto aspect-[1.23] fill-red-500 w-6 cursor-pointer mt-1"
                              onClick={() => togglePopup(index)}
                            />
                          </div>
                        </div>
                      </div>
                      {isPopupOpen[index] && (
                        <div className="absolute bg-white border-2 rounded-xl p-1 shadow-lg mt-6 right-0 w-[160px] h-auto z-10">
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleEdit(post)}
                          >
                            <img className="w-6 h-6" src="/assets/EditIcon.svg" alt="Edit" />
                            Edit
                          </p>
                          <div className="font-extrabold text-neutral-800 mb-1 mt-1 border-b-2 border-neutral-300"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <img className="w-6 h-6" src="/assets/DeleteIcon.svg" alt="Delete" />
                            Delete
                          </p>
                          <div className="font-extrabold text-neutral-800 mb-2 mt-1 border-b-2 border-neutral-300"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleAnnouncement(post)}
                          >
                            <img className="w-6 h-6" src="/assets/AnnounceIcon.svg" alt="Announcement" />
                            Announcement
                          </p>
                        </div>
                      )}
                    </header>

                    {!post.attachments || post.attachments.length === 0 ? (
                      // Render this block if there are no attachments
                      <>
                        <div>{post.content}</div>
                        <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          {post.mentions ? JSON.parse(post.mentions).map(mention => mention.name).join(', ') : ''}
                        </p>
                      </>
                    ) : (
                      // Render this block if there are attachments
                      <>
                        <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          {post.mentions ? JSON.parse(post.mentions).map(mention => mention.name).join(', ') : ''}
                        </p>
                        <div className="relative flex flex-wrap gap-2 mt-4">
                          {post.attachments.map((attachment, idx) => (
                            <div key={idx} className="relative w-full">
                              <img
                                src={`/storage/${attachment.path}`}
                                alt={`Attachment ${idx + 1}`}
                                className="rounded-xl w-full h-auto object-cover"
                                style={{ maxHeight: '300px' }} // Allowing the image to take up more vertical space
                              />
                              {idx === Math.floor(post.attachments.length / 2) && (
                                <div className="absolute inset-0 flex justify-center items-center p-4">
                                  <span
                                    className="text-5xl font-black text-center text-white text-opacity-90 bg-black bg-opacity-50 rounded-lg"
                                    style={{ maxWidth: '90%', overflowWrap: 'break-word', wordWrap: 'break-word' }}
                                  >
                                    {post.content}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        {isPostLikedByUser(post) ? (
                          <img
                            src="/assets/Like.svg"
                            alt="Unlike"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleUnlike(post.id)}
                          />
                        ) : (
                          <img
                            src="/assets/likeforposting.svg"
                            alt="Like"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => handleLike(post.id)}
                          />
                        )}
                        {likesCount > 0 && <span className="text-sm font-medium">{likesCount}</span>}
                      </div>
                      <img src="/assets/commentforposting.svg" alt="Comment" className="w-6 h-6 cursor-pointer" onClick={() => openCommentPopup(post)} />
                    </div>
                  </article>
                )} */}


              {/* Main Post Content */}
              {post.type !== 'birthday' && (
                <article className={`
                  ${post.type === 'announcement' ? '-mt-16' : 'mt-10'}
                  ${variant === 'department' ? 'w-full lg:w-[610px] md:w-[610px] sm:w-[610px]' : 'w-full lg:w-full md:w-[610px] sm:w-[610px]'}
                  p-4 border rounded-2xl bg-white border-2 shadow-xl relative z-5
                `}>
                  <header className="flex px-px w-full max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-1 mt-2"></div>
                    <div className="flex flex-col justify-between items-start px-1 w-full mb-4 p-2 -ml-2 -mt-3">
                      <div className="flex w-full items-center justify-between h-auto mb-4">
                      {/* {post.type !== 'announcement' && post.type !== 'post' ( */}
                      {(post.type !== 'announcement' && post.type !== 'post') && (
                        <span className="text-sm font-semibold text-neutral-600 bg-gray-200 rounded-lg px-2 py-1">
                          {post.accessibilities?.map((accessibility, index) => (
                            <span key={index}>{accessibility.accessable_type}{": "}</span>
                          ))}
                            {post.departmentNames ? post.departmentNames : post.type}
                        </span>
                      )}
                      </div>
                      <div className="flex gap-5 justify-between items-center w-full max-md:flex-wrap max-md:max-w-full">
                      <div className="flex gap-1.5 items-center">
                        <img
                          loading="lazy"
                          src={
                            post.userProfile.profile?.image
                                ? (
                                    post.userProfile.profile.image === '/assets/dummyStaffPlaceHolder.jpg'
                                        ? post.userProfile.profile.image
                                        : post.userProfile.profile.image.startsWith('avatar/')
                                            ? `/storage/${post.userProfile.profile.image}`
                                            : `/avatar/${post.userProfile.profile.image}`
                                )
                                : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`
                          }
                          alt={post.user.name}
                          className="shrink-0 aspect-square w-[53px] rounded-image"
                        />
                        <div className="flex flex-col ml-1">
                          <div className="text-base max-md:text-sm font-semibold text-neutral-800">{post.user.name}</div>
                          <time className="mt-1 text-xs text-neutral-800 text-opacity-50">{formatTimeAgo(post.created_at)}</time>
                        </div>
                      </div>
                      <img
                        loading="lazy"
                        src="/assets/wallpost-dotbutton.svg"
                        alt="Options"
                        className="shrink-0 aspect-[1.23] w-6 cursor-pointer mt-1 max-md:mt-0"
                        onClick={() => togglePopup(index)}
                      />
                    </div>

                    </div>
                      {isPopupOpen[index] && (
                        <div className="absolute bg-white border-2 rounded-xl p-1 shadow-custom mt-16 right-0 w-[180px] h-auto z-10">
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleEdit(post)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/EditIcon.svg" alt="Edit" />
                            Edit
                          </p>
                          <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/DeleteIcon.svg" alt="Delete" />
                            Delete
                          </p>
                          <div className="font-extrabold text-neutral-800 my-1 border-b-2 border-neutral-200"></div>
                          <p
                            className="cursor-pointer flex flex-row hover:bg-primary-100 rounded-xl p-2"
                            onClick={() => handleAnnouncement(post)}
                          >
                            <img className="w-6 h-6 mr-2" src="/assets/AnnounceIcon.svg" alt="Announcement" />
                            Announcement
                          </p>
                        </div>
                      )}
                    </header>
                    {/* <div className="post-content break-words overflow-hidden" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </div> */}
                      <article className="post-content">
                        {renderContentWithTags(post.content, post.mentions)}
                      </article>

                    <p className=" mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                      {/* {post.tag.replace(/[\[\]"]/, '')} */}
                      <div className='taging'>{post.tag?.replace(/[\[\]"]/g, '') || ''}</div>
                    </p>


                  {/* {post.mentions?.length > 0 && (
                      <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                          Tagged People: {JSON.parse(post.mentions).map(person => person.name).join(', ')}
                      </p>
                  )} */}

                  <p className="mt-3.5 text-xs font-semibold leading-6 text-blue-500 max-md:max-w-full">
                  {post.event?.replace(/[\[\]"]/g, '') || ''}
                  </p>
                  <PostAttachments attachments={post.attachments} />
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      {isPostLikedByUser(post) ? (
                        <img
                          src="/assets/Like.svg"
                          alt="Unlike"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleUnlike(post.id)}
                        />
                      ) : (
                        <img
                          src="/assets/likeforposting.svg"
                          alt="Like"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleLike(post.id)}
                        />
                      )}
                      {/* {likesCount > 0 && <span className="text-sm font-medium">{likesCount}</span>} */}
                      {likesCount > 0 && (
                        <span
                          className="text-sm font-medium cursor-pointer"
                          onClick={() => handleLikesClick(post.id)}
                        >
                          {likesCount}
                        </span>
                      )}
                    </div>
                    <img src="/assets/commentforposting.svg" alt="Comment" className="w-6 h-6 cursor-pointer" onClick={() => openCommentPopup(post)} />
                    {commentsCount > 0 && (
                    <span className="text-sm font-medium">
                      {commentsCount}
                    </span>
                  )}
                  </div>
                </article>
              )}
            </div>
          )
        })
      }
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white py-6 px-4 max-h-screen min-h-[auto] lg:my-8 rounded-2xl shadow-lg w-[500px] max-md:w-[300px]">
            <EditPost post={currentEditPost} loggedInUserId={loggedInUserId} onClose={() => setIsEditModalOpen(false)} onClosePopup={() => setIsPopupOpen(false)} refetchPost={fetchData} />
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 10000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '200px',
            maxWidth:'full',
            }}
        >
            <div style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: 'larger', borderRadius: '24px',}}>
                <h2>Delete Post?</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button
                    onClick={handleDelete}
                    style={{
                        backgroundColor: '#E53935',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        width: '80px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginRight: '10px',
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => setShowDeletePopup(false)}
                    style={{
                        backgroundColor: 'white',
                        color: '#333',
                        border: '1px solid #ccc',
                        borderRadius: '25px',
                        width: '80px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                    }}
                >
                    No
                </button>
            </div>
        </div>
      )}
{showLikesPopup && (
  <LikesPopup
    likedUsers={likedUsers}
    onClose={() => setShowLikesPopup(false)}
    commentId={selectedPostId}
  />
)}
      {isCommentPopupOpen && selectedPost && (
        <Comment post={selectedPost} onClose={() => setIsCommentPopupOpen(false)} loggedInUserId={loggedInUserId}
          PostLikesCount={selectedPost.likes?.lenght || 0} />
      )}
    </>
  );
}

export default OutputData;
