import React, {useState} from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

interface IProps {
	items: {
		title: string;
		eventKey: string;
		tsx: React.ReactNode;
	}[];
}

const TabsComponent: React.FC<IProps> = ({ items }) => {

	const [activeTab, setActiveTab] = useState<string>(items[0].eventKey);

	return (
		<>
			<Tabs
				defaultActiveKey={items[0].eventKey}
				className="mb-4 mt-2"
				justify
				onSelect={(eventKey: string | null) => setActiveTab(eventKey || items[0].eventKey)}
			>
				{items.map(item =>
					<Tab
						title={item.title}
						eventKey={item.eventKey}
					/>
				)}
			</Tabs>
			{items.find(el => el.eventKey === activeTab)?.tsx}
		</>
	);
};

export default TabsComponent;