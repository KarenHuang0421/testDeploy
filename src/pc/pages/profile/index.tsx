import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./profile.scss";
import VideosLayout from "./VideosLayout";
import PageWithSidebar from "../../components/page-with-sidebar";
import FollowButton from "../../components/follow-button";
import ProfileButtons from "../../components/profile-buttons";
import LoadingSpinner from "../../../common/components/loading-spinner";
import Thumbnail from "../../components/atoms/thumbnail";
import Panel from "../../components/panel";

import constants from "../../../common/constants";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { joinClasses } from "../../../common/utils";
import { getLikedVideos, getUser } from "../../../common/api/user";
import { UserData, VideoData } from "../../../common/types";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import { authModalActions } from "../../../common/store/slices/auth-modal-slice";
import { popUpActions } from "../../../common/store/slices/pop-up-slice";

import { ReactComponent as Approve1 } from "../../../assets/approve-1.svg";
import { ReactComponent as Approve2 } from "../../../assets/approve-2.svg";
import { ReactComponent as MapIcon } from "../../../assets/map.svg";
import { ReactComponent as PriceIcon } from "../../../assets/price.svg";
import { demoMyOwnData, demoVideos, demoUsers } from "../../../data.json";

import { BsLine } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { ImFacebook } from "react-icons/im";
import { IoMdCopy } from "react-icons/io";

const detail = [
	{
		icon: <MapIcon />,
		content: "台北市信義區松高路19號5樓"
	},
	{
		icon: <PriceIcon />,
		content: "店家平均消費＄2001元以上"
	}
];

const socialLink = [
	{
		icon: <ImFacebook color="white" size={20} />,
		iconStyle: { backgroundColor: "#4267B2" },
		label: "Facebook",
		url: "https://www.facebook.com/"
	},
	{
		icon: <FaInstagram size={20} />,
		iconStyle: { backgroundColor: "#FF2473" },
		label: "Instagram",
		url: "https://www.instagram.com/"
	},
	{
		icon: <BsLine color="white" size={20} />,
		iconStyle: { backgroundColor: "#00B900" },
		label: "Line",
		url: "https://linecorp.com/zh-hant/"
	}
];

export default function Profile() {
	const { username } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const loggedInAs = useAppSelector(state => state.auth.username);
	// const suggestedAccounts = useAppSelector(state => state.pc.sidebar.suggested);
	const [links, setLinks] = useState(socialLink);
	const isOwnProfile = useMemo(
		() => (loggedInAs ? username === loggedInAs : false),
		[username, loggedInAs]
	);
	const [user, setUser] = useState<UserData | null>(null);
	// const [likedVideos, setLikedVideos] = useState<string[] | null>(null);
	const [videos, setVideos] = useState<VideoData[] | null>(null);
	const [videosType, setVideosType] = useState<
		"active" | "video" | "collected" | "liked"
	>("active");
	const [screenSize, getDimension] = useState({
		dynamicWidth: window.innerWidth || 0,
		dynamicHeight: window.innerHeight || 0
	});

	const setDimension = () => {
		getDimension({
			dynamicWidth: window.innerWidth,
			dynamicHeight: window.innerHeight
		});
	};

	useEffect(() => {
		setTimeout(() => setVideos(demoVideos), 800);
	}, [videosType]);

	useEffect(() => {
		window.addEventListener("resize", setDimension);

		return () => {
			window.removeEventListener("resize", setDimension);
		};
	}, [screenSize]);

	const fetchData = useCallback(async () => {
		if (username === loggedInAs) setUser(demoMyOwnData);
		else if (username) {
			Object.values(demoUsers).map(item => {
				if (item.username === username) setUser(item);
			});
		}

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
	}, [username, navigate, dispatch, loggedInAs]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setVideosType("active");
		// setLikedVideos(null);
		setVideos(null);
	}, [username]);

	// const fetchLikedVids = useCallback(async () => {
	// 	try {
	// 		const liked = await getLikedVideos(username!);
	// 		setLikedVideos(liked.data.videos);
	// 	} catch (err: any) {
	// 		dispatch(
	// 			notificationActions.showNotification({
	// 				type: "error",
	// 				message: err.message
	// 			})
	// 		);
	// 		setVideosType("active");
	// 	}
	// }, [username, dispatch]);

	function handleShowModal(val: string) {
		dispatch(popUpActions.showModal([val]));
	}

	function openTab(url: string) {
		window.open(url, "_blank");
	}

	function settingStoreData() {
		dispatch(popUpActions.showModal(['edit-store-profile']))
	}

	function copyText() {
		const selection = window.getSelection();
		const range = document.createRange();
		const text = document.getElementById("store-address") as HTMLSpanElement;

		if (text) {
			range.selectNodeContents(text);

			if (selection) {
				selection.removeAllRanges();
				selection.addRange(range);

				document.execCommand("copy");
				selection.removeAllRanges();
			}
		}
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
										<Thumbnail
											size={(160 / 1920) * screenSize.dynamicWidth * 1.35}
										/>
									</div>
									<div className="names flex-1">
										<h1 className="break-word d-row al-center">
											{user.username}
											{user.userType === "public" && (
												<Approve2 className="badge" />
											)}
											{user.userType === "store" && (
												<Approve1 className="badge" style={{padding: '4px'}} />
											)}
											<button className="flex-1">
												<FiUpload className="icon" />
											</button>
										</h1>
										<h4 className="break-word">{user.name}</h4>
									</div>
								</header>
								<div className="user-details">
									<div className="counts">
										<p>
											<strong>{user.followers}</strong> 粉絲
											{/* {user.followers === 1 ? "Follower" : "Followers"} */}
										</p>
										<p>
											<strong>{user.following}</strong> 關注中
										</p>
										<p>
											<strong>{user.totalLikes}</strong> 讚
											{/* {user.totalLikes === 1 ? "Like" : "Likes"} */}
										</p>
									</div>
									{/* {!isOwnProfile && (
										<FollowButton
											onClick={fetchData}
											isFollowing={user.isFollowing!}
											toFollow={username!}
											followClassName="primary-button"
											followingClassName="secondary-button"
										/>
									)} */}
									{
										<div className="d-row button-row">
											{isOwnProfile ? (
												<>
													<button
														className="thirdary-button flex-1"
														onClick={() => handleShowModal("edit-my-profile")}
													>
														編輯個人資料
													</button>
													<button
														className="thirdary-button flex-1"
														onClick={() => handleShowModal("apply")}
													>
														申請為專業帳號
													</button>
												</>
											) : (
												<FollowButton
													onClick={fetchData}
													isFollowing={user.isFollowing!}
													toFollow={username!}
													followClassName="flex-1 thirdary-button"
													followingClassName="flex-1 primary-button-2"
												/>
											)}
										</div>
									}
									<p className="break-word description">{user.description}</p>
								</div>
								{/* <button className="primary-button">
									關注
								</button> */}
								<div className="suggested">
									{/* <h5>
										<span>Suggested accounts</span>
									</h5> */}
									<div className="account-buttons">
										{socialLink ? (
											socialLink.slice(0, 3).map((item: any, i: number) => (
												<div
													key={"link_" + i}
													className="hoverable acc-btn"
													onClick={() => openTab(item.url)}
												>
													<div
														className="rounded-photo center"
														style={item.iconStyle}
													>
														{item.icon}
													</div>
													<h4>{item.label}</h4>
												</div>
											))
										) : (
											<LoadingSpinner className="spinner" />
										)}
									</div>
								</div>
								<ProfileButtons
									setVideosType={setVideosType}
									isOwnProfile={username === loggedInAs}
									// fetchLikedVids={fetchLikedVids}
									username={username!}
								/>
								{/* <div
									className={joinClasses(
										"profile-cards-container",
										(videosType === "liked" &&
											(!likedVideos || likedVideos.length === 0)) ||
											(videosType === "active" && user.videos!.length === 0)
											? "ungrid"
											: "" 
									)}
								> */}
								<div
									className={joinClasses(
										"profile-cards-container",
										videosType === "active" ? "ungrid" : ""
									)}
								>
									{/* {videosType === "active" ? (
										<VideosLayout videos={user.videos as string[]} />
									) : !likedVideos ? (
										<LoadingSpinner className="liked-spinner" />
									) : (
										<VideosLayout videos={likedVideos as string[]} />
									)} */}
									<VideosLayout
										tempParamsToDemoOwnData={isOwnProfile}
										videoType={videosType}
										videos={videos}
									/>
								</div>
							</div>
							<div className="right-panel">
								{user.userType === "store" && (
									<Panel
										title="店家資訊"
										subtitle="設定"
										onSubTitle={settingStoreData}
									>
										{detail.map((item, i) => (
											<div
												className="d-row panel-content-item"
												key={"detail_" + i}
											>
												{/* <span>icon</span> */}
												<div className="center">{item.icon}</div>
												<span id="store-address">{item.content}</span>
												{i == 0 && (
													<IoMdCopy
														size={24}
														className="copy-icon"
														onClick={copyText}
													/>
												)}
											</div>
										))}
										<button
											className="primary-button-2"
											style={{ borderRadius: 50 }}
										>
											我要訂位
										</button>
									</Panel>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</PageWithSidebar>
	);
}
