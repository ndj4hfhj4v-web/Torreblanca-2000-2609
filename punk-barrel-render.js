// The cylinder stays horizontal. Its rolling phase turns around its long axis,
// never end-over-end like a wheel or a tumbling prop.
function paintHorizontalPunkBarrel(ctx,image,x,groundY,lift,length,rollAngle=null){
 const diameter=length*image.width/image.height;
 ctx.save();ctx.translate(x,groundY-lift-diameter/2);ctx.rotate(Math.PI/2);
 ctx.drawImage(image,-diameter/2,-length/2,diameter,length);
 if(rollAngle!==null){
  // A moving surface seam makes axial rotation readable without tilting it.
  ctx.save();ctx.beginPath();ctx.rect(-diameter*.34,-length*.34,diameter*.68,length*.68);ctx.clip();
  ctx.globalAlpha=Math.max(0,Math.cos(rollAngle))*.24;ctx.strokeStyle='#10191e';ctx.lineWidth=Math.max(1,diameter*.025);
  const seam=Math.sin(rollAngle)*diameter*.34;ctx.beginPath();ctx.moveTo(seam,-length*.34);ctx.lineTo(seam,length*.34);ctx.stroke();ctx.restore();
 }
 ctx.restore();
}
const punkBarrelProfileCache=new WeakMap();
function paintProfilePunkBarrel(ctx,image,x,groundY,lift,diameter,angle=0){
 let frame=punkBarrelProfileCache.get(image);
 if(!frame){frame=PunkBossPreview.prepare(image,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},1,1).frames[0];punkBarrelProfileCache.set(image,frame)}
 const sprite=frame.image,w=sprite.width,h=sprite.height,scale=diameter/h;
 // The near circular face turns inside its rim; the visible cylinder depth
 // stays on the far side instead of orbiting around the cap like a flat cutout.
 const cx=w*.334,cy=h*.552,rx=w*.298,ry=h*.403;
 ctx.save();ctx.translate(x-cx*scale,groundY-lift-diameter);ctx.scale(scale,scale);ctx.drawImage(sprite,0,0);
 ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.clip();
 ctx.translate(cx,cy);ctx.scale(rx,ry);ctx.rotate(angle);ctx.scale(1/rx,1/ry);ctx.translate(-cx,-cy);ctx.drawImage(sprite,0,0);ctx.restore();ctx.restore();
}
