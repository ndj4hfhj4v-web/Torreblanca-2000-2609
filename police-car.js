// Parked police car: fixed world placement, solid footprint and depth sorting.
const policeProfileImage=imgFromData('assets/vehicles/police-sevilla-current-atlas-v1.png');
const policeCar={hp:240,maxHp:240,hitAt:-Infinity,hitSide:1,endDamage:[0,0],present:true};
let policeFrames=null,policeSceneQueue=null;
function policeSpriteBounds(image,top=0,height=image.naturalHeight||image.height){
 const canvas=document.createElement('canvas');canvas.width=image.naturalWidth||image.width;canvas.height=height;
 const c=canvas.getContext('2d');c.drawImage(image,0,top,canvas.width,height,0,0,canvas.width,height);
 const data=c.getImageData(0,0,canvas.width,height).data;
 let left=canvas.width,right=0,upper=height,bottom=0;
 for(let y=0;y<height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>200){left=Math.min(left,x);right=Math.max(right,x);upper=Math.min(upper,y);bottom=Math.max(bottom,y)}
 return {image,sx:left,sy:top+upper,sw:right-left+1,sh:bottom-upper+1};
}
function preparePoliceFrames(){
 if(!policeProfileImage.complete||!policeProfileImage.naturalWidth)return;
 const image=policeProfileImage,canvas=document.createElement('canvas');
 canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
 const paint=canvas.getContext('2d');paint.drawImage(image,0,0);
 const spriteData=paint.getImageData(0,0,canvas.width,canvas.height),pixels=spriteData.data,rows=[];
 // Discard the generator's translucent matte at load time, never on each draw.
 for(let i=3;i<pixels.length;i+=4)if(pixels[i]<=200)pixels[i]=0;
 paint.putImageData(spriteData,0,0);
 let first=-1;
 for(let y=0;y<canvas.height;y++){
  let count=0;for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>200)count++;
  if(count>8&&first<0)first=y;
  if(count<=8&&first>=0){rows.push([first,y]);first=-1;}
 }
 if(first>=0)rows.push([first,canvas.height]);
 // Four transparent cutouts; shared crop size prevents damage changing scale.
 if(rows.length!==4){console.warn('Police atlas must contain four separated cars');return;}
 const bounds=rows.map(([top,bottom])=>policeSpriteBounds(canvas,top,bottom-top));
 const left=Math.min(...bounds.map(f=>f.sx)),right=Math.max(...bounds.map(f=>f.sx+f.sw));
 const height=Math.max(...bounds.map(f=>f.sh));
 policeFrames=bounds.map(f=>({image:canvas,sx:left,sy:f.sy+f.sh-height,sw:right-left,sh:height}));
}
policeProfileImage.onload=preparePoliceFrames;preparePoliceFrames();
policeCarRect=function(){
 const s=streetLayout(),base=(laneTop()+laneBottom())/2+10;
 // Register the car at the centre of the second wave's expected framing,
 // independently of the intro layout (which still positions the barrel).
 const trigger=phaseConfig.waves[1].trigger,zoom=mobileLayout()?.8192:1;
 const followCentre=mobileLayout()?(W*.5-W*.28*(1-zoom))/zoom:W*.5;
 const camera=Math.max(0,Math.min(worldW-W,trigger-followCentre));
 const offset=mobileLayout()?camera+(W/zoom-worldW*2.35-W*.5*(1-2.35))*camera/Math.max(1,worldW-W):0;
 const anchor=policeCar.sceneryAnchorX??(camera+W/(2*zoom)-s.carWidth/2-offset);
 policeCar.sceneryAnchorX=anchor;
 const frame=policeFrames?.[0];return {x:streetPropWorldX(anchor),y:base,width:s.carWidth,height:frame?s.carWidth*frame.sh/frame.sw:s.carWidth*.44};
};
policeFootprint=function(){if(!policeCar.present)return {left:-100000,right:-100000,top:-100000,bottom:-100000};const r=policeCarRect();return {left:r.x+9,right:r.x+r.width-9,top:r.y-24,bottom:r.y+4}};
const secondWavePoliceBase=activateWave;
activateWave=function(index){
 const result=secondWavePoliceBase(index);
 if(index===1){
  if(!pakoGroundBat.available){
   const r=policeCarRect();pakoGroundBat.x=r.x+r.width-22;pakoGroundBat.y=r.y-40;
   pakoGroundBat.available=true;pakoGroundBat.collected=false;anchorGroundBat();
  }
 }
 return result;
};
function policeDamageStage(){return policeCar.hp===0?3:policeCar.hp<=80?2:policeCar.hp<=160?1:0}
// Both sprites face left: index 0 is the bonnet, index 1 the boot.
function policeEndDamageStage(vehicle,end){
 const damage=vehicle.endDamage?.[end]||0,limit=vehicle.maxHp;
 return damage>=limit?3:damage>=limit*2/3?2:damage>=limit/3?1:0;
}
function recordPoliceEndDamage(vehicle,amount,side){
 if(amount<=0)return;
 vehicle.endDamage??=[0,0];const end=side<0?0:1;
 vehicle.endDamage[end]=Math.min(vehicle.maxHp,vehicle.endDamage[end]+amount);
 vehicle.hitSide=side;
}
function policeGlassZones(vehicle){return [0,1].reduce((bits,end)=>bits|(policeEndDamageStage(vehicle,end)>=2?1<<end:0),0)}
function policeSuspension(vehicle=policeCar){
 const age=(performance.now()-vehicle.hitAt)/1000;
 if(age<0||age>.9)return {heave:0,pitch:0};
 const bounce=Math.exp(-5.5*age)*Math.sin(20*age);
 return {heave:bounce*4,pitch:bounce*.018*(vehicle.hitSide||1)};
}
const policeNightSpriteCache=new WeakMap();
function policeNightSprite(source){
 if(policeNightSpriteCache.has(source))return policeNightSpriteCache.get(source);
 const sprite=document.createElement('canvas');sprite.width=source.naturalWidth||source.width;sprite.height=source.naturalHeight||source.height;
 const paint=sprite.getContext('2d');paint.filter='brightness(.68) saturate(.82)';paint.drawImage(source,0,0);
 paint.filter='none';paint.globalCompositeOperation='source-atop';paint.fillStyle='rgba(27,53,87,.16)';paint.fillRect(0,0,sprite.width,sprite.height);
 policeNightSpriteCache.set(source,sprite);return sprite;
}
function paintPoliceCar(r=policeCarRect(),vehicle=policeCar,stage=policeDamageStage()){
 if(!policeFrames?.length)return;
 const x=r.x-cam;if(x+r.width<0||x>W/.8192+100)return;
 const frame=policeFrames[Math.min(stage,policeFrames.length-1)],height=r.width*frame.sh/frame.sw,y=r.y-height;
 ctx.save();ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+r.width*.5,r.y-3,r.width*.45,7,0,0,Math.PI*2);ctx.fill();
 const drawSprite=()=>{
  if(!vehicle.endDamage){ctx.drawImage(policeNightSprite(frame.image),frame.sx,frame.sy,frame.sw,frame.sh,x,y,r.width,height);return;}
  // Split at the centre pillar; an undamaged end stays intact, even at zero HP.
  const split=.53;
  for(let end=0;end<2;end++){
   const part=policeFrames[policeEndDamageStage(vehicle,end)];
   ctx.save();ctx.beginPath();ctx.rect(x+r.width*(end?split:0),y-40,r.width*(end?1-split:split),height+80);ctx.clip();
   ctx.drawImage(policeNightSprite(part.image),part.sx,part.sy,part.sw,part.sh,x,y,r.width,height);ctx.restore();
  }
 };
 const wheels=[.19,.79].map(position=>({x:x+r.width*position,y:r.y-r.width*.075,radius:r.width*.073}));
 // Wheels stay planted; only the body rocks on its suspension.
 for(const wheel of wheels){ctx.save();ctx.beginPath();ctx.arc(wheel.x,wheel.y,wheel.radius,0,Math.PI*2);ctx.clip();drawSprite();ctx.restore()}
 ctx.save();ctx.beginPath();ctx.rect(x-40,y-40,r.width+80,height+80);
 for(const wheel of wheels){ctx.moveTo(wheel.x+wheel.radius,wheel.y);ctx.arc(wheel.x,wheel.y,wheel.radius,0,Math.PI*2)}
 ctx.clip('evenodd');
 const suspension=policeSuspension(vehicle),pivotX=x+r.width*.5,pivotY=r.y-r.width*.09;
 ctx.translate(pivotX,pivotY+suspension.heave);ctx.rotate(suspension.pitch);ctx.translate(-pivotX,-pivotY);drawSprite();
 const beat=performance.now()%800,side=beat<400?0:1,on=beat%400<100||(beat%400>160&&beat%400<260);
 if(on&&vehicle.hp>0){
  ctx.globalCompositeOperation='lighter';const lx=x+r.width*(side?.60:.45),ly=y+height*.045;
  const glow=ctx.createRadialGradient(lx,ly,1,lx,ly,25);glow.addColorStop(0,'rgba(170,225,255,.95)');glow.addColorStop(.25,'rgba(35,120,255,.7)');glow.addColorStop(1,'rgba(20,70,255,0)');
  ctx.fillStyle=glow;ctx.fillRect(lx-25,ly-25,50,50);ctx.fillStyle='#cff5ff';ctx.fillRect(lx-5,ly-2,10,4);
 }
 ctx.restore();ctx.restore();
}
drawPoliceCar=function(){if(!policeCar.present)return;if(policeSceneQueue)policeSceneQueue.push({depth:policeFootprint().bottom,draw:paintPoliceCar});else paintPoliceCar()};
// The mid-stage car uses exactly the same police sprites and renderer. Its
// damage and Heavy's scripted bat attack keep their existing state and timing.
heavyStreetCar.width=336;
heavyStreetCar.endDamage=[0,0];
const policeHeavyDamageBase=damageHeavyStreetCar;
damageHeavyStreetCar=function(...args){
 const result=policeHeavyDamageBase(...args);
 if(result&&args[2]&&pakoHasBat)recordPoliceEndDamage(heavyStreetCar,args[0],facing>0?-1:1);return result;
};
heavyStreetCarCanHit=function(reach){
 const position=heavyStreetCarPosition(),ahead=(position.x-facing*heavyStreetCar.width/2-player.x)*facing;
 return introPhase==='done'&&!playerDead&&ahead>0&&ahead<reach&&Math.abs(player.y-(position.y-10))<meleeLaneTolerance;
};
const policeHeavyDestructionBase=updateHeavyCarDestruction;
updateHeavyCarDestruction=function(...args){
 const before=heavyStreetCar.hp,result=policeHeavyDestructionBase(...args);
 recordPoliceEndDamage(heavyStreetCar,before-heavyStreetCar.hp,heavyEnemy.carApproachSide||-1);return result;
};
const policeCharacterResetBase=selectCharacter;
selectCharacter=function(...args){policeCar.endDamage=[0,0];heavyStreetCar.endDamage=[0,0];policeCar.present=true;delete policeCar.sceneryAnchorX;return policeCharacterResetBase(...args)};
drawHeavyStreetCar=function(){
 if(introPhase!=='done')return;
 const position=heavyStreetCarPosition(),r={x:position.x-heavyStreetCar.width/2,y:position.y,width:heavyStreetCar.width};
 const draw=()=>paintPoliceCar(r,heavyStreetCar,heavyStreetCarStage());
 if(policeSceneQueue)policeSceneQueue.push({depth:position.y+4,draw});else draw();
};
const policeSceneBase=drawIntroCar;
drawIntroCar=function(){policeSceneQueue=comparisonMode?null:[];policeSceneBase()};
const policeActorDrawBase=drawActorImage;
drawActorImage=function(actor,image,scale){
 if(policeSceneQueue){policeSceneQueue.push({depth:actor.y,draw:()=>policeActorDrawBase(actor,image,scale)});return}
 return policeActorDrawBase(actor,image,scale);
};
const policePlayerDrawBase=drawPlayer;
drawPlayer=function(){
 if(!policeSceneQueue)return policePlayerDrawBase();
 policeSceneQueue.push({depth:player.y,draw:()=>policePlayerDrawBase()});
 const queue=policeSceneQueue;policeSceneQueue=null;queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
};
function policeCarCanHit(reach){
 if(introPhase!=='done'||playerDead||!policeCar.present)return false;
 const r=policeFootprint(),target=facing>0?r.left:r.right,ahead=(target-player.x)*facing;
 // Only a strike from an end of the car, never from below its body.
 return ahead>0&&ahead<=reach&&Math.abs(player.y-(policeCarRect().y-10))<meleeLaneTolerance;
}
function damagePoliceCar(amount,reach,weaponHit=false){
 if(!policeCarCanHit(reach))return false;
 if(weaponHit&&pakoHasBat)policeCar.hp=Math.max(0,policeCar.hp-amount);
 policeCar.hitAt=performance.now();
 const r=policeFootprint(),x=Math.max(r.left,Math.min(r.right,player.x+facing*reach*.55));
 policeCar.hitSide=x<(r.left+r.right)/2?-1:1;
 if(weaponHit&&pakoHasBat)recordPoliceEndDamage(policeCar,amount,policeCar.hitSide);
 triggerImpact(x,policeCarRect().y-45,facing,1.25);playCarMetalImpact(policeCar.hp===0);gainRafaSpecial(6);return true;
}
const policeHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){
 if(!playerAttackLanded&&!pakoBatAttack){const kick=forceKick||state==='kick'||state==='jumpKick';if(damagePoliceCar(kick?18:14,kick?120:98)){playerAttackLanded=true;return true}}
 return policeHitBase(forceKick);
};
const policeBatBase=pakoBatStrike;
pakoBatStrike=function(){const hit=damagePoliceCar(22,batHitReach,true);return policeBatBase()||hit};
const policeRafaBase=tryRafaSpecialHit;
tryRafaSpecialHit=function(launch=false){const hit=damagePoliceCar(launch?40:24,launch?210:180);return policeRafaBase(launch)||hit};
const policeStartBase=startIntro;
startIntro=function(){policeCar.hp=policeCar.maxHp;policeCar.endDamage=[0,0];heavyStreetCar.endDamage=[0,0];policeCar.present=true;delete policeCar.sceneryAnchorX;policeCar.hitAt=-Infinity;policeSceneQueue=null;return policeStartBase()};
const policeUpdateBase=update;
update=function(dt){
 const x=player.x,y=player.y;policeUpdateBase(dt);
 // Contact pushes and specials must obey the same parked footprint as walking.
 if(introPhase==='done'&&carBlocksAt(player.x,player.y)&&!carBlocksAt(x,y))resolveWorldCollision(x,y);
};
