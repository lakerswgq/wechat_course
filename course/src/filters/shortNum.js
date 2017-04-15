var shortNumber = function (value) {
	if (value < 10000){
		return value.toString();
	}
	else if (value < 1e8){
		return (value/1e4).toFixed(1) + "万" ;
	}
	else {
		return "--"
	}
}

export default shortNumber;

