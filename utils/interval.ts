


export const interval = (callback: () => void, delay: number) => {
	let timer: ReturnType<typeof setInterval> | null = null;

	const start = () => {
		stop();
		timer = setInterval(callback, delay);
	};

	const stop = () => {
		if (timer) {
			clearInterval(timer);
		}
	};

	return { start, stop };
}
