import "./pop-up.scss";
import { joinClasses } from "../../utils";
import { ComponentProps } from "../../types";
import Reset from "./Reset";
import Send from "./Send";
import EditMyProfile from "./EditMyProfile";
import EditStoreProfile from "./EditStoreProfile";
import Publish from "./Publish";
import ActionList from "./ActionList";
import FailApply from "./FailApply";
import { IoCloseOutline } from "react-icons/io5";

interface Props extends ComponentProps {
	handleModalClose?: () => void;
	type?: string;
}

const title = (val: string) => {
	if (val === "edit-my-profile") return "編輯個人資料";
	if (val === "edit-store-profile") return "設定店家資訊";
	if (val === "apply") return "申請為專業帳號";
	else return null;
};

const showCloseBtn = (val: string) => {
	if (val === "apply") return true
	return false
}

export default function PopUp({ className, type, handleModalClose }: Props) {
	return (
		<>
			<div className="backdrop auth-backdrop" onClick={handleModalClose} />
			<div
				className={joinClasses("pop-up-container", "pop-up-" + type, className)}
			>
				{type && (
					<div className="d-row pop-up-title">
						<div className="flex-1" />
						<h1>{title(type)}</h1>
						<div className="jc-end flex-1">
							{showCloseBtn(type) && (
								<button className="icon-wrap center" onClick={handleModalClose}>
									<IoCloseOutline size={32} />
								</button>
							)}
						</div>
					</div>
				)}
				<div className="scrollable-part">
					{type === "feedback" && <Send handleModalClose={handleModalClose} />}
					{type === "reset" && <Reset />}
					{type === "edit-my-profile" && <EditMyProfile />}
					{type === "edit-store-profile" && <EditStoreProfile />}
					{type === "publish" && <Publish />}
					{type === "apply" && <ActionList />}
					{type === "fail-apply" && <FailApply />}
				</div>
			</div>
		</>
	);
}
