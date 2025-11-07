type Combobox = {
	prop: string,
	name: string
}

const TimeOptions: Combobox[] = [
	{ prop: "all", name: "All Time" },
	{ prop: "last_week", name: "Last Week" },
	{ prop: "last_month", name: "Last Month" },
	{ prop: "last_3_month", name: "Last 3 Month" }
];

const MetricOptions: Combobox[] = [
	{ prop: "all", name: "All Metrics" },
	{ prop: "rom", name: "ROM Only" },
	{ prop: "jps", name: "JPS Only" },
];

export { type Combobox, TimeOptions, MetricOptions }