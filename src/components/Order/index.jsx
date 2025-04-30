import { Button, Divider, message, Popover, Table, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ReactComponent as EyeIcon } from '../../assets/eye.svg';
import { ReactComponent as MoreOverIcon } from '../../assets/moreover.svg';
import axiosClient from '../../axios';
import { formatCurrency, formatDate } from '../../utils';
import OrderModal from './OrderModal';


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
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0
	});
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({});
	const [sorter, setSorter] = useState({});

	const fetch = async (page = pagination.current, pageSize = pagination.pageSize, newFilters = filters, newSorter = sorter) => {
		setLoading(true);
		try {
			// Convert filters to query params
			const filterParams = Object.entries(newFilters).reduce((acc, [key, value]) => {
				if (value) {
					acc[key] = Array.isArray(value) ? value.join(',') : value;
				}
				return acc;
			}, {});

			// Handle single column sorting
			const sortParams = newSorter?.field && newSorter?.order 
				? {
					sortField: newSorter.field,
					sortOrder: newSorter.order
				}
				: {};

			const params = {
				page,
				limit: pageSize,
				...filterParams,
				...sortParams
			};

			const { data, total } = await axiosClient.get('/orders', { params });

			setOrders(data.map((el) => ({ ...el, code: `DH${el._id.slice(-5)}` })));
			setPagination(prev => ({
				...prev,
				total
			}));
		} catch (e) {
			message.error('Lỗi');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetch();
	}, []);

	const handleTableChange = (newPagination, newFilters, newSorter) => {
		setFilters(newFilters);
		setSorter(newSorter);
		fetch(newPagination.current, newPagination.pageSize, newFilters, newSorter);
		setPagination(newPagination);
	};

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
		},
		{
			title: 'Thời điểm đặt',
			dataIndex: 'time',
			render: (text) => formatDate(text),
			sorter: true,
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalPrice',
			render: formatCurrency,
			sorter: true,
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
			<div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography.Title level={2} style={{ marginBottom: 0 }}>
					Đơn đặt hàng
				</Typography.Title>
				<Button type="primary" onClick={() => fetch()}>Làm mới</Button>
			</div>

			<Divider />
			<div style={{ border: '1px solid #D1D5DA', borderRadius: '1px' }}>
				<Table 
					size="small" 
					columns={columns} 
					dataSource={orders} 
					onChange={handleTableChange}
					pagination={{
						...pagination,
						position: ['topRight', 'bottomRight'],
						showSizeChanger: true,
						pageSizeOptions: ['10', '20', '50', '100'],
						showTotal: (total) => `Tổng ${total} đơn hàng`
					}}
					loading={loading}
				/>
			</div>
			<OrderModal item={selectingOrder} setSelectingOrder={setSelectingOrder}/>
		</div>
	);
};

Order.propTypes = {};

export default Order;
