if (module.hot) {
	module.hot.accept();
}

import "./main.scss";
import "./test.css";
import services from "./services";
import {groupBy} from "lodash/fp";


console.log("webpack-test");

let babelTest = () => "bananas";

console.log("babelTest = () => 'bananas' converted to: ", babelTest);