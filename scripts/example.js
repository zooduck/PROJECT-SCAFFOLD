const es5BabelTest = () => "example.js";
console.log('const es5BabelTest = () => "example.js";');
console.log('gulp-babel has converted the above to:');
console.log(es5BabelTest);

let fitImgToWindow = true;
let fitImgToWindowTimeout = null;
document.querySelector('.background-image-example').addEventListener('mouseenter', (event) => {
	fitImgToWindow = true;
	fitImgToWindowTimeout = setTimeout(() => {
		if (fitImgToWindow) {
			event.target.style.width = `${window.innerWidth}px`;
		}
	}, 750);
});
document.querySelector('.background-image-example').addEventListener('mouseleave', (event) => {
	fitImgToWindow = false;
	clearTimeout(fitImgToWindowTimeout);
	event.target.style.width = "576px";
});