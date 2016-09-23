module.exports = function(app){

	require('./home')(app);
	require('./report')(app);
	require('./all-reports')(app);


}
