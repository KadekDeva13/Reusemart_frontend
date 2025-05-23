import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import TopNavbarNonLogin from "../component/TopNavBarNonLogin";

export default function PublicLayout() {
    return (
        <>
            <div className="position-sticky top-0 z-50 bg-white shadow-sm">
                <TopNavbarNonLogin />
            </div>
            <Container fluid className="pt-4" style={{ paddingTop: "56px" }}>
                <Outlet />
            </Container>
        </>
    );
}
