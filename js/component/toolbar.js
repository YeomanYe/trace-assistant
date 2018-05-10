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
                <!--<img onClick={this.toggleCol} src={isCol ? "../../images/star-yellow.png" : "../../images/star-white.png"} alt=""/>-->
            </div>
        </header>
     `,
  methods: {

  }
})