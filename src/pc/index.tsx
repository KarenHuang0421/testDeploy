import { useEffect, Suspense, lazy, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import "./index.scss";
import { useAppSelector, useAppDispatch } from "../common/store";
import FullscreenSpinner from "../common/components/fullscreen-spinner";
import Header from "./components/header";
import Notification from "../common/components/notification";
import AuthModal from "../common/components/auth-modal";
import PrivateRoute from "../common/components/private-route";
import LegalNotice from "../common/components/legal-notice";
import PopUp from "../common/components/pop-up";
import { popUpActions } from "../common/store/slices/pop-up-slice";
const Home = lazy(() => import("./pages/home"));
const Events = lazy(() => import("./pages/events"));
const Contact = lazy(() => import("./pages/contact"));
const Terms = lazy(() => import("./pages/terms"));
const Following = lazy(() => import("./pages/following"));
const Profile = lazy(() => import("./pages/profile"));
const Video = lazy(() => import("./pages/video"));
const Upload = lazy(() => import("./pages/upload"));
const EditProfile = lazy(() => import("./pages/edit-profile"));
const Search = lazy(() => import("./pages/search"));

export default function PCLayout() {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const { notification, authModal, popUp } = useAppSelector(state => state);
	const [showNotice, setShowNotice] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		let hasSeenNotice = localStorage.getItem("hasSeenNotice");
		if (hasSeenNotice) return;
		setShowNotice(true);
		localStorage.setItem("hasSeenNotice", "true");
	}, []);

	function handleShowModal (){
		dispatch(popUpActions.hideModal())
	}

	return (
		<main className="page-container">
			<Header />
			{/* {showNotice && <LegalNotice setShowNotice={setShowNotice} />} */}
			{authModal.show && <AuthModal />}
			{popUp.show && <PopUp className={`pop-up-${popUp.type}`} type={popUp.type} handleModalClose={handleShowModal} />}
			{}
			{/* {notification.show && (
				<Notification
					message={notification.message!}
					type={notification.type!}
				/>
			)} */}
			<Suspense fallback={<FullscreenSpinner />}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/events" element={<Events />} />
					<Route path="/following" element={<Following />} />
					<Route path="/terms/:type" element={<Terms />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/user/:username" element={<Profile />} />
					<Route path="/video/:videoId" element={<Video />} />
					<Route path="/search" element={<Search />} />
					<Route path="/profile" element={<Navigate to="/" />} />
					<Route path="/notifications" element={<Navigate to="/" />} />
					<Route element={<PrivateRoute />}>
						<Route path="/upload" element={<Upload />} />
						<Route path="/edit-profile" element={<EditProfile />} />
					</Route>
				</Routes>
			</Suspense>
			<div id="portal" />
		</main>
	);
}
