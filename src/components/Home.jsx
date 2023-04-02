import { Layout } from 'antd';
import { default as React, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderContent from './Header';
import SiderContent from './Sider';
import { getMessagingToken } from '../firebase';
import axiosClient from '../axios';

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
	textAlign: 'center',
	color: '#fff',
	height: 72,
	paddingInline: 50,
	paddingLeft: 56,
	lineHeight: '72px',
	backgroundColor: 'white'
};
const contentStyle = {
	textAlign: 'center',
	minHeight: 'calc(100vh - 64px)',
	backgroundColor: '#F3F4F6',
	padding: '16px'
};
const siderStyle = {
	minHeight: 'calc(100vh - 64px)',
	backgroundColor: 'white',
	paddingTop: '12px'
};

const Home = (props) => {
	const navigate = useNavigate();
	useEffect(() => {
		const registerDevice = async () => {
			const fcmClientToken = await getMessagingToken();
			axiosClient.post('/register-device', { token: fcmClientToken })
		}
		const token = localStorage.getItem('token');
		if (!token) navigate('/login');
		else {
			registerDevice();
		}
	}, []);

	return (
		<Layout>
			<Header className="header" style={headerStyle}>
				<HeaderContent />
			</Header>
			<Layout>
				<Sider breakpoint="lg" collapsedWidth="0" style={siderStyle}>
					<SiderContent />
				</Sider>
				<Content style={contentStyle}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

Home.propTypes = {};

export default Home;
