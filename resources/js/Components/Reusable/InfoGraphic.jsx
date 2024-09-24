import React from "react";
import { memo } from "react";

function InfoGraphic() {
    return (
        <div className="bg-white rounded-2xl shadow-custom border-2 mt-10 p-6  max-w-[320px] w-full">
            {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            <div className="flex w-full">
                <img
                    src="assets/InfoGraphic.jpeg"
                    alt="InfoGraphic"
                    className="w-full"
                />
            </div>
        </div>
    );
}

export default memo(InfoGraphic);
