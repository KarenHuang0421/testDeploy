import { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { FormProps } from ".";
import Input from "../input-field";
import LoadingSpinner from "../loading-spinner";
import PasswordFormatCheck from "../password-format-check";
import { useAppDispatch, useAppSelector } from "../../store";
import { signupThunk } from "../../store/slices/auth-slice";
import { notificationActions } from "../../store/slices/notification-slice";
import constants from "../../constants";

const validationSchema = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required(`用戶名稱不可少於${constants.usernameMinLen}個字`)
		.min(
			constants.usernameMinLen,
			`用戶名稱不可少於${constants.usernameMinLen}個字`
		)
		.max(
			constants.usernameMaxLen,
			`用戶名稱不可超過${constants.usernameMaxLen}個字`
		),
	// .matches(
	// 	constants.usernameRegex,
	// 	"Only English letters, digits and underscores allowed"
	// )
	email: yup
		.string()
		.trim()
		.required("請輸入您的Email格式")
		.email("請確認Email格式"),
	password: yup.string().trim().required(""),
	// .min(
	// 	constants.passwordMinLen,
	// 	`At least ${constants.passwordMinLen} characters`
	// )
	confpass: yup
		.string()
		.trim()
		.required("與設定的密碼不符")
		.oneOf([yup.ref("password"), null], "與設定的密碼不符")
});

export default function SignUp({ setAuthType, handleModalClose }: FormProps) {
	const dispatch = useAppDispatch();
	const authStatus = useAppSelector(state => state.auth.status);
	const [status, setStatus] = useState([false, false, false]);

	const formik = useFormik({
		initialValues: {
			email: "",
			username: "",
			name: "",
			password: "",
			confpass: ""
		},
		validationSchema,
		onSubmit: async values => {
			try {
				await dispatch(signupThunk(values)).unwrap();
				handleModalClose();
			} catch (err: any) {
				dispatch(
					notificationActions.showNotification({
						type: "error",
						message: err.message
					})
				);
			}
			handleModalClose()
		}
	});

	const checkPw = (val:string) => {
		setStatus([
			(val.length >= 8 && val.length <= 20),
			(/[a-zA-Z]/).test(val),
			(/\d/).test(val)
		])
	}


	return (
		<>
			{/* <h1>Sign up</h1> */}
			<form onSubmit={formik.handleSubmit}>
				<h3>用戶名稱</h3>
				<Input
					placeholder="請輸入您的用戶名稱"
					name="username"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.submitCount > 0 && formik.touched.username && formik.errors.username}
				/>
				<h3>Email</h3>
				<Input
					placeholder="請輸入您的電子信箱"
					type="email"
					name="email"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.submitCount > 0 && formik.touched.email && formik.errors.email}
				/>
				<h3>密碼設定</h3>
				<Input
					placeholder="請輸入登入密碼"
					type="password"
					name="password"
					// onChange={formik.handleChange}
					onChange={(val:any) => {
						// console.log(val.target.value)
						checkPw(val.target.value)
						formik.handleChange(val)
					}}
					onBlur={formik.handleBlur}
					error={formik.submitCount > 0 && formik.touched.password && formik.errors.password}
				/>
				<PasswordFormatCheck
					status={status}
					filled={formik.submitCount > 0 && formik.touched.password}
				/>
				<h3>確認密碼</h3>
				<Input
					placeholder="再次輸入登入密碼"
					type="password"
					name="confpass"
					hasBottomSpace={false}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.submitCount > 0 && formik.touched.confpass && formik.errors.confpass}
				/>
				<button
					type="submit"
					className="primary-button-2"
					disabled={
						!formik.dirty || authStatus === "loading"
					}
					// disabled={
					// 	!formik.dirty || !formik.isValid || authStatus === "loading"
					// }
				>
					{authStatus === "loading" ? (
						<LoadingSpinner className="auth-spinner" />
					) : (
						"註冊"
					)}
				</button>
			</form>
			<div className="note">
				點擊「註冊」即表示您同意平台的
				<Link to="/terms/terms" onClick={handleModalClose}>
					<span>使用條館</span>
				</Link>
				與
				<Link to="/terms/policy" onClick={handleModalClose}>
					<span>隱私權政策</span>
				</Link>
			</div>
		</>
	);
}
