type LiveHeadPositionProps = {
	horizontal: number;
	vertical: number;
	rotate: number;
	pst_txt: string;
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
	z: number;
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
	rotate: number;
	angular: number,
	pst_txt: string,
	duration: number,
}

export { type LiveHeadPositionProps, type LiveRecorded, type MakerCursorProps, type JPSCommonInfo, type JPSRecordDataProp }