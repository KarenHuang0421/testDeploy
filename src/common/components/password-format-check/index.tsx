import {
	IoIosCheckmarkCircle,
	IoIosCheckmarkCircleOutline
} from "react-icons/io";
import { joinClasses } from "../../utils";
import classes from "./password-format-check.module.scss";

interface Props {
	list?: Array<string>;
	status: Array<boolean>;
	filled?: boolean;
}

const defaultList = [
	"密碼最少8-20個字母",
	"至少需要1個英文字母",
	"至少需要1個阿拉伯數字"
];

export default function PasswordFormatCheck({
	list = defaultList,
	status,
	filled
}: Props) {
	return (
		<div className={joinClasses("d-col", classes["password-format-check"])}>
			<span>您的密碼需滿足以下條件</span>
			{list.map((item, i) => (
				<div key={i} className="d-row al-center">
					{status[i] ? (
						<IoIosCheckmarkCircle size={24} color="#e337ff" />
					) : (
						<IoIosCheckmarkCircleOutline size={24} color="#5B5A59" />
					)}
					<span
						style={{
							margin: "0 0.4rem",
							color: filled && !status[i] ? "#FF2F54" : "#5B5A59"
						}}
					>
						{item}
					</span>
				</div>
			))}
		</div>
	);
}
