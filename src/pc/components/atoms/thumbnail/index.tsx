import classes from "./thumbnail.module.scss";

import { HiUser } from "react-icons/hi";
import { ReactComponent as FireIcon } from "../../../../assets/fire.svg";
import { useEffect } from "react";

interface Props {
	size?: number;
	type?: "circle" | "square";
}

export default function Thumbnail({ size = 24, type }: Props) {
	
	if (type === "square") {
		return (
			<div
				className={classes["video-thumbnail-bg"]}
				style={{ width: size, height: size }}
			>
				<FireIcon style={{ width: size * 0.6, height: size * 0.6 }} />
			</div>
		);
	}
	return (
		<div className={classes["avatar-bg"]} style={{ width: size, height: size }}>
			<HiUser
				size={size * 1.15}
				style={{ transform: `translate(-${size / 14}px, 0)` }}
			/>
		</div>
	);
}
