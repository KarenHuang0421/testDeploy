import { useEffect, useCallback, useState, ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiThumbsUp } from "react-icons/fi";
import { ReactComponent as Approve2 } from "../../../assets/approve-2.svg";
import { ReactComponent as EventsIcon } from "../../../assets/events.svg";
import { ReactComponent as FollowerIcon } from "../../../assets/follower-icon.svg";

import "./sidebar.scss";
import { useAppDispatch, useAppSelector } from "../../../common/store";
import { authModalActions } from "../../../common/store/slices/auth-modal-slice";
import { joinClasses } from "../../../common/utils";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import {
	fetchFollowing,
	fetchSuggested
} from "../../store/slices/sidebar-slice";
import constants from "../../../common/constants";
import LoadingSpinner from "../../../common/components/loading-spinner";
import Thumbnail from "../atoms/thumbnail";

interface Props {
	isTerms?: boolean;
}

const bottomCta = [
	{
		title: "聯絡我們",
		url: "/contact"
	},
	{
		title: "服務條款",
		url: "/terms/terms"
	},
	{
		title: "隱私權政策",
		url: "/terms/policy"
	}
];

const HomeLink = [
	{
		title: "為您推薦",
		url: "/",
		icon: <FiThumbsUp />
	},
	{
		title: "活動推薦",
		url: "/events",
		icon: <EventsIcon />
	},
	{
		title: "關注中",
		url: "/following",
		icon: <FollowerIcon />
	}
];

const TermsLink = [
	{
		title: "服務條款",
		url: "/terms/terms"
	},
	{
		title: "隱私權政策",
		url: "/terms/policy"
	}
];

export default function Sidebar({ isTerms = false }: Props) {
	const dispatch = useAppDispatch();
	const { isAuthenticated: isAuthed, username } = useAppSelector(
		state => state.auth
	);
	const { following: followingList, suggested: suggestedAccounts } =
		useAppSelector(state => state.pc.sidebar);
	const [showingAll, setShowingAll] = useState(false);

	useEffect(() => {
		if (!isAuthed || followingList) return;
		async function getFollowing() {
			try {
				await dispatch(fetchFollowing(username!)).unwrap();
			} catch (err: any) {
				dispatch(
					notificationActions.showNotification({
						type: "error",
						message: "Couldn't fetch users you follow: " + err.message
					})
				);
			}
		}
		getFollowing();
		// eslint-disable-next-line
	}, [isAuthed, username, dispatch]);

	const getSuggested = useCallback(
		async (limit: number) => {
			try {
				await dispatch(fetchSuggested(limit)).unwrap();
			} catch (err: any) {
				dispatch(
					notificationActions.showNotification({
						type: "error",
						message: err.message
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		if (suggestedAccounts) return;
		getSuggested(15);
		// eslint-disable-next-line
	}, [getSuggested]);

	function handleLogIn() {
		dispatch(authModalActions.showModal());
	}

	const LinkSet = (
		data: Array<{ title: string; url: string; icon?: ReactNode }>
	) => {
		return (
			<nav>
				{Object.values(data).map(({ title, url, icon }, i) => (
					<NavLink
						to={url}
						key={i}
						className={({ isActive }) =>
							joinClasses("hoverable", "nav-link", isActive && "active")
						}
					>
						{icon}
						<span>{title}</span>
					</NavLink>
				))}
			</nav>
		);
	};

	return (
		<div className="sidebar-wrapper">
			<aside className="app-sidebar">
				{isTerms && <span className="title">法律條款</span>}
				<LinkSet {...(!isTerms ? HomeLink : TermsLink)} />
				{!isTerms && (
					<>
						{!isAuthed && (
							<div className="log-in">
								{/* <span>
							Log in to follow creators, like videos, and view comments.
						</span> */}
								<button className="secondary-button" onClick={handleLogIn}>
									登入
								</button>
							</div>
						)}
						<div className="suggested">
							<header>
								<h5>推薦站內用戶</h5>
							</header>
							<div className="accounts">
								{suggestedAccounts ? (
									suggestedAccounts
										.slice(0, showingAll ? undefined : 5)
										.map((acc, i) => (
											<Link key={i} to={"/user/" + acc.username}>
												<div className="hoverable account-details">
													<div className="rounded-photo">
														{/* <img
															src={constants.pfpLink + "/" + acc.username}
															alt={acc.name}
														/> */}
														<Thumbnail size={40} />
													</div>
													<div className="name-container">
														<h5>{acc.username}</h5>
														<div className="d-row al-center">
															<h6>{acc.name}</h6>
															{acc.approved && <Approve2 />}
														</div>
													</div>
												</div>
											</Link>
										))
								) : (
									<LoadingSpinner className="spinner" />
								)}
							</div>
							<h5
								className="clickable see-all"
								onClick={() => setShowingAll(!showingAll)}
							>
								{showingAll ? "顯示較少" : "展開全部"}
								<i
									className={
										showingAll ? "fas fa-angle-up" : "fas fa-angle-down"
									}
								/>
							</h5>
						</div>
						<div className="d-col bottom-link">
							<div className="d-row">
								{bottomCta.map((item, i) =>
									!item.url ? (
										<span>{item.title}</span>
									) : (
										<Link key={i} to={item.url}>
											<span>{item.title}</span>
										</Link>
									)
								)}
							</div>
							<div>
								<span>© 2022 OMG</span>
							</div>
						</div>
					</>
				)}
				{/* <div className="ad">
					<div className="ad-block-1" />
				</div> */}
				{/* {isAuthed && (
					<div className="following">
						<header>
							<h5>Following</h5>
						</header>
						<div className="accounts">
							{followingList ? (
								followingList.length > 0 ? (
									followingList.map((acc, i) => (
										<Link key={i} to={"/user/" + acc.username}>
											<div
												className={joinClasses("hoverable", "account-details")}
											>
												<div className="rounded-photo">
													<img
														src={constants.pfpLink + "/" + acc.username}
														alt={acc.name}
													/>
												</div>
												<div className="name-container">
													<h5>{acc.username}</h5>
													<h6>{acc.name}</h6>
												</div>
											</div>
										</Link>
									))
								) : (
									<span className="no-following">
										Accounts you follow will appear here
									</span>
								)
							) : (
								<LoadingSpinner className="spinner" />
							)}
						</div>
					</div>
				)} */}
				{/* <div className="made-with">
					<p>Made with ❤️ by Shrutanten</p>
					<a
						href="https://github.com/soft-coded"
						target="_blank"
						rel="noreferrer"
					>
						github: @soft-coded
					</a>
				</div> */}
			</aside>
		</div>
	);
}
