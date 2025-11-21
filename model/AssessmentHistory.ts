import { Combobox } from "../dummy/masterData"

type DataHistory = {
	xIndex: number,
	id: string,
	key: string,
	dt: Date,
	date: string,
	date_n: number,
	date_str: string,
	time_str: string,
	title: string,
	extension: number,
	flexion: number,
	l_rotation: number,
	r_rotation: number,
	l_lateral: number,
	r_lateral: number,
	duration: number,
	type: string,
}

type JPSDataHistory = {
	xIndex: number,
	id: string,
	key: string,
	dt: Date,
	date: string,
	date_n: number,
	date_str: string,
	time_str: string,
	title: string,
	horizontal: number,
	vertical: number,
	rotate: number,
	angular: number,
	pst_txt: number,
	duration: number,
}

type ComboboxFilter = {
	metric: Combobox,
	time: Combobox,
}

export { type DataHistory, type JPSDataHistory, type ComboboxFilter }