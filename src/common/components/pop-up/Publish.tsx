import { useAppDispatch, useAppSelector } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";

export default function Publish() {
	const dispatch = useAppDispatch();
	const { username } = useAppSelector(prev => prev.auth)

	function handleModalClose(val?: any) {
		dispatch(popUpActions.hideModal());
	}

	function goToProfilePage () {
		window.location.href = "/user/" + username
	}

	return (
		<div className="d-col center w-100">
			<div className="content">已將您的影片發布到<br />OMG了！</div>
			<button className="w-100" onClick={handleModalClose}>上傳其他影音內容</button>
			<button className="w-100" onClick={goToProfilePage}>查看個人資料</button>
		</div>
	);
}
