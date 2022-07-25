import { ReactNode, forwardRef, ForwardedRef, useState } from "react";
// import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { ReactComponent as HideIcon } from "../../../assets/hide.svg";
import { ReactComponent as VisibleIcon } from "../../../assets/visible.svg";

import classes from "./select.module.scss";
import { joinClasses } from "../../utils";

interface SelectProps {
	placeholder?: string;
	id?: string;
	className?: string;
	wrapperClassName?: string;
	icon?: ReactNode;
	value?: string;
	name?: string;
	error?: string | false;
}
function Select(
	{
		placeholder,
        id,
		className,
		wrapperClassName,
		icon,
		value,
		name,
		error
	}: SelectProps,
	ref: ForwardedRef<HTMLSelectElement>
) {

	return (
		<div className={joinClasses(classes["select-wrapper"], wrapperClassName)}>
			<div
				className={joinClasses(
					classes["select-field"],
					error && joinClasses(classes["error"], "error"),
					className
				)}
			>
				{icon}
				<select
					ref={ref}
					id={id}
					// type={isVisible ? "text" : type}
					placeholder={placeholder}
					// onChange={onChange}
					// onKeyUp={onBlur}
					// onBlur={onBlur}
					value={value}
					name={name}
					// autoComplete={autoComplete}
					// autoFocus={autoFocus}
				>
                </select>
			</div>
			{/* {(error || hasBottomSpace) && (
				<div
					className={joinClasses(classes["error-container"], "error-container")}
				>
					{error}
				</div>
			)} */}
		</div>
	);
}

export default forwardRef(Select);
