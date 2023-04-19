import {
	Button,
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	message,
	Popconfirm,
	Row,
	Space,
	Switch,
	Typography,
	Upload
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as PlusOutlined } from '../../assets/plus.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import axiosClient from '../../axios';

import Loading from '../Loading';
import { getSrc } from '../Coupon';
import { SketchPicker } from 'react-color';
import ColorPicker from './ColorPicker';

const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};
const getTypeProps = (type) => {
	switch (type) {
		case 'freeShip':
			return {
				color: '#21C55D',
				text: 'GIẢM PHÍ GIAO HÀNG'
			};
		case 'giveAway':
			return {
				color: '#3B81F6',
				text: 'TẶNG SẢN PHẨM'
			};
		case 'discount':
			return {
				color: '#EF4444',
				text: 'GIẢM GIÁ ĐƠN HÀNG'
			};
	}
};
const LayoutSettings = (props) => {
	const [form] = Form.useForm();

	const [panelImages, setPanelImages] = useState([]);
	const [disableEdit, setDisableEdit] = useState(true);
	const valuesRef = useRef();
	const fetch = async () => {
		try {
			const rs = await axiosClient.get('/layouts');
			setPanelImages(rs.panelImagePaths.map((el) => ({ url: el })));
			form.setFieldsValue(rs);
			valuesRef.current = { ...rs, panelImages: rs.panelImagePaths.map((el) => ({ url: el })) };
			setDisableEdit(true);
		} catch (e) {
			message.error('Lỗi');
		}
	};
	useEffect(() => {
		fetch();
	}, []);

	const beforeUpload = (file, index) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('Bạn chỉ có thể sử dụng file đuôi JPG/PNG!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Dung lượng ảnh phải phỏ hơn 2MB!');
		} else {
			getBase64(file, (url) => {
				setPanelImages((prev) => {
					if (index < 0) return [...prev, { file, url, isNew: true }];
					const n = [...prev];
					n[index] = { file, url };
					return n;
				});
			});
		}

		return false;
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8
				}}
			>
				Upload
			</div>
		</div>
	);

	const onFinish = async (data) => {
		const formData = new FormData();

		Object.entries(data).map(([key, value]) => {
			formData.append(key, value);
		});
		formData.append('shopNameStyle.bold', data.shopNameStyle.bold)
		formData.append('shopNameStyle.color', data.shopNameStyle.color)
		panelImages
			.filter((el) => !el.isNew)
			.forEach((el) => {
				formData.append('panelImagePaths', el.url);
			});
		panelImages
			.filter((el) => el.isNew)
			.forEach((el) => {
				formData.append('panelImages', el.file);
			});
		try {
			await axiosClient.put(`/layouts`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await fetch();
			message.success('Thành công');
		} catch {
			message.error('Lỗi');
		}
	};

	const onDeleteImage = (index) => {
		setPanelImages((prev) => prev.filter((_, idx) => idx !== index));
	};

	const onCancelEdit = () => {
		const { panelImages, ...formValues } = valuesRef.current;
		form.setFieldsValue(formValues);
		setPanelImages(panelImages);
		setDisableEdit(true);
	};

	return (
		<div>
			<div className="d-flex" style={{ justifyContent: 'space-between' }}>
				<Typography.Title level={2} style={{ marginBottom: 0 }}>
					Cài đặt giao diện
				</Typography.Title>
			</div>

			<Divider />
			<Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} labelAlign="left" disabled={disableEdit}>
				<Row style={{ alignItems: 'center', justifyContent: 'flex-start', lineHeight: '32px', marginBottom: '24px' }}>
					<Col span={4} style={{ textAlign: 'left' }}>
						<Typography.Text>Ảnh panel:</Typography.Text>
					</Col>
					<Col span={20}>
						<Row gutter={[36, 24]}>
							{panelImages.map(({ url, isNew }, index) => (
								<Col span={4} key={url}>
									<div style={{ display: 'flex', alignItems: 'center', flexFlow: 'column', gap: 8 }}>
										<Upload
											accept="image/png, image/gif, image/jpeg"
											name="avatar"
											listType="picture-card"
											className="avatar-uploader"
											showUploadList={false}
											beforeUpload={(file) => beforeUpload(file, index)}
											// onChange={handleChange}
										>
											<img
												src={isNew ? url : getSrc(url)}
												alt="avatar"
												style={{
													objectFit: 'cover',
													aspectRatio: '16/9',
													height: '100%',
													borderRadius: 5
												}}
											/>
										</Upload>
										<Popconfirm onConfirm={() => onDeleteImage(index)} cancelText="Huỷ" title="Chắc chắn xoá ảnh này?">
											<Button icon={<DeleteIcon />} />
										</Popconfirm>
									</div>
								</Col>
							))}

							<Col span={4} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
								<Upload
									accept="image/png, image/gif, image/jpeg"
									name="avatar"
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									beforeUpload={(file) => beforeUpload(file, -1)}
									// onChange={handleChange}
								>
									{uploadButton}
								</Upload>
							</Col>
						</Row>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item labelCol={{span: 8}} name="shopName" label="Tên cửa hàng">
							<Input />
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item
							labelCol={{ span: 12 }}
							wrapperCol={{ span: 12 }}
							name={['shopNameStyle', 'bold']}
							label="Chữ đậm"
							valuePropName="color"
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item
							labelCol={{ span: 12, offset: 3 }}
							wrapperCol={{ span: 12 }}
							name={['shopNameStyle', 'color']}
							label="Màu chữ"
						>
							<ColorPicker disabled={disableEdit} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name="address" label="Địa chỉ">
					<Input />
				</Form.Item>
				<Form.Item name="shippingNote" label="Ghi chú phí ship">
					<Input />
				</Form.Item>
				<Form.Item name="isOpen" label="Mở cửa" valuePropName="checked">
					<Switch />
				</Form.Item>
				<Form.Item name="openTime" label="Giờ mở cửa">
					<Input />
				</Form.Item>
				<Form.Item name="closeTime" label="Giờ đóng cửa">
					<Input />
				</Form.Item>
			</Form>
			<Space style={{ justifyContent: 'center', width: '100%', marginTop: 12, gap: 24 }}>
				{disableEdit && (
					<Button type="primary" onClick={() => setDisableEdit(false)}>
						Chỉnh sửa
					</Button>
				)}
				{!disableEdit && (
					<>
						<Button onClick={onCancelEdit} style={{ width: '70px' }}>
							Huỷ
						</Button>
						<Button type="primary" onClick={form.submit} style={{ width: '90px' }}>
							Lưu
						</Button>
					</>
				)}
			</Space>
		</div>
	);
};

LayoutSettings.propTypes = {};

export default LayoutSettings;
