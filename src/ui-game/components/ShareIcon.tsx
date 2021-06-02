import React, { useCallback } from "react"
import styled from "styled-components"
import shareIcon from "../../../assets/upload.png"
import copy from "copy-to-clipboard"
import { message } from "antd"

const ShareIconContainer = styled.div`
	cursor: pointer;
`

const ShareIconImage = styled.img`
	width: 100%;
	height: auto;
`

export const ShareIcon = ({ style, className }: { style?: React.CSSProperties; className?: string }) => {
	const onClick = useCallback(() => {
		copy(window.location.href)
		message.info(`copied to clipboard`)
	}, [])

	return (
		<ShareIconContainer style={style} className={className} onClick={onClick}>
			<ShareIconImage src={shareIcon} />
		</ShareIconContainer>
	)
}
