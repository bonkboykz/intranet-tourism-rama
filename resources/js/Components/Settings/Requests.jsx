import { React, useState } from 'react';
import moment from 'moment';
import aishaImage from '../../../../public/assets/aishaImage.png';
import benImage from '../../../../public/assets/benImage.png';
import thomasImage from '../../../../public/assets/thomasImage.png';
import community1 from  '../../../../public/assets/community1.png';
import community2 from '../../../../public/assets/community2.png';
import community3 from '../../../../public/assets/community3.png';
import changeImage1 from '../../../../public/assets/lambo5.jpeg';
import changeImage2 from '../../../../public/assets/lambo2.jpeg';

// Sample data for demonstration purposes
const groupJoinData = [
  { name: 'Aisha Binti', department: 'Department', time: '2024-06-20T04:00:00Z', group: "Malaysia's spots", followers: '12,543 followers', profileImage: aishaImage, groupImage: community2 },
  { name: 'Thomas', department: 'Department', time: '2024-06-17T12:00:00Z', group: 'Around KL', followers: '13,983 followers', profileImage: thomasImage, groupImage: community3 },
  { name: 'Ben', department: 'Department', time: '2024-06-15T12:00:00Z', group: 'Where to Go', followers: '14,567 followers', profileImage: benImage, groupImage: community1 },
  { name: 'Thomas', department: 'Department', time: '2024-06-14T12:00:00Z', group: "Malaysia's spots", followers: '12,543 followers', profileImage: thomasImage, groupImage: community2 },
  { name: 'Aisha Binti', department: 'Department', time: '2024-06-10T12:00:00Z', group: 'Where to Go', followers: '14,567 followers', profileImage: aishaImage, groupImage: community1 }
];

const communityCreationData = [
  { name: 'Thomas', department: 'Department', time: '2024-06-20T02:00:00Z', group: "Malaysia's spots", followers: '12,543 followers', profileImage: thomasImage, groupImage: community1},
  { name: 'Aisha Binti', department: 'Department', time: '2024-06-19T04:00:00Z', group: 'Where to Go', followers: '14,567 followers', profileImage: aishaImage, groupImage: community1}
];

const orgChartPhotoChangeData = [
  { name: 'Thomas', department: 'Department', time: '2024-06-20T02:00:00Z', currentImage: thomasImage, changeImage: changeImage1 },
  { name: 'Aisha Binti', department: 'Department', time: '2024-06-19T04:00:00Z', currentImage: aishaImage, changeImage: changeImage2 }
];

const profileInformationData = [
  { name: 'Thomas', department: 'Department', time: '2024-06-19T04:00:00Z', profileImage: thomasImage, changeType: 'Email', currentValue: 'thomas@tourism.com.my', newValue: 'thomas.thomas@tourism.com.my'},
  { name: 'Aisha Binti', department: 'Department', time: '2024-06-10T12:00:00Z', profileImage: aishaImage, changeType: 'Location', currentValue: 'Tingkat 18', newValue: 'Tingkat 22'}
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

// Reusable Row Components
const GroupJoinRow = ({ name, department, time, group, followers, profileImage, groupImage }) => (
  <div className="flex items-center justify-between py-4 border-t border-gray-200">
    <div className="flex items-center w-1/4">
      <img className="w-10 h-10 rounded-full" src={profileImage} alt="User profile" />
      <div className="ml-3">
        <p className="text-sm font-bold text-black">{name} ({department})</p>
        <p className="text-xs font-semibold text-black">{formatTime(time)}</p>
      </div>
    </div>
    <p className="w-1/4 text-xs font-semibold text-center text-black">to join</p>
    <div className="flex items-center w-1/4">
      <img className="w-10 h-10 rounded-full" src={groupImage} alt="Group" />
      <div className="ml-3">
        <p className="text-sm font-bold text-black">{group}</p>
        <p className="text-xs text-gray-400">{followers}</p>
      </div>
    </div>
    <div className="flex justify-end w-1/4">
      <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">Approve</button>
      <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">Reject</button>
    </div>
  </div>
);

const CommunityCreationRow = ({ name, department, time, group, followers, profileImage, groupImage }) => (
  <div className="flex items-center justify-between py-4 border-t border-gray-200">
    <div className="flex items-center w-1/4">
      <img className="w-10 h-10 rounded-full" src={profileImage} alt="User profile" />
      <div className="ml-3">
        <p className="text-sm font-bold text-black">{name} ({department})</p>
        <p className="text-xs font-semibold text-black">{formatTime(time)}</p>
      </div>
    </div>
    <p className="w-1/4 text-xs font-semibold text-center text-black">wants to create</p>
    <div className="flex items-center w-1/4">
      <img className="w-10 h-10 rounded-full" src={groupImage} alt="Group" />
      <div className="ml-3">
        <p className="text-sm font-bold text-black">{group}</p>
        <p className="text-xs text-gray-400">{followers}</p>
      </div>
    </div>
    <div className="flex justify-end w-1/4">
      <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">Approve</button>
      <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">Reject</button>
    </div>
  </div>
);

const OrgChartPhotoChangeRow = ({ name, department, time, currentImage, changeImage }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-between py-4 border-t border-gray-200">
        <div className="flex items-center w-1/4">
          <img className="w-10 h-10 rounded-full" src={currentImage} alt="User profile" />
          <div className="ml-3">
            <p className="text-sm font-bold text-black">{name} ({department})</p>
            <p className="text-xs font-semibold text-black">{formatTime(time)}</p>
          </div>
        </div>
        <p className="w-1/4 text-xs font-semibold text-center text-black">change to</p>
        <div className="flex items-center w-1/4">
          <img
            className="w-10 h-10 rounded-full cursor-pointer"
            src={changeImage}
            alt="Change"
            onClick={() => setIsPopupVisible(true)}
          />
        </div>
        <div className="flex justify-end w-1/4">
          <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">Approve</button>
          <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">Reject</button>
        </div>
      </div>

      {isPopupVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 bg-grey-100 backdrop-blur-sm"
          onClick={() => setIsPopupVisible(false)}
        >
          <div
            className="relative p-4 bg-white rounded-lg shadow-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <img className="object-cover rounded-lg w-96 h-96" src={changeImage} alt="Change" />
          </div>
        </div>
      )}
    </>
  );
};

const ProfileInformationRow = ({ name, department, time, profileImage, changeType, currentValue, newValue }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-between py-4 border-t border-gray-200">
        <div className="flex items-center w-1/4">
          <img className="w-10 h-10 rounded-full" src={profileImage} alt="User profile" />
          <div className="ml-3">
            <p className="text-sm font-bold text-black">{name} ({department})</p>
            <p className="text-xs font-semibold text-black">{formatTime(time)}</p>
          </div>
        </div>
        <p className="w-1/4 text-xs font-semibold text-center text-black">change of</p>
        <div className="flex items-center w-1/4">
          <p className="font-medium text-blue-500 cursor-pointer" onClick={() => setIsPopupVisible(true)}>
            {changeType}
          </p>
        </div>
        <div className="flex justify-end w-1/4">
          <button className="px-4 py-1 text-sm font-bold text-white bg-blue-500 rounded-full">Approve</button>
          <button className="px-4 py-1 ml-2 text-sm font-bold text-white bg-[#FF5436] rounded-full">Reject</button>
        </div>
      </div>

      {isPopupVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsPopupVisible(false)}
        >
          <div
            className="relative p-8 bg-white shadow-custom rounded-xl w-120"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="mb-4 text-lg font-bold">{name} wants to change</h2>
              <hr className="border-t border-gray-300" style={{ borderColor: '#E4E4E4', width: '100%' }} />
              <p className="mt-4 mb-2 text-xl font-bold text-left">{changeType}: {currentValue}</p>
              <p className="mb-4 text-xl font-bold text-left">To: <a className="text-xl font-bold text-blue-500">{newValue}</a></p>
              <button className="px-4 py-2 text-white bg-blue-500 rounded-full" onClick={() => setIsPopupVisible(false)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main Component
const Requests = () => (
  <div>
    <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
      <h2 className="mb-4 text-2xl font-bold text-blue-500">Group Join</h2>
      {groupJoinData.map((data, index) => (
        <GroupJoinRow key={index} {...data} />
      ))}
    </section>
    <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
      <h2 className="mb-4 text-2xl font-bold text-blue-500">Community Creation</h2>
      {communityCreationData.map((data, index) => (
        <CommunityCreationRow key={index} {...data} />
      ))}
    </section>
    <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px] mb-5">
      <h2 className="mb-4 text-2xl font-bold text-blue-500">Organisational Chart Photo Change</h2>
      {orgChartPhotoChangeData.map((data, index) => (
        <OrgChartPhotoChangeRow key={index} {...data} />
      ))}
    </section>
    <section className="flex flex-col px-5 py-4 bg-white rounded-2xl shadow-custom max-w-[900px]">
      <h2 className="mb-4 text-2xl font-bold text-blue-500">Profile Information</h2>
      {profileInformationData.map((data, index) => (
        <ProfileInformationRow key={index} {...data} />
      ))}
    </section>
  </div>
);

export default Requests;
