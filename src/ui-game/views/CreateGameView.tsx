import { Button, Divider, Form, Input, Typography } from "antd"
import { useForm } from "antd/lib/form/Form"
import { formatTimeStr } from "antd/lib/statistic/utils"
import React, { useEffect } from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { useCreateGame } from "../hooks/data/useCreateGame"

const JoinGameContainer = styled.div`
	padding-top: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const StyledForm = styled(Form)`
	width: 500px;
`
const DEFAULT_CARDS = ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "☕"]

export const CreateGameView = () => {
	const [form] = useForm()
	const history = useHistory()

	const [createGame, { isLoading }] = useCreateGame({
		onSuccess: ({ game }) => {
			history.push(`/${game.id}`)
		},
	})

	return (
		<JoinGameContainer>
			<StyledForm
				layout="vertical"
				form={form}
				onFinish={(values: any) =>
					createGame({
						player: { name: values.playerName },
						config: { cards: values.cards?.split(",") ?? DEFAULT_CARDS },
					})
				}
				requiredMark="optional"
			>
				<Typography.Title level={2}>New Planing Poker Session</Typography.Title>
				<Form.Item
					label="Your Name"
					name="playerName"
					required={true}
					rules={[{ required: true, message: "Please enter your name", pattern: /.{3,}/ }]}
				>
					<Input placeholder="e.g. Lukas P" />
				</Form.Item>
				<Divider />
				<Typography.Title level={4}>Game Settings</Typography.Title>
				<Form.Item label="Custom Card Values" name="cards">
					<Input placeholder="Cards coma seperated e.g. 1,2,10,100,🐕" />
				</Form.Item>
				<Divider />
				<Form.Item shouldUpdate>
					{() => (
						<Button
							type="primary"
							htmlType="submit"
							loading={isLoading}
							disabled={
								!form.isFieldsTouched(["playerName"]) ||
								form.getFieldsError().some((item) => item.errors.length > 0)
							}
						>
							Submit
						</Button>
					)}
				</Form.Item>
			</StyledForm>
		</JoinGameContainer>
	)
}
