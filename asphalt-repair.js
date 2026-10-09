// Cover the baked-in blue parking marking in backdrop coordinates.
const asphaltBackgroundBase=drawBackground;
drawBackground=function(){
 asphaltBackgroundBase();
 if(!bg.complete||!bg.naturalWidth)return;
 const scenery=mobileLayout()?2.35:1,scale=Math.max(H/bg.height,W/bg.width*.62);
 const iw=worldW*scenery,ih=bg.height*scale*scenery;
 const progress=Math.max(0,Math.min(1,cam/Math.max(1,worldW-W)));
 const ox=mobileLayout()?W*.5*(1-scenery)+(W/.8192-iw-W*.5*(1-scenery))*progress:-cam,oy=H*.72*(1-scenery);
 ctx.save();ctx.translate(ox,oy);ctx.scale(iw/bg.width,ih/bg.height);
 ctx.beginPath();ctx.moveTo(50,519);ctx.lineTo(435,519);ctx.lineTo(474,624);ctx.lineTo(73,624);ctx.closePath();ctx.clip();
 // Continue the actual neighboring curb and road, at their original grain scale.
 ctx.drawImage(bg,500,519,424,105,50,519,424,105);ctx.restore();
};
