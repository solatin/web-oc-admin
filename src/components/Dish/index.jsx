import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axiosClient from '../../axios';
import { Button, Divider, message, Popconfirm, Rate, Space, Switch, Tooltip, Typography } from 'antd';
import { ReactComponent as StarIcon } from '../../assets/star.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as EditOutlined } from '../../assets/edit.svg';
import { formatCurrency } from '../../utils';
import CreateGroupLabelModal from './CreateGroupLabelModal';
import DishDrawer from './DishDrawer';
import { getSrc } from '../Coupon';

const Dish = (props) => {
	const [labelGroups, setLabelGroups] = useState([]);
	const [editingLabelGroup, setEditingLabelGroup] = useState(null);
	const [currentGroupLabelId, setCurrentGroupLabelId] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);

	const fetch = async () => {
		try {
			const rs = await axiosClient.get('/group-labels');
			setLabelGroups(rs);
		} catch (e) {
			message.error('Lỗi');
		}
	};
	useEffect(() => {
		fetch();
	}, []);

	const onCreateGroupLabel = async ({ name, priority = 0 }) => {
		try {
			await axiosClient.post('/group-labels', { name, priority });
			await fetch();
			window.scrollTo(0, document.body.scrollHeight);
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onUpdateGroupLabel = async (data, id) => {
		try {
			await axiosClient.put(`/group-labels/${id}`, data);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onDeleteGroupLabel = async (id) => {
		try {
			await axiosClient.delete(`/group-labels/${id}`);
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onCreateProduct = async (formData) => {
		try {
			await axiosClient.post('/products', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		}
	};

	const onUpdateProduct = async (formData, id) => {
		try {
			await axiosClient.put(`/products/${id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		}
	};

	const onDeleteProduct = async (id) => {
		try {
			await axiosClient.delete(`/products/${id}`);
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		}
	};

	const onToggleDisabledProduct = async (id, disabled) => {
		try {
			await axiosClient.put(`/products/disabled/${id}`, { disabled });
			await fetch();
			message.success('Thành công');
		} catch (e) {
			message.error('Lỗi');
		}
	};

	return (
		<div>
			<div className="d-flex" style={{ justifyContent: 'space-between' }}>
				<Typography.Title level={2} style={{ marginBottom: 0 }}>
					Danh mục món
				</Typography.Title>
				<div style={{ marginLeft: 'auto' }}>
					<CreateGroupLabelModal
						onCreateGroupLabel={onCreateGroupLabel}
						editingLabelGroup={editingLabelGroup}
						setEditingLabelGroup={setEditingLabelGroup}
						onUpdateGroupLabel={onUpdateGroupLabel}
					/>
				</div>
			</div>

			<Divider />

			{labelGroups.map((labelGroup) => (
				<div key={labelGroup._id} className="d-flex column" style={{ alignItems: 'flex-start', marginBottom: 24 }}>
					<div className="d-flex">
						<span className="d-flex">
							<span style={{ marginBottom: 0, fontWeight: '600', fontSize: '20px' }}>{labelGroup.name}</span>
							<span style={{ marginLeft: 4, opacity: 0.7, fontSize: 12 }}>{`(Ưu tiên: ${labelGroup.priority})`}</span>
						</span>
						<Switch
							defaultChecked={!labelGroup.disabled}
							onChange={(checked) => onUpdateGroupLabel({ disabled: !checked }, labelGroup._id)}
						/>
						<Tooltip title="Chỉnh sửa">
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={() => {
									setEditingLabelGroup(labelGroup);
								}}
							></Button>
						</Tooltip>

						<Popconfirm
							title="Xoá danh mục?"
							onConfirm={(e) => {
								onDeleteGroupLabel(labelGroup._id);
							}}
							placement="left"
							okText="Xoá"
							cancelText="Huỷ"
						>
							<Tooltip title="Xoá">
								<Button type="text" icon={<DeleteIcon />}></Button>
							</Tooltip>
						</Popconfirm>
					</div>
					<div style={{ width: '100%' }}>
						{labelGroup.productIds.map((product) => (
							<div key={product._id} className="d-flex dish" onClick={() => setCurrentProduct(product)}>
								<img src={getSrc(product.imagePath)} width={64} height={64} style={{ objectFit: 'cover' }} />
								<div className="d-flex" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
									<span style={{ fontWeight: 'bold' }}>{product.name}</span>
									<span className="d-flex gap-1 align-start" onClick={e => e.stopPropagation()}>
										<Rate defaultValue={product.stars} onChange={(stars) => onUpdateProduct({ stars }, product._id)} />
									</span>
								</div>
								<div className="d-flex column align-end" style={{ marginLeft: 'auto' }}>
									<span style={{ fontWeight: 'bold' }}>{formatCurrency(product.price)}</span>
									<div style={{ fontWeight: 'bold' }}>
										<span
											style={{ background: '#EF4444', padding: '4px', color: 'white', borderRadius: 2, marginRight: 4 }}
										>
											-{product.discountPercent || 0}%
										</span>
										<span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.oldPrice)}</span>
									</div>
								</div>
								<span
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									<Switch
										defaultChecked={!product.disabled}
										onChange={(checked) => onToggleDisabledProduct(product._id, !checked)}
									/>
								</span>

								<Popconfirm
									title="Xoá sản phẩm?"
									// description="Bạn chắc chắn muốn xoá sản phẩm"
									onConfirm={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onDeleteProduct(product._id);
									}}
									onCancel={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									placement="left"
									okText="Xoá"
									cancelText="Huỷ"
								>
									<Tooltip title="Xoá">
										<Button icon={<DeleteIcon />} type="text" size="large" style={{ marginLeft: 8 }}></Button>
									</Tooltip>
								</Popconfirm>
							</div>
						))}
					</div>
					<Button onClick={() => setCurrentGroupLabelId(labelGroup._id)}>Thêm món mới</Button>
				</div>
			))}
			<DishDrawer
				onUpdateProduct={onUpdateProduct}
				setProduct={setCurrentProduct}
				product={currentProduct}
				groupLabelId={currentGroupLabelId}
				setGroupLabelId={setCurrentGroupLabelId}
				onCreateProduct={onCreateProduct}
			/>
		</div>
	);
};

Dish.propTypes = {};

export default Dish;
