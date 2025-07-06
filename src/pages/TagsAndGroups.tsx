import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ManageGroups from "../components/tags-and-groups/ManageGroups.tsx";
import ManageTags from "../components/tags-and-groups/ManageTags.tsx";

const TagsAndGroups = () => {

	const tabItems = [
		{
			title: "Manage tags",
			eventKey: "manage_tags",
			tsx: <ManageTags />,
		},
		{
			title: "Manage groups",
			eventKey: "manage_groups",
			tsx: <ManageGroups />
		}
	]

	return (
		<Tabs
			defaultActiveKey="manage_tags"
			id="justify-tab-example"
			className="mb-4"
			justify
		>
			{tabItems.map((item) =>
				<Tab eventKey={item.eventKey} title={item.title}>
					{item.tsx}
				</Tab>
			)}
		</Tabs>
	);
};

export default TagsAndGroups;