import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

// Reusable Row Component
const PermissionRow = ({
    label,
    userState,
    setUserState,
    adminState,
    setAdminState,
}) => (
    <li className="grid grid-cols-12 items-center py-4 px-2">
        <div className="col-span-5 text-left">
            <p className="text-sm font-medium leading-6 text-gray-900">
                {label}
            </p>
        </div>
        <div className="col-span-2 flex justify-center">
            <Switch
                checked={userState}
                onChange={setUserState}
                className={classNames(
                    userState ? "bg-primary" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                )}
            >
                <span
                    aria-hidden="true"
                    className={classNames(
                        userState ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                    )}
                />
            </Switch>
        </div>
        <div className="col-span-2 flex justify-center">
            <Switch
                checked={adminState}
                onChange={setAdminState}
                className={classNames(
                    adminState ? "bg-primary" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                )}
            >
                <span
                    aria-hidden="true"
                    className={classNames(
                        adminState ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                    )}
                />
            </Switch>
        </div>
        <div className="col-span-2 flex justify-center opacity-50">
            <Switch
                checked={true} // Always on
                onChange={() => {}} // No action on change
                className="bg-primary relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
            >
                <span
                    aria-hidden="true"
                    className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow-custom ring-0 transition duration-200 ease-in-out"
                />
            </Switch>
        </div>
    </li>
);

// Separator Component
const ModuleSeparator = ({ title }) => (
    <div className="bg-blue-100 py-2 px-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
);

const Permissions = () => {
    // States for all permission rows
    const [loginUser, setLoginUser] = useState(false);
    const [loginAdmin, setLoginAdmin] = useState(false);

    const [createPostsUser, setCreatePostsUser] = useState(false);
    const [createPostsAdmin, setCreatePostsAdmin] = useState(false);

    const [adminViewUser, setAdminViewUser] = useState(false);
    const [adminViewAdmin, setAdminViewAdmin] = useState(false);

    const [postTypeUser, setPostTypeUser] = useState(false);
    const [postTypeAdmin, setPostTypeAdmin] = useState(false);

    const [editPostUser, setEditPostUser] = useState(false);
    const [editPostAdmin, setEditPostAdmin] = useState(false);

    const [filterPostUser, setFilterPostUser] = useState(false);
    const [filterPostAdmin, setFilterPostAdmin] = useState(false);

    const [postAnnoucementUser, setPostAnnoucementUser] = useState(false);
    const [postAnnoucementAdmin, setPostAnnoucementAdmin] = useState(false);

    const [anotherPostAnnoucementUser, setAnotherPostAnnoucementUser] =
        useState(false);
    const [anotherPostAnnoucementAdmin, setAnotherPostAnnoucementAdmin] =
        useState(false);

    const [deleteOwnPostUser, setDeleteOwnPostUser] = useState(false);
    const [deleteOwnPostAdmin, setDeleteOwnPostAdmin] = useState(false);

    const [deleteAnotherPostUser, setDeleteAnotherPostUser] = useState(false);
    const [deleteAnotherPostAdmin, setDeleteAnotherPostAdmin] = useState(false);

    const [likeAPostUser, setLikeAPostUser] = useState(false);
    const [likeAPostAdmin, setLikeAPostAdmin] = useState(false);

    // List of permissions
    const permissions = [
        {
            label: "Single Sign-On (SSO) login",
            userState: loginUser,
            setUserState: setLoginUser,
            adminState: loginAdmin,
            setAdminState: setLoginAdmin,
        },
        {
            label: "Create post (Upload Media & Add Tag)",
            userState: createPostsUser,
            setUserState: setCreatePostsUser,
            adminState: createPostsAdmin,
            setAdminState: setCreatePostsAdmin,
        },
        {
            label: "View the name of Admin who create the post",
            userState: adminViewUser,
            setUserState: setAdminViewUser,
            adminState: adminViewAdmin,
            setAdminState: setAdminViewAdmin,
        },
        {
            label: "Post as a different type of user",
            userState: postTypeUser,
            setUserState: setPostTypeUser,
            adminState: postTypeAdmin,
            setAdminState: setPostTypeAdmin,
        },
        {
            label: "Edit post",
            userState: editPostUser,
            setUserState: setEditPostUser,
            adminState: editPostAdmin,
            setAdminState: setEditPostAdmin,
        },
        {
            label: "Filter post",
            userState: filterPostUser,
            setUserState: setFilterPostUser,
            adminState: filterPostAdmin,
            setAdminState: setFilterPostAdmin,
        },
        {
            label: "Set/unset a post as an announcement",
            userState: postAnnoucementUser,
            setUserState: setPostAnnoucementUser,
            adminState: postAnnoucementAdmin,
            setAdminState: setPostAnnoucementAdmin,
        },
        {
            label: "Set/unset another user's post as an announcement",
            userState: anotherPostAnnoucementUser,
            setUserState: setAnotherPostAnnoucementUser,
            adminState: anotherPostAnnoucementAdmin,
            setAdminState: setAnotherPostAnnoucementAdmin,
        },
        {
            label: "Delete own post",
            userState: deleteOwnPostUser,
            setUserState: setDeleteOwnPostUser,
            adminState: deleteOwnPostAdmin,
            setAdminState: setDeleteOwnPostAdmin,
        },
        {
            label: "Delete another user's post",
            userState: deleteAnotherPostUser,
            setUserState: setDeleteAnotherPostUser,
            adminState: deleteAnotherPostAdmin,
            setAdminState: deleteAnotherPostAdmin,
        },
        {
            label: "Like a post",
            userState: likeAPostUser,
            setUserState: setLikeAPostUser,
            adminState: likeAPostAdmin,
            setAdminState: setLikeAPostAdmin,
        },
    ];

    return (
        <div className="">
            <div className="container ml-8 mx-auto mt-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Permissions
                </h1>
                <p className="text-gray-600 mb-6">
                    Manage permissions for each role.
                </p>
            </div>
            <section className="flex flex-col px-8 py-4 bg-white rounded-lg shadow-custom full-width ml-8 mr-8 mb-0 ">
                <div className="grid grid-cols-12 text-center mt-4">
                    <div className="col-span-5 lg:text-2xl font-bold text-primary sm:text-md md:text-md">
                        Actions
                    </div>
                    <div className="col-span-2 lg:text-2xl font-bold text-primary sm:text-md md:text-md">
                        User
                    </div>
                    <div className="col-span-2 lg:text-2xl font-bold text-primary sm:text-md md:text-md">
                        Admin
                    </div>
                    <div className="col-span-3 lg:text-2xl font-bold text-primary opacity-50 sm:text-md md:text-md">
                        Jomla! Admin
                    </div>
                </div>
                <div className="mt-2 border-t border-gray-200"></div>
                <div className="w-full">
                    <ModuleSeparator title="Login" />
                    <ul role="list" className="divide-y divide-gray-200">
                        {permissions.slice(0, 1).map((permission) => (
                            <PermissionRow
                                key={permission.label}
                                {...permission}
                            />
                        ))}
                    </ul>
                    <ModuleSeparator title="Wall Posting" />
                    <ul role="list" className="divide-y divide-gray-200">
                        {permissions.slice(1).map((permission) => (
                            <PermissionRow
                                key={permission.label}
                                {...permission}
                            />
                        ))}
                    </ul>
                </div>
                <div className="w-full border-t border-gray-200"></div>
            </section>
        </div>
    );
};

export default Permissions;
