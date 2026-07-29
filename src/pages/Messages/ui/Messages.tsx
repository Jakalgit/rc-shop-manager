import React from "react";
import {Button, Card, Container} from "react-bootstrap";
import Cookies from "universal-cookie";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getChatList, getChatListTg} from "../../../api/chat/api.ts";
import type {Chat} from "../../../api/chat/types.ts";
import PaginationComponent from "../../../components/PaginationComponent.tsx";
import {useTelegram} from "../../../shared/hooks/useTelegram.ts";

interface MessagesProps {
	fromTg?: boolean;
}

export const Messages: React.FC<MessagesProps> = React.memo(({ fromTg }) => {

	const cookies = new Cookies();
	const tg = useTelegram();

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
		if (fromTg) {
			navigate(`/chat-tg/${clientId}`);
		} else {
			navigate(`/chat/${clientId}`);
		}
	}, [fromTg]);

	React.useEffect(() => {
		async function getData() {
			try {
				let response;

				if (fromTg) {
					if (!tg) return;
					response = await getChatListTg({page, pageCount: 12, tg});
				} else {
					const act: string = cookies.get("act");

					response = await getChatList({page, pageCount: 12, token: act});
				}

				setChats(response.records);
				setTotalPages(response.totalPages);
				setLoading(false);
			} catch (e) {
				console.error('Messages', e);
			}
		}

		getData();
	}, [page, tg]);

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