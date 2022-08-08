import { useState, Suspense, lazy, useEffect } from "react";

import "./profile-card.scss";
import FullscreenSpinner from "../../../common/components/fullscreen-spinner";
import { modifyScrollbar } from "../../../common/utils";
import { VideoData } from "../../../common/types";
import constants from "../../../common/constants";
import demoVideo1 from "../../../assets/demo-video-1.webm";
import demoVideo2 from "../../../assets/demo-video-2.webm";
import { LikeSmBorderIcon, ReplySmBorderIcon, PlaySmBorderIcon } from "../../../assets/logo.js";
const LoadVideoModal = lazy(
	() => import("../../components/video-modal/LoadVideoModal")
);

export default function ProfileCard(props: VideoData) {
	const [showModal, setShowModal] = useState(false);

	function handleModalOpen() {
		modifyScrollbar("hide");
		setShowModal(true);
	}

	return (
		<div className="profile-card">
			{showModal && (
				<Suspense fallback={<FullscreenSpinner />}>
					<LoadVideoModal videoId={props.videoId as string} setShowModal={setShowModal} />
				</Suspense>
			)}

			<div className="video-container">
				{/* <video
					src={constants.videoLink + "/" + videoId + "#t=0.1"}
					playsInline
					muted
					loop
					onMouseOver={e => (e.target as HTMLVideoElement).play()}
					onMouseOut={e => (e.target as HTMLVideoElement).pause()}
					onClick={handleModalOpen}
				>
					Your browser does not support videos.
				</video> */}
				<video
					playsInline
					muted
					loop
					onMouseOver={e => (e.target as HTMLVideoElement).play()}
					onMouseOut={e => (e.target as HTMLVideoElement).pause()}
					onClick={handleModalOpen}
				>
					<source
						src={props.videoId === "1" ? demoVideo1 : demoVideo2}
						type="video/webm"
					></source>
					Your browser does not support videos.
				</video>
				<div className="profile-card-video-tool d-row center">
					<PlaySmBorderIcon fill="white" />
					<span>142.2k</span>
					<LikeSmBorderIcon fill="white" />
					<span>3k</span>
					<ReplySmBorderIcon fill="white" />
					<span>298</span>
				</div>
			</div>
			<span>{props.caption}</span>
		</div>
	);
}
