import React, {useState} from 'react';
import {Button, Col, Container, InputGroup, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import styles from "../styles/pages/Login.module.css";
import {useAuth} from "../components/AuthContext.tsx";
import {auth} from "../api/authApi.ts";

const Login: React.FC = () => {

	const {signIn} = useAuth();

	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const sendCredentials = async () => {
		try {
			const response = await auth(login, password);
			signIn(response.act);
		} catch (e: any) {
			alert(`Error: ${e.response.data.message}`)
		}
	}

	return (
		<div className="hWrap">
			<Container>
				<Row>
					<Col
						className={styles.form}
						lg={{ offset: 4, span: 4 }}
						xs={{ span: 8, offset: 2 }}
					>
						<h1 style={{ textAlign: "center" }}>
							WORK-RC
						</h1>
						<InputGroup>
							<Form.Control
								value={login}
								onChange={(e) => setLogin(e.target.value)}
								placeholder="Login"
								aria-label="Login"
								aria-describedby="Input for login"
							/>
						</InputGroup>
						<InputGroup>
							<Form.Control
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								placeholder="Password"
								aria-label="Password"
								aria-describedby="Input for password"
							/>
						</InputGroup>
						<Button
							onClick={sendCredentials}
							variant="primary"
						>
							Sign In
						</Button>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Login;