var canvas = document.getElementById('out');
var ctx = canvas.getContext("2d");
var sqsize = canvas.width;
var sqnum = null;
var input1;
var input2;
var sqX = 0;
var sqY = 0;
var mouseX = null;
var mouseY = null;
var mouseDown = false;
var loadDone = false;
var square = null;
var currId = 0;

canvas.onmousewheel = function (evt) {
  evt.preventDefault();
  var scale = (sqnum*sqsize)/canvas.width;
  var wheel = Math.min(500,Math.max(-499,evt.wheelDelta))/500+1;
  if ( (scale<=1 && scale*wheel>scale) || scale>1 ){
    scaleChange = scale*wheel-scale;
    sqX -= scaleChange*(mouseX-sqX)/scale;
    sqY -= scaleChange*(mouseY-sqY)/scale;
    scale*=wheel;
    sqsize = canvas.width*scale/sqnum;
    renderFrame(sqX,sqY,sqsize);
  }
}

document.addEventListener ( 'mousemove' , getMouseCoords);
document.addEventListener ( 'mouseenter' , getMouseCoords);

document.addEventListener ( 'mousedown' , function ( evt ) {
  mouseDown = true;
});

document.addEventListener ( 'mouseup' , function ( evt ) {
  mouseDown = false;
});

function getMouseCoords ( evt ) {
  var rect = canvas.getBoundingClientRect();
  if ( mouseDown && mouseX > 0 && mouseY > 0 && mouseX < canvas.width && mouseY < canvas.height) {
    sqX -= (mouseX - (evt.clientX - rect.left));
    sqY -= (mouseY - (evt.clientY - rect.top));
    renderFrame(sqX,sqY,sqsize);
  }
  mouseX = (evt.clientX - rect.left);
  mouseY = (evt.clientY - rect.top);
}

function mouseX() {
  return mouseX;
}

function mouseY() {
  return mouseY;
}

function update(){
  loadDone = false;
  sqX = 0;
  sqY = 0;
  input1 = document.getElementById('input1').value;
  input2 = document.getElementById('input2').value;
  //Checks if both parents have same number of alleles and whether it is an even amount total and neither is blank
  if (input1.length===input2.length && input1.length>0 && input1.length/2==Math.round(input1.length/2)){
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

  sqnum = c.length+1;

  square = new Array ( c.length ); // the actual punnett square

  for ( i = 0; i <= c.length; i++ ){
    if ( i>0 ){
      square[i-1] = new Array ( r.length );
    }
    for ( j = 0; j <= r.length; j++){
      if ( i != 0 && j != 0 ) {
        square[i-1][j-1] = geneSort(c[i-1]+r[j-1]);
      }
    }
  }
  loadDone = true;
  sqsize = canvas.width/(square.length+1);
  renderFrame(0,0,sqsize)
}

function renderFrame(x1, y1, sSize){ //allows zooming
  currId++;
  if ( currId == 10000 ) {
    currId %= 10000;
  }
  if ( loadDone ) { //Done loading square?
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (var a = 0; a < square.length; a++) {
      for (var b = 0; b < square[a].length; b++){
        shouldRender(x1,y1,sSize,a,b);
      }
    }
  }
}

function shouldRender ( x1 , y1 , sSize , a , b ) { //should this be rendered?
  if ( sSize*(a+2)+x1 > 0 && sSize*(b+2)+y1 > 0 && sSize*(a+1)+x1 < canvas.width && sSize*(b+1)+y1 < canvas.height ) {
    ctx.fillStyle = getColor(square[a][b]);
    ctx.globalAlpha = 0.5;
    ctx.fillRect (sSize*(a+1)+x1,sSize*(b+1)+y1,sSize,sSize);
    if ( sqsize > 20 ){
      addText (square[a][b], sSize*0.95, sSize*(a+1.5)+x1,sSize*(b+1.5)+y1, currId);
    }
  }
}

function addText(string , size , x , y , id){ // Loads a word
  x = x-size*0.3;
  size/=string.length;
  ctx.fillStyle = '#000000';
  ctx.font = Math.round(size)+'px Courier'
  ctx.fillText(string,x,y);
}

function geneSort ( s ){
  s1 = s.split('');
  return s1.sort(function ( a , b ){ // sorts by alleles
    var a1 = a.toLowerCase().charCodeAt(0)*2+(a.toLowerCase()==a ? 1 : 0);
    var b1 = b.toLowerCase().charCodeAt(0)*2+(b.toLowerCase()==b ? 1 : 0);
    return a1 - b1;
  }).join('');
}

function getColor( s ){
  var sum = 0;
  for(i=0;i<s.length;i+=2){
    var chr = s.charAt(s.length-i-2);
    if (chr == chr.toUpperCase()){
      sum += Math.pow(2,i/2);
    }
  }
  return hslhex(sum/(sqnum-1) , 1 , 0.5);
}

function hslhex(h, s, l) {
  //Converts HSL to Hex
  var h,s,l;
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
