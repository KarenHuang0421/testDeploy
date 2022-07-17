import { FiCheck } from "react-icons/fi";

interface Props {
	handleModalClose?: () => void,
}

export default function Send({ handleModalClose }: Props) {
	return (
		<div className="d-col center w-100 send">
			<div className="center">
				<FiCheck size={200} />
			</div>
			<span>我們已收到您的來信</span>
			<button
				className="w-100 primary-button-2"
				onClick={handleModalClose}
			>
				確認
			</button>
		</div>
	);
}
