var vBatchPanel = Vue.component('batch-panel', {
    props: {
        hide:Boolean
    },
    template: `
        <div id="batchPanel" v-show="!hide">
            <!-- checkbox -->
            <div class="pretty p-svg p-curve">
                    <input type="checkbox" />
                    <div class="state p-success">
                        <!-- svg path -->
                        <svg class="svg svg-icon" viewBox="0 0 20 20">
                            <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                        </svg>
                        <label ></label>
                    </div>
                </div>
            <!-- 删除 -->
            <div class="inline-right">
                <a class="pointer" @click="batchDel()">删除</a>
                <a class="pointer" @click="batchMarkRead()">标为已读</a>
            </div>
        </div>
     `,
    methods: {
        batchMarkRead:function(){
            eventHub.$emit(EVT_BATCH_MARK_READ);
        },
        batchDel:function () {
            eventHub.$emit(EVT_BATCH_DEL);
        }
    }
});
