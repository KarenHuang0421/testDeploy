import ActionButton from "../action-button";
import { useAppSelector, useAppDispatch } from "../../../common/store";
import { likeVideo } from "../../../common/api/video";
import { notificationActions } from "../../../common/store/slices/notification-slice";
import { joinClasses } from "../../../common/utils";
import { LikeSmIcon } from "../../../assets/logo.js";

interface Props {
	likes: number;
	handleAuthModalOpen: () => void;
	curVidId: string;
	hasLiked?: boolean;
	onClick: (liked: boolean) => void;
}

export default function Likes(props: Props) {
	const {
		isAuthenticated: isAuthed,
		username,
		token
	} = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();

	async function likeVid() {
		if (!isAuthed) return props.handleAuthModalOpen();
		try {
			const res = await likeVideo(username!, props.curVidId, token!);
			props.onClick(res.data.liked);
		} catch (err: any) {
			dispatch(
				notificationActions.showNotification({
					type: "error",
					message: err.message
				})
			);
		}
	}

	return (
		<ActionButton
			// icon={<i className="fas fa-heart" />}
			icon={<LikeSmIcon fill={props.hasLiked ? "#FF244C" : "white"} />}
			number={props.likes}
			className={joinClasses("action-btn-container", props.hasLiked && "liked")}
			onClick={likeVid}
		/>
	);
}
