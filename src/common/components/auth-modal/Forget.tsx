import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { FormProps } from ".";
// import {
// 	IoIosCheckmarkCircle,
// 	IoIosCheckmarkCircleOutline
// } from "react-icons/io";
import PasswordFormatCheck from "../password-format-check";
import Input from "../input-field";
import { useAppSelector } from "../../store";
import LoadingSpinner from "../loading-spinner";

export default function Forget({ setAuthType, handleModalClose }: FormProps) {
	const authStatus = useAppSelector(state => state.auth.status);
	const [status, setStatus] = useState([false, false, false]);

	const validationSchema = yup.object().shape({
		username: yup
			.string()
			.trim()
			.required("請輸入您的Email格式")
			.email("請確認Email格式"),
		password: yup.string().trim().required(""),
		// .matches(/(\d)/, () =>
		// 	setStatus(prev => prev.map((e, i) => (i == 2 ? true : false)))
		// )
		confpass: yup
			.string()
			.trim()
			.required("與設定的密碼不符")
			.oneOf([yup.ref("password"), null], "與設定的密碼不符"),
		code: yup.string().trim().required("驗證碼錯誤，請重新檢查驗證碼郵件")
	});

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
			confpass: "",
			code: ""
		},
		validationSchema,
		onSubmit: async values => handleModalClose()
	});

	const checkPw = (val: string) => {
		setStatus([
			val.length >= 8 && val.length <= 20,
			/[a-zA-Z]/.test(val),
			/\d/.test(val)
		]);
	};

	return (
		<>
			{/* <h1>Log into TikTok</h1> */}
			<form onSubmit={formik.handleSubmit}>
				<h3>Email</h3>
				<Input
					placeholder="請輸入您的電子信箱"
					name="username"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={
						formik.submitCount > 0 &&
						formik.touched.username &&
						formik.errors.username
					}
				/>
				<h3>新密碼設定</h3>
				<Input
					placeholder="請輸入新的登入密碼"
					type="password"
					name="password"
					hasBottomSpace={false}
					onChange={(val: any) => {
						// console.log(val.target.value)
						checkPw(val.target.value);
						formik.handleChange(val);
					}}
					onBlur={formik.handleBlur}
					error={
						formik.submitCount > 0 &&
						formik.touched.password &&
						formik.errors.password
					}
				/>
				<PasswordFormatCheck status={status} filled={formik.touched.password} />
				<h3>確認密碼</h3>
				<Input
					placeholder="再次輸入新的登入密碼"
					type="password"
					name="confpass"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={
						formik.submitCount > 0 &&
						formik.touched.confpass &&
						formik.errors.confpass
					}
				/>
				<div className="d-row al-end" style={{ gap: "10px" }}>
					<div className="d-col flex-1">
						<h3>驗證碼</h3>
						<Input
							placeholder="請輸入Email收到的驗證碼"
							name="code"
							hasBottomSpace={false}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.submitCount > 0 &&
								formik.touched.code &&
								formik.errors.code
							}
						/>
					</div>
					<div
						className="primary-button"
						onClick={() => null}
						style={{
							cursor: "pointer",
							padding: "10px 12px",
							height: "unset",
							marginBottom:
								formik.submitCount > 0 &&
								formik.touched.code &&
								formik.errors.code
									? "1.2rem"
									: 0
						}}
					>
						取得驗證碼
					</div>
				</div>
				<button
					type="submit"
					className="primary-button-2"
					disabled={!formik.dirty || authStatus === "loading"}
					// disabled={
					// 	!formik.dirty || !formik.isValid || authStatus === "loading"
					// }
				>
					{authStatus === "loading" ? (
						<LoadingSpinner className="auth-spinner" />
					) : (
						"前往登入"
					)}
				</button>
			</form>
		</>
	);
}
