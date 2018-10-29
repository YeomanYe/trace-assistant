/*jquery拖动插件*/
import $ from 'jquery';

$.fn.extend({
    drag: function(options) {
        let dragStart, dragMove, dragEnd,
            $boundaryElem, limitObj;

        function _initOptions() {
            let noop = function(){}, defaultOptions;

            defaultOptions = { // 默认配置项
                boundaryElem: 'body' // 边界容器
            };
            options = $.extend( defaultOptions, options || {} );
            $boundaryElem = $(options.boundaryElem);

            dragStart = options.dragStart || noop,
                dragMove = options.dragMove || noop,
                dragEnd = options.dragEnd || noop;
        }

        function _drag(e) {
            let clientX, clientY, offsetLeft, offsetTop,
                $target = $(this), self = this;

            limitObj = {
                _left: 0,
                _top: 0,
                _right: ($boundaryElem.innerWidth() || $(window).width()) - $target.outerWidth(),
                _bottom: ($boundaryElem.innerHeight() || $(window).height()) - $target.outerHeight()
            };

            // 记录鼠标按下时的位置及拖动元素的相对位置
            clientX = e.clientX;
            clientY = e.clientY;
            offsetLeft = this.offsetLeft;
            offsetTop = this.offsetTop;

            dragStart.apply(this, arguments);
            $(document).bind('mousemove', moveHandle)
                .bind('mouseup', upHandle);

            // 鼠标移动事件处理
            function moveHandle(e) {
                let x = e.clientX - clientX + offsetLeft;
                let y = e.clientY - clientY + offsetTop;

                $target.css({
                    left: Math.max( Math.min(x, limitObj._right),  limitObj._left) + 'px',
                    top: Math.max( Math.min(y, limitObj._bottom),  limitObj._top) + 'px'
                });

                dragMove.apply(self, arguments);
                // 阻止浏览器默认行为(鼠标在拖动图片一小段距离，会出现一个禁止的小提示，即：图片不能再拖动)
                e.preventDefault();
            }

            // 鼠标弹起事件处理
            function upHandle(e) {
                $(document).unbind('mousemove', moveHandle);
                dragEnd.apply(self, arguments);
                //阻止默认行为
                e.preventDefault();
            }
        }

        _initOptions(); // 初始化配置对象

        $(this)
            .css({ position: 'fixed' })
            .each(function(){
                $(this).bind('mousedown', function(e){
                    _drag.apply(this, [e]);
                    $(this).css({bottom:'auto',right:'auto'});
                    // 阻止区域文字被选中 for chrome firefox ie9
                    e.preventDefault();
                    // for firefox ie9 || less than ie9
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                });
            });
        return this;
    }
});

export default $;
