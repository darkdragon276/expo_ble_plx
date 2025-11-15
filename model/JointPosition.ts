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

export { type LiveHeadPositionProps, type LiveRecorded, type MakerCursorProps }