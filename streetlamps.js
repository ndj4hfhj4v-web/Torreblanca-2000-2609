// Front-facing lamps share the backdrop's exact coordinates and scroll transform.
const streetlampImage=imgFromData('assets/props/streetlamp-front-v1.png');
let streetlampFrame=null;
function prepareStreetlamp(){if(streetlampImage.complete&&streetlampImage.naturalWidth)streetlampFrame=policeSpriteBounds(streetlampImage)}
streetlampImage.onload=prepareStreetlamp;prepareStreetlamp();
const streetlampBackgroundBase=drawBackground;
drawBackground=function(){
 streetlampBackgroundBase();
 if(!streetlampFrame||!bg.complete||!bg.naturalWidth)return;
 const scenery=mobileLayout()?2.35:1,scale=Math.max(H/bg.height,W/bg.width*.62);
 const iw=worldW*scenery,ih=bg.height*scale*scenery;
 const progress=Math.max(0,Math.min(1,cam/Math.max(1,worldW-W)));
 const ox=mobileLayout()?W*.5*(1-scenery)+(W/.8192-iw-W*.5*(1-scenery))*progress:-cam,oy=H*.72*(1-scenery);
 const frame=streetlampFrame,height=180,width=height*frame.sw/frame.sh;
 ctx.save();ctx.translate(ox,oy);ctx.scale(iw/bg.width,ih/bg.height);
 // Bases sit on the sidewalk; no obstruction of the playable asphalt.
 // Leave the bus shelter (approximately x=1140..1420) clear.
 for(const x of [600,1500,1800,2400,3000,3600,4200,4800]){
  ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x-width*.50,512-height,width,height);
 }
 ctx.restore();
};
