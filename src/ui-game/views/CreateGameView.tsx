import { Button, Divider, Form, Input } from "antd"
import { useForm } from "antd/lib/form/Form"
import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { useCreateGame } from "../hooks/data/useCreateGame"

const JoinGameContainer = styled.div`
	margin-top: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const initialFormValues = { playerName: "" }

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
			<Form
				layout="vertical"
				initialValues={initialFormValues}
				form={form}
				onFinish={(values) => createGame({ player: { name: values.playerName } })}
			>
				<Form.Item
					label="Name"
					name="playerName"
					rules={[{ required: true, message: "Please enter your name" }]}
				>
					<Input />
				</Form.Item>
				<Divider />
				<Form.Item shouldUpdate>
					{() => (
						<Button
							type="primary"
							htmlType="submit"
							loading={isLoading}
							disabled={
								!form.isFieldsTouched(true) ||
								!!form.getFieldsError().filter(({ errors }) => errors.length).length
							}
						>
							Submit
						</Button>
					)}
				</Form.Item>
			</Form>
		</JoinGameContainer>
	)
}
