export default class Customizator {
  constructor() {
    this.btnBlock = document.createElement('div');
    this.colorPicker = document.createElement('input');
    this.clear = document.createElement('div');

    this.localScale = localStorage.getItem('scale') || 1; // value by default
    this.localColor = localStorage.getItem('color') || '#ffffff'; // value by default

    this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));
    this.colorPicker.addEventListener('input', (e) => this.onColorChange(e));
    this.clear.addEventListener('click', () => this.reset());
  }

  onScaleChange(e) {
    const body = document.querySelector('body');

    if (e) {
      this.localScale = +e.target.value.replace(/x/g, "");
    }

    const recursy = (elem) => {
      elem.childNodes.forEach((node) => {
        const parent = node.parentNode;
        
        if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) {
          if (!parent.getAttribute('data-fz')) {
            let value = window.getComputedStyle(parent).fontSize;

            parent.setAttribute('data-fz', +value.replace(/px/g, ""));
            parent.style.fontSize = parent.getAttribute('data-fz') * this.localScale + "px";
          } else {
            parent.style.fontSize = parent.getAttribute('data-fz') * this.localScale + "px";
          }
        } else {
          recursy(node);
        }
      });
    }

    recursy(body);

    localStorage.setItem('scale', this.localScale);
  }

  onColorChange(e) {
    const body = document.querySelector('body');

    body.style.backgroundColor = e.target.value;
    localStorage.setItem('color', e.target.value);
  }

  setBgColor() {
    const body = document.querySelector('body');

    body.style.backgroundColor = this.localColor;
    this.colorPicker.value = this.localColor;
  }

  reset () {
    localStorage.clear();
    this.scale = 1;
    this.color = '#ffffff';
    this.setBgColor();
    this.onScaleChange();
  }

  injectStyle() {
    const style = document.createElement('style');

    style.innerHTML = `
      .panel {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 10px;
        right: 0;
        border: 1px solid rgba(0,0,0, .2);
        box-shadow: 0 0 20px rgba(0,0,0, .5);
        width: 300px;
        height: 60px;
        background-color: #fff;
    
      }
      
      .scale {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100px;
        height: 40px;
      }

      .scale_btn {
        display: block;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(0,0,0, .2);
        border-radius: 4px;
        font-size: 18px;
      }
      
      .color {
        width: 40px;
        height: 40px;
      }

      .clear {
        font-size: 20px;
        cursor: pointer;
      }
    `;

    document.querySelector('head').appendChild(style);
  }

  render() {
    this.injectStyle();
    this.setBgColor();
    this.onScaleChange();

    let scaleInputSmall = document.createElement('input'),
        scaleInputMedium = document.createElement('input'),
        panel = document.createElement('div');

    scaleInputSmall.classList.add('scale_btn');
    scaleInputMedium.classList.add('scale_btn');
    this.btnBlock.classList.add('scale');
    this.colorPicker.classList.add('color');
    this.clear.classList.add('clear');
    panel.classList.add('panel');

    scaleInputSmall.setAttribute('type', 'button');
    scaleInputMedium.setAttribute('type', 'button');
    scaleInputSmall.setAttribute('value', '1x');
    scaleInputMedium.setAttribute('value', '1.5x');
    this.colorPicker.setAttribute('type', 'color');
    this.colorPicker.setAttribute('value', '#ffffff');
    this.clear.innerHTML = "&#10006;";

    panel.append(this.btnBlock, this.colorPicker, this.clear);
    this.btnBlock.append(scaleInputMedium, scaleInputSmall);

    document.querySelector('body').append(panel);
  }
}