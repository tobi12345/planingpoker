import { Button, Form, Input, message } from "antd"
import React, { useEffect } from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { AUTH_TOKEN_KEY, useLogin } from "../hooks/useLogin"
import { decode } from "jsonwebtoken"
import { CardLogo } from "../../ui-shared/components/CardLogo"

const LoginContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const ContentContainer = styled.div`
	width: 80%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
`

const FormContainer = styled.div`
	width: 100%;
	max-width: 400px;
`

export const Login = () => {
	const [form] = Form.useForm()
	const history = useHistory()

	useEffect(() => {
		const token = localStorage.getItem(AUTH_TOKEN_KEY)

		if (token) {
			const exp = (decode(token, { json: true })?.exp as number) ?? 0
			if (exp <= Date.now()) {
				history.replace("/")
			} else {
				localStorage.removeItem(AUTH_TOKEN_KEY)
			}
		}
	}, [history])

	const [login, { status }] = useLogin({
		onSuccess: (token) => {
			localStorage.setItem(AUTH_TOKEN_KEY, token)
			history.replace("/")
		},
		onError: (error) => {
			message.error(error.response?.data.error)
		},
	})

	return (
		<LoginContainer>
			<ContentContainer>
				<CardLogo />
				<FormContainer>
					<Form
						size="large"
						initialValues={{
							email: "",
							password: "",
						}}
						onFinish={(payload) => login(payload)}
						layout="vertical"
						form={form}
					>
						<Form.Item
							name="email"
							label="EMail"
							rules={[{ required: true, message: "Please input your email!" }]}
						>
							<Input placeholder="EMail" />
						</Form.Item>
						<Form.Item
							name="password"
							label="Password"
							rules={[{ required: true, message: "Please input your password!" }]}
						>
							<Input type="password" placeholder="Password" />
						</Form.Item>
						<div style={{ display: "flex" }}>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									disabled={status === "loading"}
									loading={status === "loading"}
								>
									Login
								</Button>
							</Form.Item>
						</div>
					</Form>
				</FormContainer>
			</ContentContainer>
		</LoginContainer>
	)
}
