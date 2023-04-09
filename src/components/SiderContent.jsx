import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { ReactComponent as DishIcon } from '../assets/dish.svg';
import { ReactComponent as CouponIcon } from '../assets/coupon.svg';
import { ReactComponent as SettingsIcon } from '../assets/settings.svg';
import { ReactComponent as OrderIcon } from '../assets/coupon.svg';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const items = [
	{
		label: 'Đơn hàng',
		key: 'orders',
		icon: <OrderIcon />
	},
	{
		label: 'Món ăn',
		key: 'dishes',
		icon: <DishIcon />
	},
	{
		label: 'Khuyến mãi',
		key: 'coupons',
		icon: <CouponIcon />
	},
	{
		label: 'Cài đặt giao diện',
		key: 'layout-settings',
		icon: <SettingsIcon />
	}
];
const SiderContent = () => {
	const navigate = useNavigate();
	const [current, setCurrent] = useState('');
	const onClick = (e) => {
		navigate(e.key);
		setCurrent(e.key);
	};
	const location = useLocation();
	useEffect(() => {
		const currentTab = location.pathname.split('/')[2];

		if (currentTab) setCurrent(currentTab);
	}, [location]);
	return <Menu className="menu" onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />;
};
export default SiderContent;
