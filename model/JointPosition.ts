type LiveHeadPositionProps = {
	horizontal: number;
	vertical: number;
	current: string;
}

interface LiveRecorded extends LiveHeadPositionProps {
	id: string;
	time?: string;
	angular: number;
}

type MakerCursorProps = {
	id: string;
	x: number;
	y: number;
	z?: string;
}

type JPSCommonInfo = {
	key: string,
	idSession: string,
	nowObj: {
		localShortDateTime: string,
		strNow: string
	}
}

type JPSRecordDataProp = {
	//id, key, id_session, title, date, horizontal, vertical, angular, current, duration
	id: number,
	key: string,
	id_session: string,
	id_record: number,
	date: string,
	title: string,
	horizontal: number,
	horizontalScale: number,
	vertical: number,
	verticalScale: number,
	angular: number,
	current: string,
	duration: number,
}

export { type LiveHeadPositionProps, type LiveRecorded, type MakerCursorProps, type JPSCommonInfo, type JPSRecordDataProp }