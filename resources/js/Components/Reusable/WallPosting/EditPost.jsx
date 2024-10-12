import React, { useState, useEffect } from 'react';
import { useCsrf } from "@/composables";

function EditPost({ post, onClose, loggedInUserId, onClosePopup, refetchPost }) {

  console.log("POST", post);

  const [content, setContent] = useState(post.content || '');
  const [attachments, setAttachments] = useState(post.attachments || []);
  const [tags, setTags] = useState(post.tags || []);
  const csrfToken = useCsrf();

  useEffect(() => {
    setContent(post.content || '');
    setTags(post.tags || []);
    setAttachments(post.attachments || []);
  }, [post]);

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleDeleteAttachment = (index) => {
    setAttachments(prevAttachments => prevAttachments.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append("user_id", loggedInUserId);
      formData.append("type", "post");
      formData.append("visibility", "public");

      // Check if content is not empty or just whitespace before adding to FormData
      if (content.trim()) {
        formData.append('content', content);
      }

      formData.append('tag', JSON.stringify(tags));

      attachments.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`attachments[${index}]`, file);
        } else {
          formData.append(`attachments[${index}]`, file);
        }
      });

      const response = await fetch(`/api/posts/posts/${post.id}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json', 'X-CSRF-Token': csrfToken },
      });
      onClose();
      onClosePopup();
      refetchPost();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full max-md:w-full mb-4">
        <h2 className="font-bold text-2xl">Edit Post</h2>
        <button onClick={onClose}>
          <img src="/assets/cancel.svg" alt="Close icon" className="w-6 h-6" />
        </button>
      </div>
      <div className="max-h-[80vh] overflow-y-auto pb-4">
        <header className="flex gap-5 justify-between w-full max-md:flex-wrap max-md:max-w-full">
          <div className="flex gap-1.5">
            <img loading="lazy" src={`/storage/${post.userProfile?.profile.image}` ?? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(post.user.name)}&rounded=true`} alt="Profile image" className="shrink-0 aspect-square w-[53px] rounded-image" />
            <div className="flex flex-col my-auto">
              <div className="text-base font-semibold text-neutral-800">{post.user?.username}</div>
            </div>
          </div>
        </header>
        <form onSubmit={handleFormSubmit} className="mt-4">
          <textarea
            value={content}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="Edit caption" />
          <input type="file" onChange={handleFileChange} className="mt-2" multiple />
          <div className="flex flex-col w-full gap-2 mt-2 items-center">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative attachment w-full">
                {attachment.mime_type && attachment.mime_type.startsWith("image/") ? (
                  <>
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => handleDeleteAttachment(index)}
                    >
                      X
                    </button>
                    <img
                      src={`/storage/${attachment.path}`}
                      alt="attachment"
                      className="w-full h-auto rounded-lg" />
                  </>
                ) : attachment.mime_type && attachment.mime_type.startsWith("video/") ? (
                  <>
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => handleDeleteAttachment(index)}
                    >
                      X
                    </button>
                    <video controls className="grow shrink-0 max-w-full aspect-[1.19] w-full">
                      <source src={`/storage/${attachment.path}`} />
                      Your browser does not support the video tag.
                    </video>
                  </>
                ) : (
                  <div className="flex items-center w-full h-10 bg-gray-100 border-2 border-gray-300 rounded-xl px-2">
                    <a
                      href={`/storage/${attachment.path}`}
                      download
                      className="flex-1 text-sm w-full font-semibold text-start ml-2"
                    >
                      Download {attachment.file_name}
                    </a>
                    <button
                      type="button"
                      className="text-blue-500 px-2"
                      onClick={() => handleDeleteAttachment(index)}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>
      <div className="flex w-full justify-end space-x-2 mt-4">
        <button type="button" onClick={onClose} className="mt-2 px-4 py-2 font-bold hover:bg-gray-400 hover:text-white border-2 border-gray-400 text-gray-400 rounded-full text-sm">
          Cancel
        </button>
        <button type="submit" className="mt-2 px-4 py-2 font-bold hover:bg-primary-700 bg-primary-500 text-white rounded-full text-sm">
          Save
        </button>
      </div>
      </>
  );
}

export default EditPost;
