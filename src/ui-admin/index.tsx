import * as React from "react"
import * as ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"
import { App } from "./App"
import "antd/dist/antd.css"

const GlobalStyles = createGlobalStyle`
	body {
		margin: 0;
	}
	#root {
		height: 100%;
	}
`

ReactDOM.render(
	<>
		<GlobalStyles />
		<App />
	</>,
	document.getElementById("root"),
)
