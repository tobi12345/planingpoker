import React from "react"
import styled from "styled-components"
import cardLogo from "../../../assets/ace-of-diamonds.png"

const CardLogoContainer = styled.div``

const CardLogoImg = styled.img`
	width: 200px;
	height: auto;
`

export const CardLogo = ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
	return (
		<CardLogoContainer style={style} className={className}>
			<CardLogoImg src={cardLogo} />
		</CardLogoContainer>
	)
}
