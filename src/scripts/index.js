if (module.hot) {
	module.hot.accept();
}

import groupBy from "lodash/groupBy";


import Library from "./library";
// import {convertJsonToObject} from "./services";
import Services from "./services";

import "../styles/main.scss";
// import "../styles/test.css";


// import './new';
// import './new2';


Library.log();

console.log(Library);
console.log(Services.convertJsonToObject());


let babelTest = () => "bananas";

console.warn("babelTest = () => 'bananas' converted to: ", babelTest);

console.log("groupBy(['one', 'two', 'three'], 'length')", groupBy(["one", "two", "three"], "length"));


const translationsJson = document.getElementById("translationsJson");

document.querySelector("button").onclick = function () {	
	Services.convertJsonToObject(document.getElementById("translationsJson").value);
}


// document.getElementById("fileInput").addEventListener("change", function () {
// 	console.log(this.files);
// 	Services.fileHandler();
// });

let fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", Services.fileHandler);

let link = document.querySelector("a");
link.addEventListener("click", function () {
	// Services.makeTextFile(this);
	Services.saveTranslations(this);
	// Services.makeDemoTextFile(this);
});


