import { ReactNode } from "react";
import { joinClasses } from "../../../common/utils";
import "./panel.scss";

interface Props {
	className?: string;
	children?: React.ReactNode;
	title?: string;
	subtitle?: string;
	onSubTitle?: () => void;
}

export default function Panel({
	children,
	className,
	title,
	subtitle,
	onSubTitle
}: Props) {
	return (
		<div className={joinClasses("d-col panel-card", className)}>
			{title && (
				<div className="d-row jc-space-btw panel-head">
					<span>{title}</span>
					<span
						className="sub"
						onClick={onSubTitle}
					>
						{subtitle}
					</span>
				</div>
			)}
			{children}
		</div>
	);
}
