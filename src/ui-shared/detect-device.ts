const userAgent = window.navigator.userAgent.toLowerCase()
const findInUserAgent = (query: string) => userAgent.indexOf(query) !== -1
export const deviceDetector = {
	macos: () => findInUserAgent("mac"),
	ios: () => deviceDetector.iphone() || deviceDetector.ipod() || deviceDetector.ipad(),
	iphone: () => !deviceDetector.windows() && findInUserAgent("iphone"),
	ipod: () => findInUserAgent("ipod"),
	ipad: () => findInUserAgent("ipad") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
	android: () => !deviceDetector.windows() && findInUserAgent("android"),
	androidPhone: () => deviceDetector.android() && findInUserAgent("mobile"),
	androidTablet: () => deviceDetector.android() && !findInUserAgent("mobile"),
	blackberry: () => findInUserAgent("blackberry") || findInUserAgent("bb10"),
	blackberryPhone: () => deviceDetector.blackberry() && !findInUserAgent("tablet"),
	blackberryTablet: () => deviceDetector.blackberry() && findInUserAgent("tablet"),
	windows: () => findInUserAgent("windows"),
	windowsPhone: () => deviceDetector.windows() && findInUserAgent("phone"),
	windowsTablet: () => deviceDetector.windows() && findInUserAgent("touch") && !deviceDetector.windowsPhone(),
	fxos: () => (findInUserAgent("(mobile") || findInUserAgent("(tablet")) && findInUserAgent(" rv:"),
	fxosPhone: () => deviceDetector.fxos() && findInUserAgent("mobile"),
	fxosTablet: () => deviceDetector.fxos() && findInUserAgent("tablet"),
	meego: () => findInUserAgent("meego"),
	mobile: () =>
		deviceDetector.androidPhone() ||
		deviceDetector.iphone() ||
		deviceDetector.ipod() ||
		deviceDetector.windowsPhone() ||
		deviceDetector.blackberryPhone() ||
		deviceDetector.fxosPhone() ||
		deviceDetector.meego(),
	tablet: () =>
		deviceDetector.ipad() ||
		deviceDetector.androidTablet() ||
		deviceDetector.blackberryTablet() ||
		deviceDetector.windowsTablet() ||
		deviceDetector.fxosTablet(),
	desktop: () => !deviceDetector.tablet() && !deviceDetector.mobile(),
}

export const getDevice = (): "desktop" | "tablet" | "smartphone" | "other" =>
	deviceDetector.desktop()
		? "desktop"
		: deviceDetector.tablet()
		? "tablet"
		: deviceDetector.mobile()
		? "smartphone"
		: "other"
