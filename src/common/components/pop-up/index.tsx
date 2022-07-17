
import "./pop-up.scss";
import { joinClasses } from "../../utils";
import { ComponentProps } from "../../types";
import Reset from "./Reset";
import Send from "./Send";
import Edit from "./Edit";
import Publish from "./Publish";

interface Props extends ComponentProps {
	handleModalClose?: () => void;
	type?: string;
}

export default function PopUp({ className, type, handleModalClose }: Props) {
	return (
		<>
			<div className="backdrop auth-backdrop" onClick={handleModalClose} />
			<div className={joinClasses("pop-up-container", className)}>
				<div className="w-100 jc-space-btw">
					{type === "feedback" && <Send handleModalClose={handleModalClose} />}
					{type === "reset" && <Reset />}
					{type === "edit" && <Edit />}
					{type === "publish" && <Publish />}
				</div>
			</div>
		</>
	);
}
