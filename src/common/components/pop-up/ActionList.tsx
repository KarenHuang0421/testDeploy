import { useAppDispatch } from "../../store";
import { popUpActions } from "../../store/slices/pop-up-slice";
import { ReactComponent as Approve1 } from "../../../assets/approve-1.svg";
import { ReactComponent as Approve2 } from "../../../assets/approve-2.svg";
import { ReactComponent as StoreSvg } from "../../../assets/store.svg";
import { ReactComponent as PublicSvg } from "../../../assets/publicFigure.svg";

export default function ActionList() {
	const dispatch = useAppDispatch();

	function handleModalClose(val?: any) {
		dispatch(popUpActions.hideModal());
	}

	const accountApplyList = [
		{
			icon: <StoreSvg />,
			subIcon: <Approve1 />,
			title: "申請為“店家”帳號身份",
			subTitle:
				"申請成功可獲得藍勾勾認證，並且可設定訂位資訊(需提供公司登記與營利事業登記證明做審核，工時約3天)",
			action: () => {
				window.location.href = "/apply"
			}
		},
		{
			icon: <PublicSvg />,
			subIcon: <Approve2 />,
			title: "申請為“公眾人物”身份",
			subTitle:
				"申請成功可獲得黃勾勾認證，並且獲得更高的曝光率（粉絲至少達1,000才可申請）",
			action: () => {
				dispatch(popUpActions.showModal(['fail-apply']));
			}
		}
	];

	return (
		<div className="d-col center w-100 action-list">
			{accountApplyList.map((item, i) => (
				<div
					className="d-row list-item al-center"
					key={i}
					onClick={item.action}
				>
					<span>{item.icon}</span>
					<div className="d-col al-start">
						<h3 className="al-center" style={{ color: "white" }}>
							{item.title} {item.subIcon}
						</h3>
						<h5 style={{ color: "#9D9D9D" }}>{item.subTitle}</h5>
					</div>
					<i className="fas fa-chevron-right" />
				</div>
			))}
		</div>
	);
}
