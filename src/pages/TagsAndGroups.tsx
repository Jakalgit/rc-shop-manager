import ManageGroups from "../components/tags-and-groups/ManageGroups.tsx";
import ManageTags from "../components/tags-and-groups/ManageTags.tsx";
import TabsComponent from "../components/TabsComponent.tsx";

const TagsAndGroups = () => {

	const tabItems = [
		{
			title: "Управление тегами",
			eventKey: "manage_tags",
			tsx: <ManageTags />,
		},
		{
			title: "Управление группами",
			eventKey: "manage_groups",
			tsx: <ManageGroups />
		}
	]

	return (
		<TabsComponent items={tabItems} />
	);
};

export default TagsAndGroups;