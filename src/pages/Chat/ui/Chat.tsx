import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React from "react";
import {Container} from "react-bootstrap";
import {ChatContainer, MainContainer, Message, MessageInput, MessageList} from "@chatscope/chat-ui-kit-react";
import {getChatMessages, sendMessage, sendMessageFromTg} from "../../../api/chat/api.ts";
import {useParams} from "react-router-dom";
import type {ChatMessage} from "../../../api/chat/types.ts";
import Cookies from "universal-cookie";
import {useChatSocket} from "../lib/utils.ts";
import {useTelegram} from "../../../shared/hooks/useTelegram.ts";

interface ChatProps {
	fromTg?: boolean;
}

export const Chat: React.FC<ChatProps> = React.memo(({ fromTg }) => {

	const tg = useTelegram();

	const cookies = new Cookies();
	const params = useParams<{ clientId: string }>();
	const clientId = params.clientId || '';
	const socketRef = useChatSocket(clientId);

	const [loading, setLoading] = React.useState<boolean>(true);
	const [messages, setMessages] = React.useState<ChatMessage[]>([]);
	const [messageText, setMessageText] = React.useState<string>('');
	const [loadingSend, setLoadingSend] = React.useState<boolean>(false);

	const handleClickSend = React.useCallback(async () => {
		try {
			if (loadingSend) return;
			setLoadingSend(true);

			if (fromTg) {
				await sendMessageFromTg({message: messageText, clientId, tg});
			} else {
				const act: string = cookies.get('act');

				await sendMessage({message: messageText, clientId, token: act});
			}

			setMessages(prev => [...prev, {message: messageText, fromUser: false}]);
			setMessageText('');
		} catch (e) {
			console.error(e);
			alert('Ошибка отправки сообщения');
		}
		setLoadingSend(false);
	}, [messageText, loadingSend])

	React.useEffect(() => {
		async function getData() {
			try {
				const response = await getChatMessages({clientId});

				setMessages(response);
				setLoading(false);
			} catch (e) {
				console.error(e);
				alert('Ошибка получения данных');
			}
		}

		getData();
	}, []);

	React.useEffect(() => {
		const socket = socketRef.current;
		if (!socket) return;

		const handler = (data: ChatMessage) => {
			if (!data.fromUser) return;
			setMessages((prev) => [...prev, data]);
		};

		socket.on("new-message", handler);

		return () => {
			socket.off("new-message", handler);
		};
	}, [])

	if (loading) {
		return <div>Загрузка...</div>
	}

	return (
		<Container fluid>
			<div style={{ position: "relative", height: fromTg ? "87vh" : "100vh" }}>
				<MainContainer>
					<ChatContainer>
						<MessageList>
							{messages.map((el, i) =>
								<Message
									key={i}
									model={{
										message: el.message,
										sender: "Joe",
										direction: el.fromUser ? 'incoming' : 'outgoing',
										position: 'normal'
									}}
								/>
							)}
						</MessageList>
						<MessageInput
							value={messageText}
							onChange={setMessageText}
							placeholder="Ввведите сообщение"
							onSend={handleClickSend}
						/>
					</ChatContainer>
				</MainContainer>
			</div>
		</Container>
	)
})