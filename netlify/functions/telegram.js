
exports.handler = async (event) => {
	try {
		// 1. Парсим данные формы
		const { name, email, message } = JSON.parse(event.body || "{}");

		// 2. Формируем текст сообщения
		const text = `
📩 Новая заявка:

👤 Имя: ${name || "-"}
📧 Email: ${email || "-"}
💬 Сообщение: ${message || "-"}
`;

		// 3. Берём переменные окружения
		const TOKEN = process.env.TELEGRAM_TOKEN;
		const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

		if (!TOKEN || !CHAT_ID) {
			console.log("Missing env vars", { TOKEN, CHAT_ID });

			return {
				statusCode: 500,
				body: JSON.stringify({
					error: "Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID"
				})
			};
		}

		// 4. URL Telegram API
		const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

		// 5. Отправка сообщения в Telegram
		const tgResponse = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text
			})
		});

		const result = await tgResponse.json();

		// 6. Лог ответа Telegram (очень важно для дебага)
		console.log("TELEGRAM RESPONSE:", result);

		// 7. Если Telegram вернул ошибку
		if (!tgResponse.ok) {
			return {
				statusCode: 500,
				body: JSON.stringify({
					error: "Telegram API error",
					details: result
				})
			};
		}

		// 8. Успешный ответ
		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				telegram: result
			})
		};

	} catch (error) {
		console.log("FUNCTION ERROR:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				error: error.message
			})
		};
	}
};