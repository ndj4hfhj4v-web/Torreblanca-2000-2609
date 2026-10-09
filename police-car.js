// Parked police car: fixed world placement, solid footprint and depth sorting.
const policeProfileImage=imgFromData('assets/vehicles/police-profile-v1.png');
const policeDamageImage=imgFromData('assets/vehicles/police-profile-damage-v1.png');
const policeCar={hp:240,maxHp:240,hitAt:-Infinity,hitSide:1};
let policeFrames=null,policeSceneQueue=null;
function policeSpriteBounds(image,top=0,height=image.naturalHeight){
 const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=height;
 const c=canvas.getContext('2d');c.drawImage(image,0,top,image.naturalWidth,height,0,0,canvas.width,height);
 const data=c.getImageData(0,0,canvas.width,height).data;
 let left=canvas.width,right=0,upper=height,bottom=0;
 for(let y=0;y<height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>200){left=Math.min(left,x);right=Math.max(right,x);upper=Math.min(upper,y);bottom=Math.max(bottom,y)}
 return {image,sx:left,sy:top+upper,sw:right-left+1,sh:bottom-upper+1};
}
function preparePoliceFrames(){
 if(!policeProfileImage.complete||!policeProfileImage.naturalWidth)return;
 const intact=policeSpriteBounds(policeProfileImage);policeFrames=[intact];
 if(policeDamageImage.complete&&policeDamageImage.naturalWidth){
  const rows=[0,558,1051,1536];
  for(let i=0;i<3;i++)policeFrames.push(policeSpriteBounds(policeDamageImage,rows[i],rows[i+1]-rows[i]));
 }
}
policeProfileImage.onload=preparePoliceFrames;policeDamageImage.onload=preparePoliceFrames;preparePoliceFrames();
policeCarRect=function(){
 const s=streetLayout(),base=laneTop()+(laneBottom()-laneTop())*.58;
 const frame=policeFrames?.[0];return {x:s.carX,y:base,width:s.carWidth,height:frame?s.carWidth*frame.sh/frame.sw:s.carWidth*.44};
};
policeFootprint=function(){const r=policeCarRect();return {left:r.x+9,right:r.x+r.width-9,top:r.y-24,bottom:r.y+4}};
function policeDamageStage(){return policeCar.hp===0?3:policeCar.hp<=80?2:policeCar.hp<=160?1:0}
function policeSuspension(){
 const age=(performance.now()-policeCar.hitAt)/1000;
 if(age<0||age>.9)return {heave:0,pitch:0};
 const bounce=Math.exp(-5.5*age)*Math.sin(20*age);
 return {heave:bounce*4,pitch:bounce*.018*policeCar.hitSide};
}
function paintPoliceCar(){
 if(!policeFrames?.length)return;
 const r=policeCarRect(),x=r.x-cam;if(x+r.width<0||x>W/.8192+100)return;
 const frame=policeFrames[Math.min(policeDamageStage(),policeFrames.length-1)],height=r.width*frame.sh/frame.sw,y=r.y-height;
 ctx.save();ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+r.width*.5,r.y-3,r.width*.45,7,0,0,Math.PI*2);ctx.fill();
 const drawSprite=()=>ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x,y,r.width,height);
 const wheels=[.183,.855].map(position=>({x:x+r.width*position,y:r.y-r.width*.081,radius:r.width*.085}));
 // Wheels stay planted; only the body rocks on its suspension.
 for(const wheel of wheels){ctx.save();ctx.beginPath();ctx.arc(wheel.x,wheel.y,wheel.radius,0,Math.PI*2);ctx.clip();drawSprite();ctx.restore()}
 ctx.save();ctx.beginPath();ctx.rect(x-40,y-40,r.width+80,height+80);
 for(const wheel of wheels){ctx.moveTo(wheel.x+wheel.radius,wheel.y);ctx.arc(wheel.x,wheel.y,wheel.radius,0,Math.PI*2)}
 ctx.clip('evenodd');
 const suspension=policeSuspension(),pivotX=x+r.width*.5,pivotY=r.y-r.width*.09;
 ctx.translate(pivotX,pivotY+suspension.heave);ctx.rotate(suspension.pitch);ctx.translate(-pivotX,-pivotY);drawSprite();
 const beat=performance.now()%800,side=beat<400?0:1,on=beat%400<100||(beat%400>160&&beat%400<260);
 if(on&&policeCar.hp>0){
  ctx.globalCompositeOperation='lighter';const lx=x+r.width*(side?.63:.50),ly=y+height*.045;
  const glow=ctx.createRadialGradient(lx,ly,1,lx,ly,25);glow.addColorStop(0,'rgba(170,225,255,.95)');glow.addColorStop(.25,'rgba(35,120,255,.7)');glow.addColorStop(1,'rgba(20,70,255,0)');
  ctx.fillStyle=glow;ctx.fillRect(lx-25,ly-25,50,50);ctx.fillStyle='#cff5ff';ctx.fillRect(lx-5,ly-2,10,4);
 }
 ctx.restore();ctx.restore();
}
drawPoliceCar=function(){if(policeSceneQueue)policeSceneQueue.push({depth:policeFootprint().bottom,draw:paintPoliceCar});else paintPoliceCar()};
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
 if(introPhase!=='done'||playerDead||policeCar.hp<=0)return false;
 const r=policeFootprint(),target=Math.max(r.left,Math.min(r.right,player.x)),ahead=(target-player.x)*facing;
 const dy=Math.max(r.top-player.y,0,player.y-r.bottom);
 return ahead>=0&&ahead<=reach&&dy<34;
}
function damagePoliceCar(amount,reach){
 if(!policeCarCanHit(reach))return false;
 policeCar.hp=Math.max(0,policeCar.hp-amount);policeCar.hitAt=performance.now();
 const r=policeFootprint(),x=Math.max(r.left,Math.min(r.right,player.x+facing*reach*.55));
 policeCar.hitSide=x<(r.left+r.right)/2?-1:1;
 triggerImpact(x,policeCarRect().y-45,facing,1.25);playCarMetalImpact(policeCar.hp===0);gainRafaSpecial(6);return true;
}
const policeHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){
 if(!playerAttackLanded&&!pakoBatAttack){const kick=forceKick||state==='kick'||state==='jumpKick';if(damagePoliceCar(kick?18:14,kick?120:98)){playerAttackLanded=true;return true}}
 return policeHitBase(forceKick);
};
const policeBatBase=pakoBatStrike;
pakoBatStrike=function(){const hit=damagePoliceCar(22,batHitReach);return policeBatBase()||hit};
const policeRafaBase=tryRafaSpecialHit;
tryRafaSpecialHit=function(launch=false){const hit=damagePoliceCar(launch?40:24,launch?210:180);return policeRafaBase(launch)||hit};
const policeStartBase=startIntro;
startIntro=function(){policeCar.hp=policeCar.maxHp;policeCar.hitAt=-Infinity;policeSceneQueue=null;return policeStartBase()};
const policeUpdateBase=update;
update=function(dt){
 const x=player.x,y=player.y;policeUpdateBase(dt);
 // Contact pushes and specials must obey the same parked footprint as walking.
 if(introPhase==='done'&&carBlocksAt(player.x,player.y)&&!carBlocksAt(x,y))resolveWorldCollision(x,y);
};
