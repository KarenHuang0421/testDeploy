import { useAppDispatch } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";

export default function FailApply() {
	const dispatch = useAppDispatch();

	function handleModalClose(val?: any) {
		dispatch(popUpActions.hideModal());
	}

	return (
		<div className="d-col center w-100 fail-apply">
			<h2>無法申請</h2>
			<h3>您的粉絲數未達1,000人<br />故無法申請為公眾人物</h3>
			<button className="w-100 primary-button-2" onClick={handleModalClose}>
				確定
			</button>
		</div>
	);
}
