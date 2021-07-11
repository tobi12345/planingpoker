import React from "react"
import styled from "styled-components"
import cardLogo from "../../../assets/ace-of-diamonds.png"

const CardLogoImg = styled.img`
	width: 200px;
	height: auto;
`

export const CardLogo = ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
	return <CardLogoImg src={cardLogo} style={style} className={className} />
}
