import React from "react";

import "./css/PageTitle.css";

const PageTitle = ({ title }) => {
    return (
        <div className="page-title-container">
            <h1 className="page-title">{title}</h1>
        </div>
    );
};

export default PageTitle;
