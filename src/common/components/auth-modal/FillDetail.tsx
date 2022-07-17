import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { FormProps } from ".";
import Input from "../input-field";
import Thumbnail from "../../../pc/components/atoms/thumbnail";
import { useAppSelector } from "../../store";
import LoadingSpinner from "../loading-spinner";
import constants from "../../constants";

export default function FillDetail({ setAuthType, handleModalClose }: FormProps) {
	const authStatus = useAppSelector(state => state.auth.status);
	const validationSchema = yup.object().shape({
		username: yup
			.string()
			.trim()
			.required("請輸入您的Email格式")
            .min(
                constants.usernameMinLen,
                `用戶名稱不可少於${constants.usernameMinLen}個字`
            )
            .max(
                constants.usernameMaxLen,
                `用戶名稱不可超過${constants.usernameMaxLen}個字`
            )
	});

	const formik = useFormik({
		initialValues: {
			username: ""
		},
		validationSchema,
		onSubmit: async values => {
			handleModalClose()
		}
	});
	
	return (
		<>
			{/* <h1>Log into TikTok</h1> */}
			<form onSubmit={formik.handleSubmit}>
				<div className="d-col center avatar-set">
					<Thumbnail size={140} />
					<span>變更大頭貼</span>
				</div>
				<h3>用戶名稱</h3>
				<Input
					placeholder="請輸入您的用戶名稱"
					name="username"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.username && formik.errors.username}
				/>
				<button
					type="submit"
					className="primary-button-2"
					disabled={
						!formik.dirty || !formik.isValid || authStatus === "loading"
					}
				>
					{authStatus === "loading" ? (
						<LoadingSpinner className="auth-spinner" />
					) : (
						"完成"
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
