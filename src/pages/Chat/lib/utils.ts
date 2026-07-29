"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

export function useChatSocket(clientId: string) {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}/ws/chat`, {
			transports: ["websocket"],
			auth: {
				clientId,
			},
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, []);

	return socketRef;
}