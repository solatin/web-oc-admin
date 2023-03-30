import React from 'react';
import PropTypes from 'prop-types';
import './index.css'

const Loading = (props) => {
	return (
		<div class="lds-ring">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};

Loading.propTypes = {};

export default Loading;
