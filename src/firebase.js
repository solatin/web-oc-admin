import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from './constants';



const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const getMessagingToken = async () => {
	let currentToken = '';
	if (!messaging) return;
	try {
		currentToken = await getToken(messaging, {
			vapidKey: 'BMlC2ZeTQhkXfBiXIR_JhfJeUTr6nU2SV-Rdq-35OvZCqTP0v__ncSispQUPp75JAU858yHr8tia2JiP204zcUY'
		});
		console.log('FCM registration token', currentToken);
	} catch (error) {
		console.log('An error occurred while retrieving token. ', error);
	}
	return currentToken;
};

onMessage(messaging, (payload) => {
  console.log('zo', payload)
});
