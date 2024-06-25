import React, { useState } from 'react';
import moment from 'moment';
import blueCheckmarkIcon from '../../../../public/assets/blueCheckmarkIcon.svg';
import aishaImage from '../../../../public/assets/aishaImage.png';
import benImage from '../../../../public/assets/benImage.png';
import thomasImage from '../../../../public/assets/thomasImage.png';


// Sample feedback data 
const feedbackData = [
  { id: 1, name: 'Aisha Binti', department: 'Department', time: '2024-06-24T04:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla cursus turpis in imperdiet volutpat. Donec id leo orci. Donec et elit eleifend, tempor lacus et, placerat dui. Donec euismod odio eu nisl vulputate lobortis. ', profileImage: aishaImage, read: false },
  { id: 2, name: 'Thomas', department: 'Department', time: '2024-06-23T01:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: false },
  { id: 3, name: 'Ben', department: 'Department', time: '2024-06-19T04:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: benImage, read: false },
  { id: 4, name: 'Thomas', department: 'Department', time: '2024-06-18T12:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: true },
  { id: 5, name: 'Aisha Binti', department: 'Department', time: '2024-06-17T08:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: aishaImage, read: true },
  { id: 6, name: 'Thomas', department: 'Department', time: '2024-06-16T06:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: false },
  { id: 7, name: 'Ben', department: 'Department', time: '2024-06-15T12:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: benImage, read: true },
  { id: 8, name: 'Thomas', department: 'Department', time: '2024-06-14T12:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: false },
  { id: 9, name: 'Aisha Binti', department: 'Department', time: '2024-06-13T12:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: aishaImage, read: false },
  { id: 10, name: 'Thomas', department: 'Department', time: '2024-06-12T11:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: true },
  { id: 11, name: 'Ben', department: 'Department', time: '2024-06-11T10:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: benImage, read: false },
  { id: 12, name: 'Aisha Binti', department: 'Department', time: '2024-06-10T09:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: aishaImage, read: false },
  { id: 13, name: 'Thomas', department: 'Department', time: '2024-06-09T08:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: true },
  { id: 14, name: 'Ben', department: 'Department', time: '2024-06-08T07:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: benImage, read: false },
  { id: 15, name: 'Thomas', department: 'Department', time: '2024-06-07T06:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: false },
  { id: 16, name: 'Aisha Binti', department: 'Department', time: '2024-06-06T05:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: aishaImage, read: true },
  { id: 17, name: 'Thomas', department: 'Department', time: '2024-06-05T04:00:00Z', feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', profileImage: thomasImage, read: false },
];

// Helper function to format time
const formatTime = (time) => {
  const now = moment();
  const date = moment(time);
  const diffInHours = now.diff(date, 'hours');
  const diffInDays = now.diff(date, 'days');

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 2) {
    return '1 hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 2) {
    return '1 day ago';
  } else if (diffInDays < 3) {
    return `${diffInDays} days ago`;
  } else {
    return date.format('DD/MM/YYYY');
  }
};

// Feedback Row Component
const FeedbackRow = ({ feedback, onRead, onDelete }) => {
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Function to handle read feedback and show modal
  const handleRead = () => {
    onRead(feedback.id);
    setIsFeedbackModalVisible(true);
  };

  // Function to handle delete feedback
  const handleDelete = () => {
    onDelete(feedback.id);
    setIsDeleteModalVisible(false);
  };

  const maxLength = 50;
  const truncatedFeedback = feedback.feedback.length > maxLength
    ? `${feedback.feedback.substring(0, maxLength)}...`
    : feedback.feedback;

  return (
    <>
      <div className="flex items-center justify-between py-4 border-t border-gray-200 cursor-pointer" onClick={handleRead}>
        <div className="flex items-center w-1/4">
          <img className="w-10 h-10 rounded-full" src={feedback.profileImage} alt="User profile" />
          <div className="ml-3">
            <p className="text-sm font-bold text-black">{feedback.name} ({feedback.department})</p>
            <p className="text-xs font-semibold text-black">{formatTime(feedback.time)}</p>
          </div>
        </div>
        <div className="w-1/2 ">
          <p className="pl-20 text-sm font-semibold text-center text-black ">"{truncatedFeedback}"</p>
        </div>
        <div className="flex items-center justify-end w-1/4">
          {!feedback.read && <div className="w-3 h-3 mr-10 bg-red-500 rounded-full"></div>}
          <img
            className="w-6 h-6 mr-3 cursor-pointer"
            src={blueCheckmarkIcon}
            alt="Delete"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalVisible(true);
            }}
          />
        </div>
      </div>

      {isFeedbackModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsFeedbackModalVisible(false)}
        >
          <div
            className="relative p-8 bg-white rounded-lg shadow-lg w-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-2xl font-bold text-center">{feedback.name} ({feedback.department})</h2>
            <hr className="mb-5 border-t border-gray-300" style={{ borderColor: '#E4E4E4', width: '100%' }} />
            <p className="mb-2 text-lg font-medium text-center">{feedback.feedback}</p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-2 mt-5 text-white bg-blue-500 rounded-full" onClick={() => setIsFeedbackModalVisible(false)}>Back</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm "
          onClick={() => setIsDeleteModalVisible(false)}
        >
          <div
            className="relative p-8 bg-white rounded-lg shadow-custom w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center ">
              <h2 className="mb-4 text-lg font-bold">Delete the feedback permanently?</h2>
              <div className="flex justify-center space-x-4">
                <button className="px-8 py-2 text-base font-bold text-white bg-blue-500 border border-blue-500 rounded-full" onClick={handleDelete}>Yes</button>
                <button className="px-8 py-2 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsDeleteModalVisible(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Feedback Component
const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState(feedbackData.sort((a, b) => new Date(b.time) - new Date(a.time)));
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Function to mark feedback as read
  const markAsRead = (id) => {
    setFeedbackList(feedbackList.map(fb => fb.id === id ? { ...fb, read: true } : fb));
  };

  // Function to delete feedback
  const deleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter(fb => fb.id !== id));
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentFeedback = feedbackList.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(feedbackList.length / rowsPerPage);

  return (
    <>
      <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-10">
        <h2 className="mb-4 text-2xl font-bold text-blue-500 cursor-default">Feedback</h2>
        {currentFeedback.map((feedback) => (
          <FeedbackRow key={feedback.id} feedback={feedback} onRead={markAsRead} onDelete={deleteFeedback} />
        ))}
      </section>
      <div className="max-w-[900px]">
        <div className="flex items-center justify-end">
          <button
            className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-l-lg shadow-custom ${currentPage === 1 ? 'opacity-60 cursor-default' : ''}`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            className={`px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5] rounded-r-lg shadow-custom ${currentPage === totalPages ? 'opacity-60 cursor-default' : ''}`}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
