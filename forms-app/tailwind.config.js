const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	important: "#root",
	theme: {
		extend: {},
	},
	plugins: [],
});