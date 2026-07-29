import { useEffect, useState } from 'react';

export function useTelegram() {
	const [tg, setTg] = useState<any>(null);

	useEffect(() => {
		if ((window as any).Telegram?.WebApp) {
			const webApp = (window as any).Telegram.WebApp;
			webApp.ready(); // сообщаем Telegram, что приложение готово
			webApp.expand(); // раскрыть на весь экран (опционально)
			setTg(webApp);
		}
	}, []);

	return tg;
}