import { Button, Col, Drawer, Form, Input, message, Row, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { ReactComponent as PlusOutlined } from '../../assets/plus.svg';
import { getSrc } from '../Coupon';
import Loading from '../Loading';

const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};

const DishDrawer = ({ groupLabelId, setGroupLabelId, onCreateProduct, product, setProduct, onUpdateProduct }) => {
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState();
	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
		setGroupLabelId(false);
		setProduct(false);
		setFile(null);
		setImageUrl(null);
		form.resetFields();
	};

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		setFile(file);
		getBase64(file, (url) => {
			setLoading(false);
			setImageUrl(url);
		});
		return false;
	};

	const uploadButton = (
		<div>
			{loading ? <Loading /> : <PlusOutlined />}
			<div
				style={{
					marginTop: 8
				}}
			>
				Upload
			</div>
		</div>
	);

	const [form] = Form.useForm();
	const price = Form.useWatch('price', form);
	const oldPrice = Form.useWatch('oldPrice', form);

	useEffect(() => {
		form.setFieldValue('discountPercent', Math.round((1 - price / oldPrice) * 100));
	}, [price, oldPrice]);

	const onFinish = (values) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, val]) => {
			if (key === 'oldPrice' || key === 'discountPercent') {
				formData.append(key, val || 0);
			} else {
				formData.append(key, val);
			}
		});
		formData.append('image', file);
		if (product) {
			onUpdateProduct(formData, product._id);
		} else {
			formData.append('groupLabelId', groupLabelId);
			onCreateProduct(formData);
		}

		onClose();
	};

	useEffect(() => {
		if (groupLabelId) {
			setOpen(true);
		}
	}, [groupLabelId]);

	useEffect(() => {
		if (product) {
			setOpen(true);
			form.setFieldsValue(product);
		}
	}, [product]);

	return (
		<>
			<Drawer
				title={product ? 'Sửa món ăn' : 'Thêm món ăn'}
				placement="right"
				onClose={onClose}
				open={open}
				width={'450px'}
			>
				<Form form={form} layout="vertical" labelCol={{ span: 24 }} onFinish={onFinish}>
					<b>Hình sản phẩm</b>
					<div className="d-flex gap-1">
						<div>
							<Upload
								accept="image/png, image/gif, image/jpeg"
								name="avatar"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								beforeUpload={beforeUpload}
								// onChange={handleChange}
							>
								{imageUrl || product?.imagePath ? (
									<img
										src={imageUrl || getSrc(product.imagePath)}
										alt="avatar"
										style={{
											objectFit: 'cover',
											width: '100%',
											height: '100%'
										}}
									/>
								) : (
									uploadButton
								)}
							</Upload>
						</div>
						<div
							className="d-flex column"
							style={{ height: '100%', padding: '6px', flex: 1, border: '1px dashed gray', borderRadius: '4px' }}
						>
							Ảnh PNG, JPEG, JPG không vượt quá 10Mb. Tỉ lệ khuyến nghị 1:1.
							{imageUrl && <b>Nhấn vào hình để thay đổi</b>}
						</div>
					</div>

					<Form.Item label="Tên sản phẩm" name="name" required rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="Giá bán"
						name="price"
						trigger="onValueChange"
						getValueFromEvent={(obj) => obj.floatValue}
						required
						rules={[{ required: true }]}
					>
						<NumericFormat suffix="đ" customInput={Input} thousandSeparator="," />
					</Form.Item>
					<Row gutter={8}>
						<Col span={16}>
							<Form.Item
								label="Giá cũ"
								name="oldPrice"
								trigger="onValueChange"
								getValueFromEvent={(obj) => obj.floatValue}
							>
								<NumericFormat suffix="đ" customInput={Input} thousandSeparator="," />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								label="Phần trăm giảm"
								name="discountPercent"
								trigger="onValueChange"
								getValueFromEvent={(obj) => obj.floatValue}
							>
								<NumericFormat suffix="%" customInput={Input} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label="Mô tả ngắn" name="description">
						<Input />
					</Form.Item>
					<Button type="primary" htmlType="submit">
						Lưu
					</Button>
				</Form>
			</Drawer>
		</>
	);
};
export default DishDrawer;
