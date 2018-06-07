var vToolbar = Vue.component('toolbar', {
  props: {
  },
  template: `
          <header id='toolbar'>
            <div class="hd">
                <img src="../../images/icon/logo-white32.png" alt=""/>
                <h1>追综饭</h1>
            </div>
            <div class="bd">
                <a target="_blank" title="给个好评" href="https://chrome.google.com/webstore/detail/%E8%BF%BD%E7%BB%BC%E9%A5%AD/fajeglfbhflmbaccedmbgelodcbljobl/reviews?utm_source=chrome-ntp-icon">
                    <img src="../../images/praise.png" alt=""/>
                </a>
            </div>
            <div class="bd">
                <a target="_blank" title="批量操作" href="javascript:;">
                    <img src="../../images/batch.png" alt=""/>
                </a>
            </div>
        </header>
     `,
  methods: {

  }
})
