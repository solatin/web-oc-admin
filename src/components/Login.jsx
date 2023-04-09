import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

const Login = () => {
  const navigate = useNavigate()
	const onFinish = async (values) => {
		try {
			const rs = await axiosClient.post('/login', values);
      localStorage.setItem('token', rs.accessToken)
      message.success('Đăng nhập thành công')
      navigate('/app')
		} catch (e) {
      console.log(e)
			notification.error({
				message: `Đăng nhập thất bại`,
				description: 'Vui lòng kiểm tra lại email và mật khẩu',
				placement: 'topRight'
			});
		}
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				backgroundImage: 'url("https://www.ocngonhaidung.com:8443/login-background.png")',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Form
				name="basic"
				layout="vertical"
				// labelCol={{
				// 	span: 8
				// }}
				// wrapperCol={{
				// 	span: 16
				// }}
				style={{
					maxWidth: 600,
					background: 'white',
					borderRadius: '5px',
					padding: '18px 18px',
          minWidth: 300
				}}
				initialValues={{
					remember: true
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				// autoComplete="off"
			>
				<div style={{ textAlign: 'center', marginBottom: '24px' }}>
					<b style={{ fontSize: '24px', color: 'black', margin: 'auto' }}>Đăng nhập</b>
				</div>

				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Please input your username!'
						}
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Mật khẩu"
					name="password"
					rules={[
						{
							required: true,
							message: 'Please input your password!'
						}
					]}
				>
					<Input.Password />
				</Form.Item>

				{/* <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

				<Form.Item
					wrapperCol={{
						offset: 5,
						span: 16
					}}
				>
					<Button type="primary" htmlType="submit">
						Đăng nhập cửa hàng
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
export default Login;
