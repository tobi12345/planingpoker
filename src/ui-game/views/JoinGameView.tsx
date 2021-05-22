import { Button, Divider, Form, Input } from "antd"
import { useForm } from "antd/lib/form/Form"
import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { CreatePlayerPayload } from "../../types-shared/game"
import { useCreatePlayer } from "../hooks/data/useCreatePlayer"

const JoinGameContainer = styled.div`
	margin-top: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const initialFormValues: CreatePlayerPayload = { name: "" }

export const JoinGameView = ({ gameID }: { gameID: string }) => {
	const [form] = useForm()
	const history = useHistory()

	const [createPlayer, { isLoading }] = useCreatePlayer()

	return (
		<JoinGameContainer>
			<Form
				layout="vertical"
				initialValues={initialFormValues}
				form={form}
				onFinish={(values) => createPlayer({ payload: values, gameID })}
			>
				<Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
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
