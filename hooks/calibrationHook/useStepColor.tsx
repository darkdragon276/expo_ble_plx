const useStepColor = ({ status }: any) => {
	let statusColor =
		status === "done"
			? "bg-green-100 border-green-500"
			: status === "active"
				? "bg-blue-100 border-blue-500"
				: "bg-gray-100 border-gray-300";

	let textColor =
		status === "done"
			? "text-green-700"
			: status === "active"
				? "text-blue-700"
				: "text-gray-600";

	return {
		statusColor,
		textColor,
	}
}

export default useStepColor