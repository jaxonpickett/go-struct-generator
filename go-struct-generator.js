String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

fs = require('fs');

files = fs.readdirSync('json_objects');

var children = [];

for (i in files) {

	if (!/([^\.]*)\.json/.test(files[i])){
		continue
	}
	
	var structName = /([^\.]*)\.json/.exec(files[i])[1];
	structName = structName.capFirst();

	var curJSON = require('./json_objects/' + files[i]);
	
	var structDef = 'type ' + structName + ' struct {\n';

	for (prop in curJSON){

		structDef += renderField(prop, curJSON[prop]);
	}

	structDef += '}';

	console.log(structDef);
}

for (child in children) {

	console.log(children[child] + '}');

}

function renderField(key, value){

	propType = typeof value;
	// console.log(propType);

	if (propType == "string") {
		return '\t' + key.capFirst() + ' string `json:"'+ key + '"`' + '\n';
	}else if (propType == "number"){
		return '\t' + key.capFirst() + ' float64 `json:"'+ key + '"`' + '\n';
	}else if (propType == "boolean"){
		return '\t' + key.capFirst() + ' bool `json:"'+ key + '"`' + '\n';
	}else if (propType == "object"){

		// console.log(parseInt(key, 10));

		if(Array.isArray(value)){

			structType = getChildType(value[0]);

			if(structType == ''){
				structType = key.capFirst() + 'Struct'

				child = 'type ' + structType + ' struct {\n';

				for (subProp in value[0]) {
					child += renderField(subProp, value[0][subProp]);
				}

				if(children.indexOf(child) == -1){
					children.push(child);
				}

			}

			return '\t' + key.capFirst() + ' []' + structType + ' `json:"'+ key + '"`' + '\n';

		}else{

			child = 'type ' + key.capFirst() + 'Struct struct {\n';

			for (subProp in value) {
				child += renderField(subProp, value[subProp]);
			}

			if(children.indexOf(child) == -1){
				children.push(child);
			}

			return '\t' + key.capFirst() + ' ' + key.capFirst() +'Struct ' + ' `json:"'+ key + '"`' + '\n';
		}
	}
}

function getChildType(value){
	if (typeof value == 'string'){
		return 'string';
	}else if(typeof value == 'number'){
		return 'float64';
	}else if(Array.isArray(value)){
		return '[]' + getChildType(value[0]);
	}else{
		return '';
	}
}


