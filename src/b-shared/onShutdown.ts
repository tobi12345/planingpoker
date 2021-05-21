export const onShutdown = () => {
	return new Promise<void>((resolve) => {
		process.once("SIGINT", () => {
			console.log("Shutting down")
			resolve()
		})
	})
}