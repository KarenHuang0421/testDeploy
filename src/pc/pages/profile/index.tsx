import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./profile.scss";
import PageWithSidebar from "../../components/page-with-sidebar";
import VideosLayout from "./VideosLayout";
import FollowButton from "../../components/follow-button";
import ProfileButtons from "../../components/profile-buttons";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { joinClasses } from "../../../common/utils";
import { getLikedVideos, getUser } from "../../../common/api/user";
import { UserData } from "../../../common/types";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import { authModalActions } from "../../../common/store/slices/auth-modal-slice";
import constants from "../../../common/constants";
import LoadingSpinner from "../../../common/components/loading-spinner";
import Thumbnail from "../../components/atoms/thumbnail";
import { demoUsers } from "../../../data.json";
import { ReactComponent as Approve1 } from "../../../assets/approve-1.svg";
import Panel from "../../components/panel";

export default function Profile() {
	const { username } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const loggedInAs = useAppSelector(state => state.auth.username);
	const suggestedAccounts = useAppSelector(state => state.pc.sidebar.suggested);
	const isOwnProfile = useMemo(
		() => (loggedInAs ? username === loggedInAs : false),
		[username, loggedInAs]
	);
	const [user, setUser] = useState<UserData | null>(null);
	const [likedVideos, setLikedVideos] = useState<string[] | null>(null);
	const [videosType, setVideosType] = useState<"uploaded" | "liked">(
		"uploaded"
	);

	const detail = [
		{
			icon: null,
			content: "台北市信義區松高路19號5樓"
		},
		{
			icon: null,
			content: "店家平均消費＄2001元以上"
		}
	];

	const fetchData = useCallback(async () => {
		// try {
		// 	const res = await getUser(username!, loggedInAs);
		// 	setUser(res.data);
		// } catch (err: any) {
		// 	dispatch(
		// 		notificationActions.showNotification({
		// 			type: "error",
		// 			message: err.message
		// 		})
		// 	);
		// 	navigate("/", { replace: true });
		// }
		setUser(demoUsers[0]);
	}, [username, navigate, dispatch, loggedInAs]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setVideosType("uploaded");
		setLikedVideos(null);
	}, [username]);

	const fetchLikedVids = useCallback(async () => {
		try {
			const liked = await getLikedVideos(username!);
			setLikedVideos(liked.data.videos);
		} catch (err: any) {
			dispatch(
				notificationActions.showNotification({
					type: "error",
					message: err.message
				})
			);
			setVideosType("uploaded");
		}
	}, [username, dispatch]);

	function handleShowModal() {
		dispatch(authModalActions.showModal());
	}

	return (
		<PageWithSidebar className="profile-page-container">
			<div className="profile-container">
				{!user ? (
					<LoadingSpinner className="spinner" />
				) : (
					<>
						<div className="profile-banner" />
						<div className="d-row" style={{ gap: "1rem" }}>
							<div className="d-col flex-1">
								<header className="profile-header">
									<div className="rounded-photo" style={{ marginTop: -60 }}>
										{/* <img
									src={constants.pfpLink + "/" + user!.username}
									alt={user.name}
								/> */}
										<Thumbnail size={160} />
									</div>
									<div className="names">
										<h1 className="break-word">
											{user.username}{" "}
											<Approve1 style={{ width: "24px", height: "24px" }} />
										</h1>
										<h4 className="break-word">{user.name}</h4>
									</div>
								</header>
								<div className="user-details">
									<div className="counts">
										<p>
											<strong>{user.following}</strong> Following
										</p>
										<p>
											<strong>{user.followers}</strong>
											{user.followers === 1 ? "Follower" : "Followers"}
										</p>
										<p>
											<strong>{user.totalLikes}</strong>
											{user.totalLikes === 1 ? "Like" : "Likes"}
										</p>
									</div>
									{!isOwnProfile && (
										<FollowButton
											onClick={fetchData}
											isFollowing={user.isFollowing!}
											toFollow={username!}
											followClassName="primary-button"
											followingClassName="secondary-button"
										/>
									)}
									<button className="thirdary-button" onClick={handleShowModal}>
										編輯個人資料
									</button>
									<p className="break-word description">{user.description}</p>
								</div>
								{/* <button className="primary-button">
									關注
								</button> */}
								<div className="suggested">
									<h5>
										<span>Suggested accounts</span>
									</h5>
									<div className="account-buttons">
										{suggestedAccounts ? (
											suggestedAccounts.slice(0, 3).map((acc, i) => (
												<Link key={i} to={"/user/" + acc.username}>
													<div className="hoverable acc-btn">
														<div className="rounded-photo">
															<img
																src={constants.pfpLink + "/" + acc.username}
																alt={acc.name}
															/>
														</div>
														<h4>{acc.username}</h4>
													</div>
												</Link>
											))
										) : (
											<LoadingSpinner className="spinner" />
										)}
									</div>
								</div>
								<ProfileButtons
									setVideosType={setVideosType}
									fetchLikedVids={fetchLikedVids}
									username={username!}
								/>
								<div
									className={joinClasses(
										"profile-cards-container",
										(videosType === "liked" &&
											(!likedVideos || likedVideos.length === 0)) ||
											(videosType === "uploaded" && user.videos!.length === 0)
											? "ungrid"
											: ""
									)}
								>
									{videosType === "uploaded" ? (
										<VideosLayout videos={user.videos as string[]} />
									) : !likedVideos ? (
										<LoadingSpinner className="liked-spinner" />
									) : (
										<VideosLayout videos={likedVideos as string[]} />
									)}
								</div>
							</div>
							<div className="right-panel">
								<Panel title="店家資訊" subtitle="設定">
									{detail.map(item => (
										<div className="d-row">
											<span>icon</span>
											<span>{item.content}</span>
										</div>
									))}
									<button
										className="primary-button-2"
										style={{ borderRadius: 50 }}
									>
										我要定位
									</button>
								</Panel>
							</div>
						</div>
					</>
				)}
			</div>
		</PageWithSidebar>
	);
}
