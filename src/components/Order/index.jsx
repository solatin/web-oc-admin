import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axiosClient from '../../axios';
import { Button, Col, Table, Divider, message, Row, Space, Tooltip, Typography, Popover } from 'antd';
import { ReactComponent as EyeIcon } from '../../assets/eye.svg';
import { ReactComponent as MoreOverIcon } from '../../assets/moreover.svg';
import { formatCurrency, formatDate } from '../../utils';
import OrderModal from './OrderModal';

export const getSrc = (path) => `http://localhost:3000/${path}`;

export const STATUS = {
	pending: { text: 'Chờ duyệt', color: '#4096ff' },
	confirmed: { text: 'Đã xác nhận', color: '#36cfc9' },
	delivery: { text: 'Đang giao', color: '#d4b106' },
	done: { text: 'Hoàn thành', color: '#73d13d' },
	cancel: { text: 'Đã huỷ', color: '#ff7875' }
};

const onChange = (pagination, filters, sorter, extra) => {
	console.log('params', pagination, filters, sorter, extra);
};
const Order = (props) => {
	const [orders, setOrders] = useState([]);
	const [selectingOrder, setSelectingOrder] = useState(null);

	const fetch = async () => {
		try {
			const rs = await axiosClient.get('/orders');

			setOrders(rs.map((el) => ({ ...el, code: `DH${el._id.slice(-5)}` })));
		} catch (e) {
			message.error('Lỗi');
		}
	};
	useEffect(() => {
		fetch();
	}, []);

	const onUpdateCoupon = async (data, id) => {
		try {
			await axiosClient.put(`/orders/${id}`, data);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};
	const onDeleteCoupon = async (id) => {
		try {
			await axiosClient.delete(`/orders/${id}`);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const columns = [
		{
			title: 'Đơn hàng',
			dataIndex: 'code',
			render: (text, record) => (
				<>
					<div className="text-primary">{text}</div>
					<div>
						{record.productInfos.reduce((prev, cur) => prev + cur.amount, 0) +
							(record.coupon.approved ? record.coupon?.detail?.productInfos?.length || 0 : 0)} 
						{''} món
					</div>
				</>
			)
		},
		{
			title: 'Khách hàng',
			dataIndex: 'customerInfo',
			render: (record) => (
				<>
					<b>{record.name}</b>
					<div>{record.phone}</div>
				</>
			)
		},
		{
			title: 'Hình thức lấy hàng',
			dataIndex: 'shippingMethod',
			filters: [
				{
					text: 'Giao hàng',
					value: 'delivery'
				},
				{
					text: 'Nhận tại cửa hàng',
					value: 'atStore'
				}
			],
			render: (text, record) =>
				text === 'delivery' ? (
					<>
						<div>
							<b>Giao hàng</b>
						</div>
						<div>{record.customerInfo.address}</div>
					</>
				) : (
					<b>Nhận tại cửa hàng</b>
				),
			onFilter: (value, record) => record.shippingMethod === value,
			sorter: (a, b) => a.shippingMethod.length - b.shippingMethod.length
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			filters: [
				{
					text: 'Chờ duyệt',
					value: 'pending'
				},
				{
					text: 'Xác nhận',
					value: 'confirmed'
				},
				{
					text: 'Giao hàng',
					value: 'delivery'
				},
				{
					text: 'Hoàn tất',
					value: 'done'
				},
				{
					text: 'Huỷ',
					value: 'cancel'
				}
			],
			render: (text) => (
				<span
					style={{
						padding: '4px 6px',
						color: 'white',
						fontWeight: 'bold',
						fontSize: 12,
						backgroundColor: STATUS[text].color,
						borderRadius: '5px'
					}}
				>
					{STATUS[text].text}
				</span>
			),
			onFilter: (value, record) => record.status === value,
			sorter: (a, b) => a.status.length - b.status.length
		},
		{
			title: 'Thời điểm đặt',
			dataIndex: 'time',
			render: (text) => formatDate(text),
			sorter: (a, b) => Date.parse(a.time) - Date.parse(b.time)
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalPrice',
			render: formatCurrency,
			sorter: (a, b) => a.totalPrice - b.totalPrice
		},
		{
			dataIndex: 'action',
			render: (text, record) => (
				<div className="d-flex gap-1">
					<Tooltip title="Xem chi tiết">
						<Button onClick={() => setSelectingOrder(record)} type="text" icon={<EyeIcon />} />
					</Tooltip>
					<Popover
						content={
							<div className="options d-flex column gap-1" style={{ alignItems: 'flex-start' }}>
								{Object.entries(STATUS).map(([key, obj]) => (
									<div
										className="option"
										style={{ color: obj.color, fontWeight: 'bold', cursor: 'pointer' }}
										key={key}
										onClick={() => onUpdateCoupon({ status: key }, record._id)}
									>
										{obj.text}
									</div>
								))}
							</div>
						}
						trigger="click"
						placement="bottom"
					>
						<Button type="text" icon={<MoreOverIcon />} />
					</Popover>
				</div>
			)
		}
	];

	return (
		<div>
			<div className="d-flex" style={{ justifyContent: 'space-between' }}>
				<Typography.Title level={2} style={{ marginBottom: 0 }}>
					Đơn đặt hàng
				</Typography.Title>
			</div>

			<Divider />
			<div style={{ border: '1px solid #D1D5DA', borderRadius: '1px' }}>
				<Table size="small" columns={columns} dataSource={orders} onChange={onChange} />
			</div>
			<OrderModal item={selectingOrder} setSelectingOrder={setSelectingOrder}/>
		</div>
	);
};

Order.propTypes = {};

export default Order;
