exports.handler = async (event) => {
	const { name, email, message } = JSON.parse(event.body);

	const text = `
Новая заявка:

Имя: ${name}
Email: ${email}
Сообщение: ${message}
`;

	const TOKEN = process.env.TELEGRAM_TOKEN;
	const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

	const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

	try {
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text
			})
		});

		return {
			statusCode: 200,
			body: 'OK'
		};

	} catch (error) {
		return {
			statusCode: 500,
			body: 'Error'
		};
	}
};