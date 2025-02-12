import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Title */}
            <h2 style={styles.title}>Choose Your Vehicle</h2>

            {/* Buttons */}
            <div style={styles.buttonContainer}>
                <button style={{ ...styles.button, backgroundColor: "#28a745" }} onClick={() => navigate("/rented-cars")}>
                    Rented Cars
                </button>
                <button style={{ ...styles.button, backgroundColor: "#ffc107", color: "black" }} onClick={() => navigate("/usedhome")}>
                    Used Cars
                </button>
            </div>
        </div>
    );
};

// Inline CSS Styles
const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: 'url("https://images.unsplash.com/photo-1605559424849-0adc7c4a053b")',
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "white",
        marginBottom: "20px",
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
    },
    buttonContainer: {
        display: "flex",
        gap: "20px",
    },
    button: {
        padding: "12px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
        color: "white",
    },
};

export default Home;
