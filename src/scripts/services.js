import flat from "flat";
// const unflatten = flat["unflatten"];

const readFile = (imgEl, file) => {
	let reader = new FileReader();

	reader.onload = (e) => {		
		imgEl.src = e.target.result;
	}		
	reader.readAsDataURL(file);	
}

const translationTable = document.getElementById("translationTable");

// const unflatten = require("flat").unflatten;

export default {
	convertJsonToObject: function (json) {
		console.log("covertJsonToObject called");
		if (json) {
			let obj = JSON.parse(json);
			// console.log(obj.toString());
			// console.log(JSON.parse(json));
			// document.body.innerHTML += `<p>${JSON.parse(json)}</p>`;
			// document.body.innerHTML += obj.toString();

			let translationsObject = document.getElementById("translationsObject");


			let content = "";
			for (let prop in obj) {
				// translationsObject.innerHTML += `${prop}: ${obj[prop]}<br/>`;
				content += `${prop}: ${obj[prop]}\n`;
				console.log(`${prop}:${obj[prop]}`);
			}
			translationsObject.value = content;
		}
		
	},
	readFile: function (img, file) {
		let reader = new FileReader();
		reader.onload = function (img) {
			return function (e) {
				img.src = e.target.result;
			}
		reader.readAsDataURL(file);
		}

	},
	makeDemoTextFile: function (link) {
		let data = new Blob(["some text data"], {type: "text/plain"});
		let textFile = window.URL.createObjectURL(data);
		link.href = textFile;
	},
	makeTextFile: function (link) {
		let translations = [];
		for (let row of Array.from(translationTable.children)) {

			if (row.firstChild.nodeName.toString().match(/th/i) || row.nodeName.toString().match(/caption/i)) {
				continue; // ignore the headers and caption
			}

			console.log(row);

			if (row.lastChild.firstChild.value == "") {
				continue; // ignore empty translations
			}

			let cols = row.children;
			let key = cols[0].innerHTML;
			let en = cols[1].innerHTML;
			let translation = cols[2].firstChild.value;

			translations.push({
				key: key,
				en: en,
				translation: translation
			});	
			
		}

		

		
		console.log(translations);
		let csvData = "";
		for (let obj of translations) {
			let key = obj.key;
			let translation = obj.translation;
			csvData += `"${key}": "${translation}",\n`;		
		}
		csvData = csvData.trim();
		csvData = csvData.substr(0, csvData.length-1);
		csvData = `{${csvData}}`;
		let data = new Blob([csvData], {type: "text/plain"});
		let csvFile = window.URL.createObjectURL(data);
		link.href = csvFile;

		let obj = JSON.parse(csvData);
		console.log("obj", obj);
		let test  = unflatten(csvData);
		console.log(test);


		// console.log(csvData);
		// console.log(translations);
	},
	saveTranslations: function (link) {
		let translations = {};
		for (let row of translationTable.children) {
			if (row.nodeName.match(/(caption|tbody)/i)) {
				continue;
			}
			let key = row.children[0].innerHTML;
			let en = row.children[1].innerHTML;
			let trans = row.children[2].querySelector("textarea").value;

			if (trans !== "") {
				translations[key] = trans;				
			}
		}
		translations = flat.unflatten(translations);

		let data = new Blob([JSON.stringify(translations, null, 4)], {type: "text/plain"});
		let jsonFile = window.URL.createObjectURL(data);
		link.href = jsonFile;
		// console.log(flat.unflatten(translations));
		// console.log(JSON.stringify(translations));
	},
	fileHandler: function () {
		// handle files...
		let files = [];
		for (let file of Array.from(this.files)) {

			//alert(file.type);

			if (file.type === "" && file.name.match(/.json$/i) || file.type.match(/json/i)) { // JSON files
				let reader = new FileReader();
				reader.onload = (e) => {
					let json = e.target.result;
					let translations = JSON.parse(json);
					for (let key in translations) {
						let english = translations[key];
						let tr = document.createElement("TR");
						let cols = [];
						for (let i = 0; i < 3; i++) {
							let td = document.createElement("TD");
							td.innerHTML = i === 0? key : i === 1? english : "";
							if (i === 2) {
								let textarea = document.createElement("TEXTAREA");
								textarea.rows = 1;
								textarea.addEventListener("keydown", (e) => {
									let key = e.keyCode || e.charCode;
									if (key === 13) { // enter/return key
										e.preventDefault();
									}
								});
								td.appendChild(textarea);
							}
							cols.push(td);
						}
						for (let col of cols) {
							tr.appendChild(col);
							translationTable.appendChild(tr);
						}
					}

				}
				reader.readAsText(file);
			}

			if (file.type.match(/^image\//)) { // Image files
				let imgEl = document.createElement("IMG");
				imgEl.setAttribute("file", file);

				let objectUrl = window.URL.createObjectURL(file);

				imgEl.src = objectUrl;
				imgEl.height = 100;
				
				document.body.appendChild(imgEl);	
				
				// readFile(imgEl, file);
			}

			if (file.type.match(/^video\//)) { // Video files
				let video = document.getElementById("videoPreview");
				let obj_url = window.URL.createObjectURL(file);
				video.height = 250;
				video.src = obj_url;
				video.play();				
			}

			if (file.type.match(/application\/vnd.ms-excel/)) { // CSV files
				let reader = new FileReader();				
				reader.onload = function (e) {
					let rows = e.target.result.split("\n");
					let headers = true;
					for (let row of Array.from(rows)) {
						let tr = document.createElement("TR");
						let cols = row.split(",");
						for (let col of Array.from(cols)) {
							if (col.match(/[\w\d]+/)) {
								let td = headers? document.createElement("TH") : document.createElement("TD");
								td.innerHTML = col;
								tr.appendChild(td);
							}							
						}						
						if (headers === false) {
							let translationCol_td = document.createElement("TD");
							let translationCol_input = document.createElement("TEXTAREA");
							translationCol_input.addEventListener("keydown", function(e) {
								let key = e.keyCode || e.charCode;
								if (key == 13) {
									e.preventDefault();
								}
							});
							translationCol_input.addEventListener("blur", function(e) {
								this.value = this.value.replace(/\n/g, "");
							});
							translationCol_input.rows = 1;
							translationCol_td.appendChild(translationCol_input);
							tr.appendChild(translationCol_td);
						}						
						translationTable.appendChild(tr);											
						headers = false;
					}					
					console.log(e.target.result);
				}
				reader.readAsText(file);
			}

			console.log("file.type", file.type);


			files.push(file.name);
		}
		const fileList = document.getElementById("fileList");
		if (files.length > 0) {
			fileList.innerHTML = files.join();
		} else {
			fileList.innerHTML = "No files selected init";
		}
	}
}