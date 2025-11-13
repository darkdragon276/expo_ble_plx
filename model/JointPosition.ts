type LiveHeadPositionProps = {
	horizontal: number;
	vertical: number;
	current: string;
}

interface LiveRecorded extends LiveHeadPositionProps {
	id: string
}

export { type LiveHeadPositionProps, type LiveRecorded }