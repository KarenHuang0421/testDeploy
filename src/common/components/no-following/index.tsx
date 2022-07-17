import { ReactComponent as FollowerIcon } from "../../../assets/follower-icon.svg";
import "./no-following.scss";

export default function NoFollowing() {

	return (
		<div className="d-col w-100 center no-following">
            <FollowerIcon className="icon" />
			<h1>您尚未關注任何用戶</h1>
			<span>您可以至“為您推薦”對喜歡的用戶點擊「關注」</span>
        </div>
	);
}
