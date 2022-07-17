import Container from "../container";
import Sidebar from "../sidebar";
import RightSidebar from "../right-sidebar";

interface Props {
	children: React.ReactNode;
	className?: string;
	isHome?: boolean;
	isContact?: boolean;
	isTerms?: boolean;
}

export default function PageWithSidebar({ children, className, isHome, isContact, isTerms }: Props) {
	return (
		<Container className={className}>
			<Sidebar isTerms={isTerms} />
			{children}
			{(isHome || isContact) && <RightSidebar isContact={isContact} />}
		</Container>
	);
}
