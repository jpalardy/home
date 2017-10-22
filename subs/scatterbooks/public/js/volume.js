/* global document, Vue */

document.addEventListener('keydown', (ev) => {
  if (ev.keyCode === 27) { // ESC
    document.querySelector('#volume').classList.toggle('hide');
    document.querySelector('#volume textarea').focus();
  }
});

const volume = new Vue({
  el: '#volume',
  data: {
    text: "",
  },
  //-------------------------------------------------
  computed: {
    volume() {
      const lines = this.text.split("\n");
      const volumes = lines.map((line) => {
        const volume = this.convert(line);
        if (volume) {
          return `${line.trim()} => ${volume}ml`;
        }
        if (line.trim() === "") {
          return "";
        }
        return `${line.trim()} => ???`;
      });
      return volumes.join("\n");
    },
  },
  //-------------------------------------------------
  methods: {
    convert(text) {
      const parts = text.trim().split(/ +/);
      let numbers = parts.filter(Number).map(Number);
      if (numbers.length < 3) {
        return null;
      }
      // inch => cm
      if (parts.includes("inches")) {
        numbers = numbers.map(x => x * 2.54);
      }
      return Math.ceil(numbers.reduce((acc, x) => acc * x));
    },
  },
  //-------------------------------------------------
  directives: {
    focus(el) {
      Vue.nextTick(() => el.focus());
    },
  },
});

