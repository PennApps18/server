import { PushNotificationIOS } from 'react-native';
var pushNotification = require('react-native-push-notification');

pushNotification.configure({

	onSubscriptions = function(token){
		console.log('TOKEN:', token);
	},

	onNotification = function(notification){
		console.log('NOTIFICATION:', notification);
		notification.finish(PushNotificationIOS.FetchResult.NoData);
	},

	permissions: {
		alert: true,
		badge: true,
		sound: true,
	},

	popInitialNotification: false,
	requestPermissions: true,
});






