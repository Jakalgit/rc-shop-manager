import React from "react";
import {Chat} from "../../../Chat";
import styles from './ChatMessagesTg.module.css';
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const ChatMessagesTg = React.memo(() => {

	const navigate = useNavigate();

	const backOnClick = React.useCallback(() => {
		navigate(`/chats-tg`);
	}, [navigate]);

	return (
		<main className={styles.main}>
			<Container fluid className={styles.buttonLine}>
				<Button
					onClick={backOnClick}
					variant='info'
				>
					Назад
				</Button>
			</Container>
			<Chat fromTg />
		</main>
	)
})