import { useState, useLayoutEffect } from "react";

import "./auth-modal.scss";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Forget from "./Forget";
import FillDetail from "./FillDetail";
import { IoCloseOutline } from "react-icons/io5";
import { useAppDispatch } from "../../store";
import { joinClasses, modifyScrollbar } from "../../utils";
import { authModalActions } from "../../store/slices/auth-modal-slice";
import { popUpActions } from "../../store/slices/pop-up-slice";
import { ComponentProps } from "../../types";

export interface FormProps {
	setAuthType: React.Dispatch<
		React.SetStateAction<"login" | "signup" | "forget" | "fillDetail">
	>;
	handleModalClose: () => void;
}

const title = {
	login: "登入OMG",
	signup: "註冊會員",
	forget: "忘記密碼",
	fillDetail: "完善會員資料"
};

interface Props extends ComponentProps {
	isMobile?: boolean;
}

export default function AuthModal({ isMobile, className }: Props) {
	const [authType, setAuthType] = useState<
		"login" | "signup" | "forget" | "fillDetail"
	>("login");
	const dispatch = useAppDispatch();

	useLayoutEffect(() => {
		if (isMobile) return;
		modifyScrollbar("hide");
	}, [isMobile]);

	function handleModalClose(val?:any) {
		if (!isMobile) modifyScrollbar("show");
		dispatch(authModalActions.hideModal());

		if (val === "hasResetPassward") {
			dispatch(popUpActions.showModal(["reset"]));
		}
	}

	return (
		<>
			{!isMobile && (
				<div className="backdrop auth-backdrop" onClick={handleModalClose} />
			)}
			<div
				className={joinClasses(
					"auth-modal-container",
					isMobile ? "mobile" : "pc",
					className
				)}
				style={{ minHeight: authType === "fillDetail" ? "unset" : "70vh" }}
			>
				{/* {isMobile && <i className="fas fa-close" onClick={handleModalClose} />} */}
				{authType !== "fillDetail" ? (
					<div
						className="w-100 jc-space-btw"
						style={{ marginBottom: "0.8rem" }}
					>
						{authType !== "login" ? (
							<button
								className="icon-wrap center"
								onClick={() => setAuthType("login")}
							>
								<i className="fas fa-angle-left" style={{ fontSize: "24px" }} />
							</button>
						) : (
							<div style={{ width: 52 }} />
						)}
						<h1>{title[authType]}</h1>
						<button className="icon-wrap center" onClick={handleModalClose}>
							{/* <i className="fas fa-close" onClick={handleModalClose} /> */}
							<IoCloseOutline size={32} />
						</button>
					</div>
				) : (
					<h1>{title[authType]}</h1>
				)}
				<div className="scrollable-part">
					{authType === "login" && (
						<LogIn
							setAuthType={setAuthType}
							handleModalClose={handleModalClose}
						/>
					)}
					{authType === "signup" && (
						<SignUp
							setAuthType={setAuthType}
							handleModalClose={handleModalClose}
						/>
					)}
					{authType === "forget" && (
						<Forget
							setAuthType={setAuthType}
							handleModalClose={() => handleModalClose("hasResetPassward")}
						/>
					)}
					{authType === "fillDetail" && (
						<FillDetail
							setAuthType={setAuthType}
							handleModalClose={handleModalClose}
						/>
					)}
				</div>
				<div className="float-panel">
					<div className="center switch-state">
						{authType === "signup" && (
							<>
								已經有帳號？
								<span onClick={() => setAuthType("login")}> 前往登入</span>
							</>
						)}
						{(authType === "login" || authType === "forget") && (
							<>
								還沒有帳號？
								<span onClick={() => setAuthType("signup")}> 註冊會員</span>
							</>
						)}
						{authType === "fillDetail" &&
							"請完善以上資料後，快速使用LetmeCC的服務！"}
					</div>
				</div>
			</div>
		</>
	);
}
