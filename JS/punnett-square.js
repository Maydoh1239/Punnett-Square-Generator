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
    scaleChange = Math.max(1,scale*wheel)-scale;
    sqX -= scaleChange*(mouseX-sqX)/scale;
    sqY -= scaleChange*(mouseY-sqY)/scale;
    sqX = Math.min(sqX,0);
    sqY = Math.min(sqY,0);
    scale=Math.max(1,scale*wheel);
    sqsize = canvas.width*scale/sqnum;
    renderFrame(sqX,sqY,sqsize);
  }
}

canvas.addEventListener ( 'mousemove' , getMouseCoords);
canvas.addEventListener ( 'mouseenter' , getMouseCoords);

canvas.addEventListener ( 'mousedown' , function ( evt ) {
  mouseDown = true;
});

canvas.addEventListener ( 'mouseup' , function ( evt ) {
  mouseDown = false;
});

function getMouseCoords ( evt ) {
  var rect = canvas.getBoundingClientRect();
  if ( mouseDown && mouseX > 0 && mouseY > 0 && mouseX < canvas.width && mouseY < canvas.height) {
    sqX -= (mouseX - (evt.clientX - rect.left));
    sqY -= (mouseY - (evt.clientY - rect.top));
    sqX = Math.min(sqX,0);
    sqY = Math.min(sqY,0);
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
    square[i] = new Array ( r.length+1 );
    for ( j = 0; j <= r.length; j++){
      if ( i != 0 && j != 0 ) {
        square[i][j] = geneSort(c[i-1]+r[j-1]);
      }else if ( i!=0 ) {
        square[i][j]=r[i-1];
      }else if ( j!=0 ) {
        square[i][j]=c[j-1];
      }
    }
  }
  loadDone = valid();
  sqsize = canvas.width/(square.length);
  renderFrame(0,0,sqsize)
}

function valid() {
  for (var a = 1; a<square.length; a++){
    for (var b = 1; b<square[a].length; b++){
      geneList = square[a][b].match(/.{1,2}/g);
      for ( var i = 0; i<geneList.length; i++){
        var lowerCaseGene = geneList[i].toLowerCase();
        var inrange = (lowerCaseGene.charAt(0) >= 'a' && lowerCaseGene.charAt(0) <= 'z') && (lowerCaseGene.charAt(1) >= 'a' && lowerCaseGene.charAt(1) <= 'z');
        if (lowerCaseGene.charAt(0) != lowerCaseGene.charAt(1) || !inrange){
          return false;
        }
      }
    }
  }
  return true;
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

function shouldRender ( x1 , y1 , sSize , a , b) { //should this be rendered?
  if ( sSize*(a+1)+x1 > 0 && sSize*(b+1)+y1 > 0 && sSize*a+x1 < canvas.width && sSize*b+y1 < canvas.height ) {
    if(a!=0 && b!=0){
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = getColor(square[a][b]);
      ctx.fillRect (sSize*a+x1,sSize*b+y1,sSize,sSize);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = sqsize/100;
      ctx.strokeRect (sSize*a+x1,sSize*b+y1,sSize,sSize);
      ctx.globalAlpha = 0.5;
      if ( sqsize > 20 ){
        addText (square[a][b], sSize*0.95, sSize*(a+0.5)+x1,sSize*(b+0.5)+y1, currId , 1);
      }
    }else if(!(a==0 && b==0)){
      if ( sqsize > 20 ){
        addText (square[b][a], sSize*0.95, sSize*(a+0.5)+x1, sSize*(b+0.5)+y1, currId , 2);
      }
    }
  }
}

function addText(string , size , x , y , id , sizeFactor){ // Loads a word
  ctx.globalAlpha = 0.5;
  x = x-size*0.3/sizeFactor;
  size/=string.length*sizeFactor;
  y += Math.round(size)/4
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
