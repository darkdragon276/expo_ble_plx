export const getCurrentDateTime = (): any => {
	const now = new Date();

	const pad = (n: number) => (n < 10 ? "0" + n : n);

	const year = now.getFullYear();
	const month = pad(now.getMonth() + 1);
	const date = pad(now.getDate());

	const hours = pad(now.getHours());
	const minutes = pad(now.getMinutes());
	const seconds = pad(now.getSeconds());

	const localDateTime = now.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return {
		year,
		month,
		date,
		hours,
		minutes,
		seconds,
		localDateTime,
	}
};
