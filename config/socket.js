module.exports = function(io){
	io.on('connect', (socket) => {
		console.log('socket connection');
	});
	io.on('disconnect', (socket) => {
		console.log('disconnect');
	});
}