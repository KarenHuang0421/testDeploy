import "./right-sidebar.scss";
import Panel from "../panel";
import { Link } from "react-router-dom";
import { ReactComponent as Approve1 } from "../../../assets/approve-1.svg";
import Thumbnail from "../atoms/thumbnail";
import { demoStoreUsers } from "../../../data.json"; 

interface Props {}

const news = [
	{
		content: "泰國開放邊境，預期今年達到1000萬遊客入境"
	},
	{
		content: "泰國開放邊境，預期今年達到1000萬遊客入境"
	},
	{
		content: "泰國開放邊境，預期今年達到1000萬遊客入境"
	},
	{
		content: "泰國開放邊境，預期今年達到1000萬遊客入境"
	}
];

const stores = [
	{
		content: "RAW"
	},
	{
		content: "教父牛排"
	},
	{
		content: "MEET"
	},
	{
		content: "台北文華東方酒店"
	}
];

const users = [
	{
		content: "愛污及污"
	},
	{
		content: "圈圈圓圓圈圈"
	},
	{
		content: "暖西張震"
	},
	{
		content: "莫凡彼"
	}
];

interface Props {
	isContact?: boolean;
}

export default function RightSidebar({ isContact = false }: Props) {
	return (
		<div className="right-sidebar-wrapper">
			{/* <div className="ad-block-1" /> */}
			{/* <div className="ad-block-2" /> */}
			{!isContact && (
				<>
					<Panel title="最火時事榜" subtitle="上週熱門時事">
						{news.map((item, i) => (
							<div className="d-row news-list-item" key={"news_" + i}>
								{/* <div className="thumbnail" /> */}
								<Thumbnail size={40} type="square" />
								<div className="content">{item.content}</div>
								<div className="d-row center">
									<i className="far fa-heart" />
									<div>12</div>
								</div>
							</div>
						))}
					</Panel>
					<Panel title="人氣店家榜" subtitle="上週訂位最火熱">
						{demoStoreUsers.map((item, i) => (
							<Link key={i} to={"/user/" + item.username}>
								<div className="d-row store-list-item" key={"stores_" + i}>
									<Thumbnail size={40} />
									<div className="content">{item.username}</div>
									<Approve1 />
								</div>
							</Link>
						))}
					</Panel>
					<Panel title="魅力氣用戶榜" subtitle="上週累積讚數最多">
						{users.map((item, i) => (
							<div className="d-row account-list-item" key={"users_" + i}>
								<Thumbnail size={40} />
								<div className="content">{item.content}</div>
								<div className="d-row center">
									<i className="far fa-heart" />
									<div>12</div>
								</div>
							</div>
						))}
					</Panel>
				</>
			)}
		</div>
	);
}
