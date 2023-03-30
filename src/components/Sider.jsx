import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { ReactComponent as DishIcon } from '../assets/dish.svg';
import { ReactComponent as CouponIcon } from '../assets/coupon.svg';
import { ReactComponent as OrderIcon } from '../assets/coupon.svg';
import { Menu } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const items = [
  {
    label: 'Đơn hàng',
    key: 'orders',
    icon: <OrderIcon />,
  },
  {
    label: 'Món ăn',
    key: 'dishes',
    icon: <DishIcon />,
  },
  {
    label: 'Khuyến mãi',
    key: 'coupons',
    icon: <CouponIcon />,
  },

];
const SiderContent = () => {
  const navigate=  useNavigate()
  const [current, setCurrent] = useState('orders');
  const onClick = (e) => {
    navigate(e.key)
    setCurrent(e.key);
  };
  return <Menu className='menu' onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />;
};
export default SiderContent;