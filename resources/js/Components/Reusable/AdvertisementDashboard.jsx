import React from 'react';

function AdvertisementDashboard() {
  return (
    <div className="mt-0   max-w-[320px] px-4 bg-white border-2 rounded-2xl shadow-custom" style={{ textAlign: 'center'}}>
      <h2
                    style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        fontFamily: "Nunito Sans",
                        marginTop: "16px",
                        textAlign: "start"
                    }}
                >
                    Advertisement
                </h2>
      <hr className="border border-gray-200 w-full mt-2"></hr>
      {/* <h2>Sponsored Ad</h2>
      <p>Buy the best products at unbeatable prices!</p> */}
      <div className="flex-col w-full flex justify-start py-4 space-y-4">
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          <img src="assets/tm-50.png" alt="Advertisement" style={{ maxWidth: '100%', height: 'auto' }} />
        </a>
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          <img src="assets/mta-small-jomla.png" alt="Advertisement" style={{ maxWidth: '100%', height: 'auto' }} />
        </a>
        {/* <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          <img src="assets/InfoGraphic.jpeg" alt="Advertisement" className="w-full" style={{  height: 'auto' }} />
        </a> */}
      </div>
    </div>
  );
}

export default AdvertisementDashboard;
