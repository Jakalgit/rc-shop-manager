import {Container, Row, Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {type PartnerResponse, ProfileStatusEnum} from "../../api/profile/types.ts";
import PartnerCardItem from "./PartnerCardItem.tsx";
import PaginationComponent from "../PaginationComponent.tsx";

interface IProps {
	getData: (
		page: number,
		setItems: (value: React.SetStateAction<PartnerResponse[]>) => void,
		setTotalPages: (value: React.SetStateAction<number>) => void,
		setLoading: (value: React.SetStateAction<boolean>) => void,
		status: ProfileStatusEnum,
	) => Promise<void>;
	status: ProfileStatusEnum,
	accept?: boolean;
	reject?: boolean;
	remove?: boolean;
	ban?: boolean;
}

const Entries: React.FC<IProps> = ({getData, status, ...rest}) => {

	const [loading, setLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [items, setItems] = useState<PartnerResponse[]>([]);

	useEffect(() => {
		getData(page, setItems, setTotalPages, setLoading, status);
	}, [page, status]);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Загрузка...</span>
			</Spinner>
		)
	}

	return (
		<Container fluid>
			{items.length > 0 && (
				<>
					<Row>
						{items.map((item) =>
							<PartnerCardItem
								item={item}
								{...rest}
							/>
						)}
					</Row>
					<PaginationComponent
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
						siblingCount={5}
					/>
				</>
			)}
		</Container>
	);
};

export default Entries;