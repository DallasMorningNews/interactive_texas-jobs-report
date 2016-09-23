module.exports = function(app){

	require('./home')(app);
	require('./report')(app);
	require('./all-reports')(app);
	require('./update-report')(app);
	require('./create-report')(app);

}
