export function DeletePopup({ onClose, onDelete }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
                zIndex: 10000,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "200px",
                maxWidth: "full",
            }}
        >
            <div
                style={{
                    marginBottom: "20px",
                    fontWeight: "bold",
                    fontSize: "larger",
                    borderRadius: "24px",
                }}
            >
                <h2>Delete Post?</h2>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <button
                    onClick={() => onDelete()}
                    style={{
                        backgroundColor: "#E53935",
                        color: "white",
                        border: "none",
                        borderRadius: "25px",
                        width: "80px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "white",
                        color: "#333",
                        border: "1px solid #ccc",
                        borderRadius: "25px",
                        width: "80px",
                        padding: "10px 20px",
                        cursor: "pointer",
                    }}
                >
                    No
                </button>
            </div>
        </div>
    );
}
