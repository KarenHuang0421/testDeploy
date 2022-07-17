import { useFormik } from "formik";
import * as yup from "yup";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { ImFacebook } from "react-icons/im";
import { FormProps } from ".";
import { useAppDispatch, useAppSelector } from "../../store";
import { authActions } from "../../store/slices/auth-slice";
import Input from "../input-field";
import ExternalLink from "../external-link";
import LoadingSpinner from "../loading-spinner";

const loginTypes = [
	{
		icon: <ImFacebook color="white" size={30} />,
		iconStyle: { backgroundColor: "#4267B2" },
		label: "Facebook"
	},
	{
		icon: <FcGoogle size={30} />,
		iconStyle: { backgroundColor: "white" },
		label: "Google"
	},
	{
		icon: <FaTwitter color="white" size={30} />,
		iconStyle: { backgroundColor: "#1DA1F2" },
		label: "Twitter"
	},
	{
		icon: <FaDiscord color="white" size={30} />,
		iconStyle: { backgroundColor: "#7289da" },
		label: "Discord"
	}
];

const paymentType = [
	{
		icon: <ImFacebook color="white" size={30} />,
		iconStyle: { backgroundColor: "#4267B2" },
		label: "Metatask"
	},
	{
		icon: <FcGoogle size={30} />,
		iconStyle: { backgroundColor: "white" },
		label: "WalletConnect"
	},
	{
		icon: <FaTwitter color="white" size={30} />,
		iconStyle: { backgroundColor: "#1DA1F2" },
		label: "Coinbase Wallet"
	}
];

const validationSchema = yup.object().shape({
	username: yup.string().trim().required(""),
	// .min(
	// 	constants.usernameMinLen,
	// 	`At least ${constants.usernameMinLen} characters`
	// )
	// .max(
	// 	constants.usernameMaxLen,
	// 	`At most ${constants.usernameMaxLen} characters`
	// )
	password: yup.string().trim().required("")
	// .min(
	// 	constants.passwordMinLen,
	// 	`At least ${constants.passwordMinLen} characters`
	// )
});

export default function LogIn({ setAuthType, handleModalClose }: FormProps) {
	const dispatch = useAppDispatch();
	const authStatus = useAppSelector(state => state.auth.status);

	const formik = useFormik({
		initialValues: {
			username: "",
			password: ""
		},
		validationSchema,
		onSubmit: async values => {
			// try {
			// 	await dispatch(loginThunk(values)).unwrap();
			// 	// handleModalClose();
			// } catch (err: any) {
			// 	dispatch(
			// 		notificationActions.showNotification({
			// 			type: "error",
			// 			message: err.message
			// 		})
			// 	);
			// }
			await dispatch(authActions.login(values))
			//
			// let currentAccounts = localStorage.getItem("account");
			// if (currentAccounts) {
			// 	let obj = JSON.parse(currentAccounts);

			// 	let hasThisAccount = obj
			// 		.map((e: any) => e?.username)
			// 		.indexOf(values.username);
			// 	if (hasThisAccount >= 0 && obj.length != 0) {
			// 		console.log("we have this account", obj[hasThisAccount]);
			// 		localStorage.setItem("loginAccount", obj[hasThisAccount])
			// 		handleModalClose()
			// 	} else {
			// 		let newAccounts = obj.concat(values);
			// 		localStorage.setItem("account", JSON.stringify(newAccounts));
			// 		console.log("we just add a new account", newAccounts);
			// 		setAuthType("fillDetail")
			// 	}
			// } else {
			// 	localStorage.setItem("account", JSON.stringify([values]));
			// 	setAuthType("fillDetail")
			// }
		}
	});

	return (
		<>
			{/* <h1>Log into TikTok</h1> */}
			<form onSubmit={formik.handleSubmit}>
				<h3>Email</h3>
				<Input
					placeholder="您的電子信箱"
					name="username"
					tailIcon
					hasBottomSpace={false}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.username && formik.errors.username}
				/>
				<h3>密碼</h3>
				<Input
					placeholder="您的密碼"
					type="password"
					name="password"
					hasBottomSpace={false}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && formik.errors.password}
				/>
				<span className="forget-pw" onClick={() => setAuthType("forget")}>
					忘記密碼
				</span>
				<button
					type="submit"
					className="w-100 center primary-button-2"
					disabled={
						!formik.dirty || !formik.isValid || authStatus === "loading"
					}
				>
					{authStatus === "loading" ? (
						<LoadingSpinner className="auth-spinner" />
					) : (
						"登入"
					)}
				</button>
			</form>
			<div className="other-login">
				<span />
				<span>其他方式登入</span>
				<span />
			</div>
			<div className="login-types">
				{loginTypes.map((item, i) => (
					<ExternalLink key={i} {...item} />
				))}
			</div>
			<span>連結錢包登入</span>
			<div className="d-col w-100 payment-types">
				{paymentType.map(({ label }, i) => (
					<button key={i} className="thirdary-button d-row center w-100">
						<img width={35} alt={label} src={`/images/${label?.split(" ").join("")}.png`} />
						{label}
					</button>
				))}
			</div>
		</>
	);
}
