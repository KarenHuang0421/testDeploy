import { ReactNode } from "react";

import classes from "./action-button.module.scss";
import { joinClasses } from "../../../common/utils";
import { ComponentProps } from "../../../common/types";

interface ABProps extends ComponentProps {
	number?: string | number;
	label?: string;
	icon: ReactNode;
	onClick?: () => void;
}

export default function ActionButton({
	number,
	icon,
	className,
	label,
	onClick
}: ABProps) {
	return (
		<div className={joinClasses(classes["action-btn-container"], className)}>
			<div
				className={joinClasses(classes["action-btn"], "action-btn")}
				onClick={onClick}
			>
				{icon}
			</div>
			<span>{number || label}</span>
		</div>
	);
}
