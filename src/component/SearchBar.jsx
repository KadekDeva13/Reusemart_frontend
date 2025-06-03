import { useSearchParams, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }) {
    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Deteksi prefix path dari lokasi saat ini
        const isPembeli = location.pathname.startsWith("/user/pembeli");
        const basePath = isPembeli ? "/user/pembeli/search" : "/home/search";

        if (searchTerm.trim()) {
            navigate(`${basePath}?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            className="mx-auto w-100 px-3"
            style={{ maxWidth: "600px", position: "relative" }}
        >
            <Form.Control
                type="search"
                placeholder="Cari di ReuseMart"
                className="ps-5 py-2 rounded-pill border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span
                style={{
                    position: "absolute",
                    left: "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888"
                }}
            >
                🔍
            </span>
        </Form>
    );
}
