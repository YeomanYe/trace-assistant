import Constant from '../Constant';
import $ from 'jquery';

const {TIME_SHORT} = Constant;
export function showTips(msg, time) {
    let $div = $('<div>');
    time = time ? time : TIME_SHORT;
    $div.text(msg);
    let width = window.innerWidth,
        height = window.innerHeight;
    $div.css({
        position: 'fixed',
        padding: '20px',
        top: height / 2 - 40,
        left: width / 2 - 40,
        'font-size': '18px',
        'z-index': 999,
        background: 'black',
        color: 'white'
    });
    $('body').append($div);
    setTimeout(function () {
        $div.remove();
    }, time);
}
