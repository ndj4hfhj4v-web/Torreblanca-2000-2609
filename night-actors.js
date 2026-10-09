// Non-destructive lighting, applied only while an actor is actually drawn.
function actorNightLight(actor){
 const scenery=mobileLayout()?2.35:1,scale=Math.max(H/bg.height,W/bg.width*.62);
 const iw=worldW*scenery,ih=bg.height*scale*scenery;
 const progress=Math.max(0,Math.min(1,cam/Math.max(1,worldW-W)));
 const ox=mobileLayout()?W*.5*(1-scenery)+(W/.8192-iw-W*.5*(1-scenery))*progress:-cam,oy=H*.72*(1-scenery);
 let warm=0,blue=0;
 for(const sourceX of [600,1500,1800,2400,3000,3600,4200,4800]){
  const dx=(actor.x-cam-(ox+sourceX*iw/bg.width))/180;
  const dy=(actor.y-(oy+528*ih/bg.height))/140;
  warm=Math.max(warm,Math.max(0,1-Math.hypot(dx,dy)));
 }
 const beat=performance.now()%800,on=beat%400<100||(beat%400>160&&beat%400<260);
 if(on&&introPhase!=='none'){
  const cars=[{rect:policeCarRect(),hp:policeCar.hp}];
  if(introPhase==='done'){const p=heavyStreetCarPosition();cars.push({rect:{x:p.x-heavyStreetCar.width/2,y:p.y,width:heavyStreetCar.width},hp:heavyStreetCar.hp})}
  for(const car of cars){if(car.hp<=0)continue;
   const dx=(actor.x-(car.rect.x+car.rect.width*(beat<400?.50:.63)))/260,dy=(actor.y-car.rect.y)/180;
   blue=Math.max(blue,Math.max(0,1-Math.hypot(dx,dy)));
  }
 }
 return {warm,blue};
}
const actorNightTintCache=[];
function actorNightTintImage(image,warm,blue){
 const w=Math.round(warm*3)/3,b=Math.round(blue*3)/3,key=w+':'+b;
 const cached=actorNightTintCache.find(entry=>entry.image===image&&entry.key===key);
 if(cached)return cached.canvas;
 const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
 if(!width||!height)return image;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const paint=canvas.getContext('2d');paint.drawImage(image,0,0);
 const warmWeight=w*(1-b),coldWeight=(1-w)*(1-b);
 const r=Math.round(20*coldWeight+255*warmWeight+30*b),g=Math.round(42*coldWeight+173*warmWeight+90*b),bl=Math.round(85*coldWeight+65*warmWeight+255*b);
 paint.globalCompositeOperation='source-atop';paint.fillStyle=`rgba(${r},${g},${bl},${.12+.08*b})`;paint.fillRect(0,0,width,height);
 actorNightTintCache.push({image,key,canvas});if(actorNightTintCache.length>16)actorNightTintCache.shift();
 return canvas;
}
function withActorNightLight(actor,draw){
 if(comparisonMode||!bg.complete||!bg.naturalWidth)return draw();
 const {warm,blue}=actorNightLight(actor);
 const brightness=.70+.20*warm+.12*blue,saturation=.86+.12*warm+.15*blue;
 const drawImage=ctx.drawImage;
 ctx.save();
 try{
  ctx.filter=`brightness(${brightness}) saturate(${saturation})`;
  ctx.drawImage=function(image,...args){return drawImage.call(this,actorNightTintImage(image,warm,blue),...args)};
  return draw();
 }finally{ctx.drawImage=drawImage;ctx.restore()}
}
const nightActorDrawBase=drawActorImage;
drawActorImage=function(actor,image,scale){
 const draw=()=>withActorNightLight(actor,()=>nightActorDrawBase(actor,image,scale));
 if(policeSceneQueue){policeSceneQueue.push({depth:actor.y,draw});return}
 return draw();
};
const nightPlayerDrawBase=drawPlayer;
drawPlayer=function(){
 if(!policeSceneQueue)return withActorNightLight(player,()=>nightPlayerDrawBase());
 // Avoid filtering the entire depth queue (cars and other actors included).
 policeSceneQueue.push({depth:player.y,draw:()=>withActorNightLight(player,()=>policePlayerDrawBase())});
 const queue=policeSceneQueue;policeSceneQueue=null;
 queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
};
