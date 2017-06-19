const es5BabelTest = () => "example.js";
console.log("const es5BabelTest = () => \"example.js\";");
console.log("gulp-babel has converted the above to:");
console.log(es5BabelTest);

let resetInput = (aTag) => {
	let inputEl = aTag.parentNode.querySelector('input');
	inputEl.value = "";
	inputEl.focus();
};
