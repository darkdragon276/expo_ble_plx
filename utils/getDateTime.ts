export const getCurrentDateTime = (): any => {
	const now = new Date();
	const pad = (n: number) => (n < 10 ? "0" + n : n);

	const year = now.getFullYear();
	const month = pad(now.getMonth() + 1);
	const date = pad(now.getDate());

	const hours = pad(now.getHours());
	const minutes = pad(now.getMinutes());
	const seconds = pad(now.getSeconds());

	const options: Intl.DateTimeFormatOptions = {
		month: "short",   // Oct
		day: "2-digit",   // 04
		hour: "2-digit",  // 08
		minute: "2-digit",// 44
		hour12: true,     // AM/PM format
	};

	const localShortDateTime = Intl.DateTimeFormat("en-US", options).format(now).toString().replace(" at", ",");
	const strNow = now.toString();

	return {
		strNow,
		year,
		month,
		date,
		hours,
		minutes,
		seconds,
		localShortDateTime,
	}
};
