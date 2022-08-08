import { FiCheck } from "react-icons/fi";

interface Props {
	handleModalClose?: () => void;
	content?: string;
}

export default function Send({ content, handleModalClose }: Props) {
	return (
		<div className="d-col center w-100 send">
			<div className="center">
				<FiCheck size={200} />
			</div>
			<span>{content}</span>
			<button className="w-100 primary-button-2" onClick={handleModalClose}>
				確認
			</button>
		</div>
	);
}
