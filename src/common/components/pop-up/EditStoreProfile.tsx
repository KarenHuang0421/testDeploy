// import { useState } from "react";
import { useAppDispatch } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";
import constants from "../../constants";
import Input from "../input-field";
import Select from "../select-field";

export default function EditStoreProfile() {
	const dispatch = useAppDispatch();

	function handleModalClose(val?: any) {
		dispatch(popUpActions.hideModal());
	}

	return (
		<div className="d-col center w-100">
			<form style={{marginTop:'1rem'}}>
				<h3>店家平均每人消費金額為何？</h3>
				<Input placeholder="請輸入人均消費金額" name="low-consumption" />
				<div className="d-row" style={{ gap: "1rem" }}>
					<div className="d-col flex-1">
						<h3>店家所在縣市</h3>
						<Input placeholder="請輸入店家所在縣市" name="low-consumption" />
					</div>
					<div className="d-col flex-1">
						<h3>店家所在鄉鎮市區</h3>
						<Input placeholder="請輸入店家所在鄉鎮市區" name="low-consumption" />
					</div>
				</div>
				<h3>店家地址</h3>
				<Input placeholder="請輸入店家地址" name="low-consumption" />
				<h3>訂位平台</h3>
				<Input placeholder="請輸入訂位平台" name="low-consumption" />
				<h3>您的官網/訂位連結</h3>
				<Input placeholder="請輸入您的官網/定位連結" name="low-consumption" />
			</form>
				<div className="pop-up-button-set">
					<button className="w-100 thirdary-button" onClick={handleModalClose}>
						取消
					</button>
					<button className="w-100 primary-button-2" onClick={handleModalClose}>
						儲存
					</button>
				</div>
		</div>
	);
}
