const dotenv = require('dotenv');

module.exports = (path) => {
	const envs = dotenv.config({
		path
	}).parsed;

	const envKeys = {
		"process.env": Object.keys(envs).reduce((env, key) => {
			env[key] = JSON.stringify(envs[key])
			return env
		}, {}),
	}

	return envKeys
}