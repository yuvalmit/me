/*= Globals
 ============================================================= */


var canvas_dimensions = { width:1000, height:700};
var timer = null;
var startX;
var startY;
var lineArray = new Array();
var numOflines = 0;    
var noMorLine = 0;  
var maxLines = 1000;  
var gezaCol ="#48443e";
var anafCol ="#48443e";
var gezaThick = 5;
var anafThick = 1;
 /*= Functions
 ============================================================= */
 


function init()
{
    lineArray.
    can = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width  = canvas_dimensions.width;
    ctx.canvas.height = canvas_dimensions.height;
    startX = ( ctx.canvas.width / 2 ) - 5 ;
    startY = ctx.canvas.height;
    ctx.shadowColor = "#413e3b";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    lineArray[numOflines] = { x: startX,
                              y: startY,
                              len: 150,
                              visited:0,
                              angle:90,
                              col:gezaCol,
                              thick:gezaThick,
                              haveleaf:1,
                              level:0
                            };
    ++numOflines;
}

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getHighesLeaf()
{
  var index = 0;
  var maxHeight = ctx.canvas.height;
  for (var i = 0; i < lineArray.length; i++) 
    {
      if(lineArray[i].y < maxHeight)
      {
        maxHeight = lineArray[i].y;
        index = i;
      }
    }
    return index;
}

function getMaxLevel()
{
  var index = 0;
  var maxlevel = 0;
  for (var i = 0; i < lineArray.length; i++) 
    {
      if(lineArray[i].level < maxlevel)
      {
        maxlevel = lineArray[i].level;
        index = i;
      }
    }
    return index;
}


function drawPixle(x,y,col,thick)
{
  ctx.beginPath();
  ctx.rect(x, y, thick, 1);
  ctx.strokeStyle = col;
  ctx.stroke();
}

function drawMyLine()
{
    
    var element = null;
    for (var i = 0; i < lineArray.length; i++) 
    {
      element = lineArray[i];
      if(element.len > 0)
      { 
        while(element.angle < 0)
          element.angle += 360;
        while(element.angle >= 360)
          element.angle -= 360;
        var xInc = Math.cos((element.angle)*Math.PI/180);
        var yInc = Math.sin((element.angle)*Math.PI/180);
        /*console.log(element.angle);*/
        switch(element.level)
        {
          case 0:
            var thicknes=0;
            if(element.len > 5)
            {
              thicknes = element.len - 5;
              thicknes += 30 / Math.abs(140 - thicknes);
              drawPixle(Math.round(element.x)-thicknes/4+3,Math.round(element.y),element.col,15+thicknes/2);
            }
            else
            {
              drawPixle(Math.round(element.x)+3,Math.round(element.y),element.col,15+thicknes);
            }
            break;

          default:
            drawPixle(Math.round(element.x),Math.round(element.y),element.col,15-element.level);
            break;
        }
        
          
        
        var ranNum = Math.floor(Math.random()*16);
        if(ranNum == 5 && i > 7 )
          drawleaf(i);
        
        element.x += xInc; 
        element.y -= yInc;
        --element.len;
      }
    }


}

function activeLine()
{
  for (var i = 0; i < lineArray.length; i++)  
    if(lineArray[i].len > 0)
      return 1;
  return 0;
}

function drawleaf(index)
{
  
  leafImage(lineArray[index].x-15, lineArray[index].y);
  
}


function drawLefs(index)
{
  nameImage(lineArray[index].x-60, lineArray[index].y-10);
}

function nameImage(x,y)
{
  var name = new Image();
  name.src = "img/myname2.png";
  name.onload = function()
  {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(name, x, y);
  }
}

function leafImage(x,y)
{
  var leaf = new Image();
  leaf.src = "img/leaf2.png";
  leaf.onload = function()
  {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(leaf, x, y-15 ,30 , 30);
  }
}

function forbidAngle(angle)
{
  if(angle > 220 && angle < 320)
    return false;
  return true;
}

function addLines()
{
  var length = lineArray.length;
  var anafLen = 0;
  for (var i = 0; i < length; i++)  
    if(lineArray[i].len == 0 && lineArray[i].visited == 0)
    {
      if(forbidAngle(lineArray[i].angle))
      {
      anafLen = 20+Math.floor(Math.random()*51);
      lineArray[numOflines] = { x: lineArray[i].x + lineArray[i].thick/2, 
                                y: lineArray[i].y, 
                                len: anafLen, 
                                visited:0,
                                angle:lineArray[i].angle-15-Math.floor(Math.random()*26),
                                col:anafCol,
                                thick:anafThick,
                                haveleaf:1,
                                level:lineArray[i].level + 1
                              };                  
      ++numOflines;
      //anafLen = 30+Math.floor(Math.random()*51);
      lineArray[numOflines] = { x: lineArray[i].x + lineArray[i].thick/2, 
                                y: lineArray[i].y, 
                                len: anafLen, 
                                visited:0,
                                angle:lineArray[i].angle+15+Math.floor(Math.random()*26),
                                col:anafCol,
                                thick:anafThick,
                                haveleaf:1,
                                level:lineArray[i].level + 1
                              }; 
      ++numOflines;
      }
      lineArray[i].visited = 1;
      lineArray[i].haveleaf = 0;
    }

}

function start() 
{
      drawMyLine();
      if(activeLine() == 0)
      {
        addLines();
      }
      if(numOflines < maxLines)
      {
        timer = setTimeout(start, 10); 
      }
      else
      {
        stop();
      }
           
};

function stop() {
    drawMyLine();
    if(activeLine() == 1)
    {
      timer = setTimeout(stop, 10); 
    }
    else
    {
      /*drawLefs(getHighesLeaf());*/
      growText();
    }
};

function growText() 
{
  $('.text').fadeIn(1000);
}



$(document).ready(function() {

 /*= OnLoad
 ============================================================= */
    
    init();
   
     /*= Events
 ============================================================= */
    start();
    			
});
 
 
 
 