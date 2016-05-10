/*
* NodeJS script that outputs valid golang structs from arbitrary JSON object strings.
* Author: Jaxon Pickett (jaxon_pickett1@homedepot.com)
* Version: 1.0
* Date: 5/10/2016
 */

fs = require('fs');

// Array to hold child structs
var children = [];

function main(){

	files = fs.readdirSync('json_objects');

	for (i in files) {

		// Ignore non-conforming file names
		if (!/([^\.]*)\.json/.test(files[i])){
			continue
		}

		// The parent struct is named after the file, TitleCased
		var structName = /([^\.]*)\.json/.exec(files[i])[1];
		structName = structName.capFirst();

		// Parse file into serialized object. It better be valid JSON!
		var curJSON = require('./json_objects/' + files[i]);

		// Start the struct def with a header
		var structDef = 'type ' + structName + ' struct {\n';

		// Append field definitions to the struct def, recursively
		for (prop in curJSON){

			structDef += renderField(prop, curJSON[prop]);
		}

		// Close the struct def
		structDef += '}';

		// Output
		console.log(structDef);
	}

	// Output any child structs that were discovered
	for (child in children) {

		console.log(children[child] + '}');

	}

	return
}

// Generate field definitions, recursively
function renderField(key, value){

	propType = typeof value;

	// Primitive types close the recursion loop
	if (propType == "string") {
		return '\t' + key.capFirst() + ' string `json:"'+ key + '"`' + '\n';
	}else if (propType == "number"){
		return '\t' + key.capFirst() + ' float64 `json:"'+ key + '"`' + '\n';
	}else if (propType == "boolean"){
		return '\t' + key.capFirst() + ' bool `json:"'+ key + '"`' + '\n';
	}else if (propType == "object"){
	// Objects must be further recursed.

		// Arrays are a special case
		if(Array.isArray(value)){

			// We have to discover the type of the array elements.
			// We only check element 0 so they better all be the same.
			// This is a recursive function and will recurse until the element type is 
			// no longer an array, recursively.
			structType = getChildType(value[0]);

			// This is a flag signifying the the element type is an object, which
			// needs to be discovered. 
			if(structType == ''){

				structType = key.capFirst() + 'Struct'

				// Start a new child struct def
				child = 'type ' + structType + ' struct {\n';

				// Walk through child properties until we get to the primitive types
				for (subProp in value[0]) {
					child += renderField(subProp, value[0][subProp]);
				}

				// We only keep track of unique child structs
				if(children.indexOf(child) == -1){
					children.push(child);
				}

			}

			// returns the field definition
			return '\t' + key.capFirst() + ' []' + structType + ' `json:"'+ key + '"`' + '\n';

		}else{
			
			// Start a new child struct def
			child = 'type ' + key.capFirst() + 'Struct struct {\n';

			// Walk through child properties until we get to the primitive types
			for (subProp in value) {
				child += renderField(subProp, value[subProp]);
			}

			// We only keep track of unique child structs
			if(children.indexOf(child) == -1){
				children.push(child);
			}

			// return the field definition
			return '\t' + key.capFirst() + ' ' + key.capFirst() +'Struct ' + ' `json:"'+ key + '"`' + '\n';
		}
	}
}

// A recursive function that walks through nested arrays until it gets to an object def or primitive type.
function getChildType(value){
	if (typeof value == 'string'){
		return 'string';
	}else if(typeof value == 'number'){
		return 'float64';
	}else if(Array.isArray(value)){
		// Keep appending '[]' until we get to the bottom of the array nest.
		return '[]' + getChildType(value[0]);
	}else{
		return '';
	}
}

String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

main();


