import "./terms.scss";
import { useLocation } from "react-router-dom";
import PageWithSidebar from "../../components/page-with-sidebar";
// import { data } from "./data.json"

const data = {
	partOne: `Last updated: Apr 2, 2022

    Welcome to TikTok (the “Platform”). The Platform is provided and controlled by TikTok Pte. Ltd., with its registered address at 1 Raffles Quay, #26-10, South Tower, Singapore 048583 (“TikTok”, “we” or “us”). 
    
    We are committed to protecting and respecting your privacy.  This policy explains our practices concerning the personal data we collect from you, or that you provide to us. If you do not agree with this policy, you should not use the Platform. 
    
    If you have any questions about how we use your personal data, contact us at: https://www.tiktok.com/legal/report/privacy.`,

	partTwoTitle: `SUMMARY`,
	partTwo: [
		{
			title: `What information do we collect about you?`,
			content: `We collect and process information you give us when you create an account and upload content to the Platform. This includes technical and behavioural information about your use of the Platform.  We also collect information about you if you download the app and interact with the Platform without creating an account.`
		},
		{
			title: `How will we use the information about you?`,
			content: `We use your information to provide the Platform to you and to improve and administer it.  We use your information to, among other things, show you suggestions in the ‘For You’ feed, improve and develop the Platform and ensure your safety.  Where appropriate, we will also use your personal information to serve you targeted advertising and promote the Platform. `
		},
		{
			title: `Who do we share your information with?`,
			content: `We share your data with third party service providers who help us to deliver the Platform, such as cloud storage providers. We also share your information with business partners, other companies in the same group as TikTok, content moderation services, measurement providers, advertisers, and analytics providers. Where and when required by law, we will share your information with law enforcement agencies or regulators, and with third parties pursuant to a legally binding court order.`
		}
	]
};
export default function Terms() {
	const { pathname } = useLocation();
	const isSubpageTwo = pathname.split("/")[2] === "policy";

	// console.log(pathname.split('/')[2])

	return (
		<PageWithSidebar className="termspage-container" isTerms>
			<div className="content-container">
				<h1>{!isSubpageTwo ? "服務條款" : "隱私權政策"}</h1>
				<span>{data.partOne}</span>
				<h2>{data.partTwoTitle.toUpperCase()}</h2>
				{data.partTwo.map(item => (
					<div>
						<h2>{item.title}</h2>
						<span>{item.content}</span>
					</div>
				))}
			</div>
		</PageWithSidebar>
	);
}
