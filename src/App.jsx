import { default as React } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import './App.css';
import Coupon from './components/Coupon';
import Dish from './components/Dish';
import Home from './components/Home';
import Login from './components/Login';
import Order from './components/Order/index';
import './firebase'

const App = () => {
	const routing = useRoutes([
		{
			path: '/login',
			element: <Login />
		},
		{
			path: '/app',
			element: <Home />,
			children: [
				{
					index: true,
					element: <Navigate to="orders" />
				},
				{
					path: 'dishes',
					element: (
						<div>
							<Dish />
						</div>
					)
				},
				{
					path: 'coupons',
					element: (
						<div>
							<Coupon />
						</div>
					)
				},
				{
					path: 'orders',
					element: (
						<div>
							<Order />
						</div>
					)
				}
			]
		},
		{
			path: '*',
			element: <Navigate to="/app" />
		}
	]);


	return routing;
};
export default App;
