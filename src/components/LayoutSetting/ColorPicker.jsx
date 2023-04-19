import { Popover } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ value, onChange, disabled }) => {
	return (
		<Popover
			trigger="click"
			{...(disabled ? { open: false } : {})}
			content={
				<SketchPicker
					color={value}
					onChange={(value) => {
						onChange(value.hex);
					}}
				/>
			}
		>
			<div
				style={{
					width: 80,
					borderRadius: 5,
					height: 16,
					background: value
				}}
			></div>
		</Popover>
	);
};

ColorPicker.propTypes = {};

export default ColorPicker;
