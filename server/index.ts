const requireWithoutCache = (name) => {
	let p = require.resolve(name)
	if (require.cache[p]) {
			delete require.cache[p]
	}
	return require(name)
}

export class MailjetAddon {
	public static displayName = "Mailjet";
	public static logo = "https://pbs.twimg.com/profile_images/811557097758461952/Q679jb7i.jpg";

	public static installSettings = [
	];

	constructor(app, config) { }

	start() {
	}

	uninstall(app) { }
}