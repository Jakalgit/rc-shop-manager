import React from "react";
import {Button, Card, Container} from "react-bootstrap";
import Cookies from "universal-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getChatList} from "../../../api/chat/api.ts";
import type {Chat} from "../../../api/chat/types.ts";
import PaginationComponent from "../../../components/PaginationComponent.tsx";

export const Messages = React.memo(() => {

	const cookies = new Cookies();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const page = Number(searchParams.get('page')) || 1;

	const [loading, setLoading] = React.useState<boolean>(true);
	const [chats, setChats] = React.useState<Chat[]>([]);
	const [totalPages, setTotalPages] = React.useState<number>(1);

	const onPageChange = React.useCallback((_page: number) => {
		setSearchParams({page: _page.toString()})
	}, []);

	const toChat = React.useCallback((clientId: string) => {
		navigate(`/chat/${clientId}`);
	}, []);

	React.useEffect(() => {
		async function getData() {
			try {
				const act: string = cookies.get("act");

				const response = await getChatList({page, pageCount: 12, token: act});

				setChats(response.records);
				setTotalPages(response.totalPages);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}

		getData();
	}, [page]);

	if (loading) {
		return <div>Загрузка...</div>
	}

	return (
		<Container fluid>
			<div className="d-flex justify-content-between align-items-center mb-3 mt-3">
				<h3 className="mb-0">Сообщения</h3>
			</div>
			{chats.map((el, i) =>
				<Card className="mt-3" key={i}>
					<Card.Body>
						<Card.Title>
							{el.name}
						</Card.Title>
						{el.lastMessage && (
							<Card.Text>
								<strong>{el.lastMessage.fromUser ? 'Пользователь' : 'Вы'}:</strong> {el.lastMessage.message}
							</Card.Text>
						)}
						<Button
							onClick={() => toChat(el.clientId)}
						>
							Перейти в чат
						</Button>
					</Card.Body>
				</Card>
			)}
			<PaginationComponent
				currentPage={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				siblingCount={5}
			/>
		</Container>
	)
})