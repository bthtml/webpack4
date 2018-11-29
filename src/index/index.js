import "babel-polyfill";
import '../assets/css/common.scss';
import './index.scss';
/*import $ from 'jquery';*/
function component() {
    var element = document.createElement('div');
    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = 'Hello';
    element.classList.add('hello');
    $('.box').append('--addd');
    return element;
}

document.body.appendChild(component());

const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;