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
