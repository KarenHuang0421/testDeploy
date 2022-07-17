import {
	ReactNode,
	forwardRef,
	ForwardedRef,
	useState,
} from "react";
// import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { ReactComponent as HideIcon } from "../../../assets/hide.svg";
import { ReactComponent as VisibleIcon } from "../../../assets/visible.svg";

import classes from "./input.module.scss";
import { joinClasses } from "../../utils";

interface InputProps {
	type?: "text" | "password" | "email";
	placeholder?: string;
	id?: string;
	className?: string;
	wrapperClassName?: string;
	icon?: ReactNode;
	onChange?: (a: any) => void;
	onBlur?: (a: any) => void;
	value?: string;
	name?: string;
	error?: string | false;
	autoComplete?: string;
	isMobile?: boolean;
	autoFocus?: boolean;
	hasBottomSpace?: boolean;
	tailIcon?: ReactNode | boolean;
	rows?: number;
	textCount?: number;
	textCountMax?: number;
	textCountOnTop?: boolean;
}

function Input(
	{
		type = "text",
		placeholder,
		id,
		className,
		wrapperClassName,
		icon,
		onChange,
		onBlur,
		value,
		name,
		error,
		autoComplete,
		isMobile,
		autoFocus,
		hasBottomSpace = true,
		tailIcon = false,
		textCount,
		textCountMax,
		rows,
		textCountOnTop
	}: InputProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			className={joinClasses(
				isMobile ? classes["mobile-input-wrapper"] : classes["input-wrapper"],
				wrapperClassName
			)}
		>
			<div
				className={joinClasses(
					classes["input-field"],
					error && joinClasses(classes["error"], "error"),
					className
				)}
			>
				{icon}
				{!rows ? (
					<input
						ref={ref}
						id={id}
						type={isVisible ? "text" : type}
						placeholder={placeholder}
						onChange={onChange}
						onKeyUp={onBlur}
						onBlur={onBlur}
						value={value}
						name={name}
						autoComplete={autoComplete}
						autoFocus={autoFocus}
					/>
				) : (
					<textarea
						id={id}
						placeholder={placeholder}
						onChange={onChange}
						onKeyUp={onBlur}
						onBlur={onBlur}
						value={value}
						name={name}
						autoComplete={autoComplete}
						autoFocus={autoFocus}
						rows={rows}
					/>
				)}
				{type === "password" && (
					<div
						className={classes["tail-icon"]}
						onClick={() => setIsVisible(prev => !prev)}
					>
						{isVisible ? (
							// <GrFormView size={28} className={classes["icon"]} />
							<VisibleIcon />
						) : (
							// <GrFormViewHide size={28} className={classes["icon"]} />
							<HideIcon />
						)}
					</div>
				)}
			</div>
			{(error || hasBottomSpace) && (
				<div
					className={joinClasses(classes["error-container"], "error-container")}
				>
					{error}
				</div>
			)}
			{textCountMax && (
				<span
					className={classes["textcount"]}
					style={
						textCountOnTop
							? { top: "-10px", transform: "translateY(-100%)" }
							: { bottom: "-10px" }
					}
				>
					{textCount} / {textCountMax}
				</span>
			)}
		</div>
	);
}

export default forwardRef(Input);
