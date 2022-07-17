import { useAppDispatch } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";

export default function Reset() {
	const dispatch = useAppDispatch();

	function handleModalClose(val?:any) {
		dispatch(popUpActions.hideModal());
	}
	
	return (
		<div className="d-col center w-100 send">
			<span>您的密碼已更新！<br />請重新登入</span>
			<button
				className="w-100 primary-button-2"
				onClick={handleModalClose}
			>
				登入
			</button>
		</div>
	);
}
