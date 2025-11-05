const useConvertDateTime = (date?: Date): any => {

	if (!date || isNaN(date.getTime())) return "";

	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();

	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");

	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;

	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	};

	const date_MM_dd_yyyy_hh_mm_ss_ampm = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
	const date_MM_dd_yyyy_at_hh_mm_ampm = `${month}/${day}/${year} at ${hours}:${minutes}:${ampm}`;
	const date_short = Intl.DateTimeFormat("en-US", options).format(date).toString().replace(" at", ",");

	return {
		date_MM_dd_yyyy_hh_mm_ss_ampm,
		date_MM_dd_yyyy_at_hh_mm_ampm,
		date_short
	}
}

export default useConvertDateTime;
