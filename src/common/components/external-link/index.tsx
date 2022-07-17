import classes from "./external-link.module.scss";
import { ReactNode } from "react";
import { joinClasses } from "../../utils";

interface Props {
	label?: string,
    icon?: ReactNode,
    iconStyle?: object
}

export default function ExternalLink({ label, icon, iconStyle}: Props) {
	return (
		<div className={joinClasses(classes["wrap"], "d-col center")}>
            <div className={classes["iconWrap"]} style={iconStyle}>
			    {icon}
            </div>
			<span>{label}</span>
		</div>
	);
}
