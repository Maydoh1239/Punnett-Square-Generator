var canvas = document.getElementById('out');
var ctx = canvas.getContext("2d");
var sqsize = canvas.width;
var input1;
var input2;

function update(){
  sqsize = canvas.width
  input1 = document.getElementById('input1').value;
  input2 = document.getElementById('input2').value;
  //Checks if both parents have same number of alleles and whether it is an even amount total
  if (input1.length===input2.length && input1.length/2==Math.round(input1.length/2)){
    run();
  }
}

function run(){
  //List of all possible gametes (1 is dominant, 0 is recessive)
  var bins=[];
  for ( var i = 0; i < Math.pow( 2 , input1.length/2 ); i++ ){
    var binaryst = i.toString(2);
    bins.push(new Array(input1.length/2 - binaryst.length+1).join('0')+binaryst);
  }

  c=[]
  r=[]

  for ( var i = 0; i < bins.length; i++ ){
    var k = bins[i];
    var s1 = '' , s2 = '';
    for ( var a = 0; a < k.length; a++ ){
      //takes either the dominant or recessive from the A th gene
      var v = (2*a)+parseInt(k.charAt(a));
      s1+=input1.charAt(v);
      s2+=input2.charAt(v);
    }
    c.push(s1);
    r.push(s2);
  }

}

function geneSort ( s ){
  s1 = s.split('');
  function compare ( a , b ){
    var a1 = a.toLowerCase().charCodeAt(0)*2+(a.toLowerCase()==a ? 1 : 0);
    var b1 = b.toLowerCase().charCodeAt(0)*2+(b.toLowerCase()==a ? 1 : 0)
    return a - b;
  }
  return s1.sort(compare()).join('');
}

function getColor(s){
  for(i=0;i<s.len;i+=2){

  }
}

function hslhex(h, s, l) {
  //Converts HSL to Hex
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
