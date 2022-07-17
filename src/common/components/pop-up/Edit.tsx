// import { useState } from "react";
import { useAppDispatch } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";
import constants from "../../../common/constants";
import Thumbnail from "../../../pc/components/atoms/thumbnail";
import Input from "../../components/input-field"

export default function Edit() {
	const dispatch = useAppDispatch();
	// const [textCount, setTextCount] = useState(0);

	function handleModalClose(val?: any) {
		dispatch(popUpActions.hideModal());
		// dispatch(popUpActions.setType([""]));
	}

	return (
		<div className="d-col center w-100 pop-up">
			<div className="d-col center avatar-set">
				<Thumbnail size={100} />
				<span>變更大頭貼</span>
			</div>
			<form style={{width: '100%'}}>
				<h3>使用者名稱</h3>
				<Input
					placeholder="使用者名稱"
					name="username"
					// onChange={formik.handleChange}
					// onBlur={formik.handleBlur}
					// error={formik.touched.password && formik.errors.password}
				/>
				<h3>個人簡介</h3>
				<Input
					placeholder="個人簡介"
					name="profile"
					rows={8}
					textCount={0}
					textCountMax={constants.mailContentMaxLen}
					// onChange={formik.handleChange}
					// onBlur={formik.handleBlur}
					// error={formik.touched.password && formik.errors.password}
				/>
			</form>
			<div className="pop-up-button-set">
				<button className="w-100 thirdary-button" onClick={handleModalClose}>
					登入
				</button>
				<button className="w-100 primary-button-2" onClick={handleModalClose}>
					登入
				</button>
			</div>
		</div>
	);
}
