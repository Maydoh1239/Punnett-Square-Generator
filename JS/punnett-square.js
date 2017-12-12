var canvas = document.getElementById('out');
var ctx = canvas.getContext("2d");
var sqsize = canvas.width;
var input1;
var input2;
console.log(sqsize);

function update(){
  sqsize = canvas.width
  input1 = document.getElementById('input1').value;
  input2 = document.getElementById('input2').value;
  console.log(input1);
  console.log(input2);
  if (input1.length===input2.length && input1.length/2==Math.round(input1.length/2)){
    run();
  }
}

function run(){
  var bins=[];

}

function getColor(s){
  for(i=0;i<s.len;i+=2){

  }
}

function hslhex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
