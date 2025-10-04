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
		month: "short",   // Oct
		day: "2-digit",   // 04
		hour: "2-digit",  // 08
		minute: "2-digit",// 44
		hour12: true,     // AM/PM format
	};

	const date_dd_MM_yyyy_hh_mm_ss_ampm = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
	const date_dd_MM_yyyy_at_hh_mm_ampm = `${day}/${month}/${year} at ${hours}:${minutes}:${ampm}`;
	const date_short = Intl.DateTimeFormat("en-US", options).format(date).toString().replace(" at", ",");
	//console.log(`${date_dd_MM_yyyy_hh_mm_ss_ampm} - ${date_dd_MM_yyyy_at_hh_mm_ampm} - ${date_short}`)
	return {
		date_dd_MM_yyyy_hh_mm_ss_ampm,
		date_dd_MM_yyyy_at_hh_mm_ampm,
		date_short
	}
}

export default useConvertDateTime;
