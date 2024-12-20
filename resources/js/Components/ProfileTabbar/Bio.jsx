import React, { useState, useEffect, useRef } from 'react';

function ProfileBio({
    formData,
    isEditing,
    onFormDataChange,
    onPhotoChange,
    originalFormData,
    onEditBio,
    onCancelBio,
    onSaveBio,
    userId
}) {
    const [bioFormData, setBioFormData] = useState(formData || {});
    const [isPhotoChangeNotificationOpen, setIsPhotoChangeNotificationOpen] = useState(false); // State for photo change notification popup
    const formRef = useRef(null);

    useEffect(() => {
        if (!isEditing) {
            setBioFormData(formData || {}); // Ensure bioFormData is always an object
        }
    }, [formData, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBioFormData((prevData) => ({
            ...prevData,
            [name]: value, // Directly update the bioFormData
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBioFormData((prevData) => ({
                ...prevData,
                photo: reader.result, // Update the photo in bioFormData
            }));
            onPhotoChange(reader.result); // Pass the updated photo back to the parent component
            setIsPhotoChangeNotificationOpen(true); // Show the photo change notification popup
        };
        if (file) {
            reader.readAsDataURL(file); // Read the file and trigger the onloadend event
        }
    };

    const handleCloseNotification = () => {
        setIsPhotoChangeNotificationOpen(false);
    };

    const renderField = (label, name, value, type) => (
        <tr key={name}>
            <td className="py-2 align-center font-semibold capitalize text-neutral-800 w-1/3">{label}</td>
            <td className="py-2 align-center w-2/3 ">
                {isEditing ? (
                    <input
                        type={type}
                        name={name}
                        value={value !== undefined && value !== null ? value : ""}
                        onChange={handleInputChange}
                        className="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full   max-w-[150px] mr-12 md:max-w-full lg:max-w-full rounded-full border-2 px-2 border-stone-300"
                        placeholder={label}
                    />
                ) : (
                    <div className="text-sm mt-1 block w-full rounded-md border-2 border-transparent text-neutral-800 text-opacity-80">
                        {value !== undefined && value !== null && value !== "" ? value : ""}
                    </div>
                )}
            </td>
        </tr>
    );

    let source = null;

    if (bioFormData.photo) {
        if (bioFormData.photo.startsWith('staff_image/')) {
            source = `/storage/${bioFormData.photo}`;
        } else {
            source = bioFormData.photo === '/assets/dummyStaffPlaceHolder.jpg'
                ? bioFormData.photo
                : bioFormData.photo.startsWith('data:image')
                ? bioFormData.photo
                : `/avatar/${bioFormData.photo}`;
        }
    } else {
        // If the photo is null, use the generated avatar from ui-avatars.com
        const name = bioFormData.name || 'Staff'; // Use 'Staff' as a fallback if name is not available
        source = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(name)}`;
    }

    return (
        <div ref={formRef} className="flex-auto my-auto p-4">
            <div className="flex gap-5 sm:flex-col md:flex-col lg:flex-col sm:gap-4 lg:gap-6">
                <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
                    <table className="table-auto w-full text-left border-collapse ">
                        <tbody>
                            <tr>
                                <td className="py-2 align-center w-1/3">
                                    <div className="text-base text-neutral-800 font-semibold">
                                        Staff’s photo
                                        <button
                                            className="ml-2 inline-block justify-center items-center w-3.5 h-3.5 text-xs text-center text-white whitespace-nowrap rounded-full bg-zinc-300"
                                            role="tooltip"
                                            tabIndex="0"
                                        >
                                            ?
                                        </button>
                                    </div>
                                    <div className="text-xs text-blue-500">Image Ratio 3:4</div>
                                </td>
                                <td className="py-2 align-start w-2/3 ">
                                    <div className="flex items-center gap-4 w-20 flex-wrap">
                                        <img
                                            loading="lazy"
                                            src={source}
                                            className="aspect-square rounded-md sm:w-[90px] sm:h-[120px] md:w-[90px] md:h-[120px] lg:w-[90px] lg:h-[120px]  object-cover flex-wrap"
                                            alt="Staff's photo"
                                        />
                                        {isEditing && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className=" text-xs w-25 justify-start"
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {renderField('Name', 'name', bioFormData.name, 'text')}
                            {renderField('E-mail', 'email', bioFormData.email, 'email')}
                            {renderField('Date of Birth', 'dateofbirth', bioFormData.dateofbirth, 'date')}
                            {renderField('WhatsApp Number', 'whatsapp', bioFormData.whatsapp !== 'null' ? bioFormData.whatsapp : '', 'text')}

                        </tbody>
                    </table>
                </div>
            </div>
            {isEditing && (
                <div className="flex justify-end mt-4 pb-3 ">
                    <button onClick={() => {
                        setBioFormData(originalFormData); // Reset bioFormData to originalFormData
                        onCancelBio();
                    }} className="bg-white text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white px-4 py-2 rounded-full">Cancel</button>
                    <button onClick={() => onSaveBio({ ...bioFormData, user_id: userId })} className="ml-2 bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-full">Save</button>
                </div>
            )}
            {isPhotoChangeNotificationOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Photo Change Request</h2>
                        <p>The staff’s photo change request has been submitted for review.</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCloseNotification} className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-full">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileBio;
