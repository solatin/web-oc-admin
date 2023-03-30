import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const HeaderContent = (props) => {
	const navigate = useNavigate()
	const logout = () => {
		localStorage.clear()
		navigate('/login')
	}
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				height: '100%',
				gap: '16px'
			}}
		>
			<img style={{ aspectRatio: '1/1', borderRadius: '50%' }} src="/favi.jpeg" width={36} height={36} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginRight: 'auto',
					alignItems: 'flex-start'
				}}
			>
				<Text style={{fontSize: '14px'}} strong>ỐC NGON HAI DŨNG</Text>
				<a href='/' style={{ lineHeight: '16px', color: '#F97A3C' }}>
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 24 24"
						height="1em"
						width="1em"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g>
							<path fill="none" d="M0 0h24v24H0z"></path>
							<path d="M21 13.242V20h1v2H2v-2h1v-6.758A4.496 4.496 0 0 1 1 9.5c0-.827.224-1.624.633-2.303L4.345 2.5a1 1 0 0 1 .866-.5H18.79a1 1 0 0 1 .866.5l2.702 4.682A4.496 4.496 0 0 1 21 13.242zm-2 .73a4.496 4.496 0 0 1-3.75-1.36A4.496 4.496 0 0 1 12 14.001a4.496 4.496 0 0 1-3.25-1.387A4.496 4.496 0 0 1 5 13.973V20h14v-6.027zM5.789 4L3.356 8.213a2.5 2.5 0 0 0 4.466 2.216c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 0 0 4.644 0c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 1 0 4.457-2.232L18.21 4H5.79z"></path>
						</g>
					</svg>
					Xem cửa hàng của tôi
				</a>
			</div>
			<Button type="button" style={{ border: '1px solid gray', height: 'auto', margin: '2px', borderRadius: '2px' }} onClick={logout}>
				Nguyễn Tiến Sĩ [Chủ shop] <br/>  <Text strong>Đăng xuất</Text>
			</Button>
		</div>
	);
};

HeaderContent.propTypes = {};

export default HeaderContent;
