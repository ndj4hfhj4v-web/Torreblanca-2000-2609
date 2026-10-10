// Match the mobile scenery transform, not the actors' scrolling transform.
function syncPunkWreck(){
 if(!bossCar||bossCar.phase!=='wreck')return;
 if(bossCar.hitAt===undefined)bossCar.hitAt=-Infinity;
 if(bossCar.sceneryAnchorX===undefined)bossCar.sceneryAnchorX=bossCar.x-streetPropWorldX(0);
 bossCar.x=streetPropWorldX(bossCar.sceneryAnchorX);
}
const punkWreckActivateBase=activateBoss;
activateBoss=function(){const result=punkWreckActivateBase();syncPunkWreck();return result};
const punkWreckFootprintsBase=otherCarFootprints;
otherCarFootprints=function(){syncPunkWreck();return punkWreckFootprintsBase()};
const punkWreckDrawBase=drawBossCart;
drawBossCart=function(){
 if(!bossCar||bossCar.phase!=='wreck')return punkWreckDrawBase();
 syncPunkWreck();if(!bossCarFrames)return;
 const draw=()=>{const frame=bossCarFrames[3],scale=bossCarWidth/743,spring=policeSuspension(bossCar),x=bossCar.x-cam,y=bossCar.y;
  ctx.save();ctx.translate(x,y-45+spring.heave);ctx.rotate(spring.pitch);ctx.translate(-x,-(y-45));
  ctx.drawImage(frame.image,x-frame.anchorX*scale,y-frame.anchorY*scale,frame.image.width*scale,frame.image.height*scale);ctx.restore();};
 if(policeSceneQueue)policeSceneQueue.push({depth:bossCar.y+4,draw});else draw();
};
function strikePunkWreck(reach){
 syncPunkWreck();if(!bossCar||bossCar.phase!=='wreck'||playerDead)return false;
 const edge=bossCar.x-facing*bossCarWidth/2,ahead=(edge-player.x)*facing;
 if(ahead<=0||ahead>reach||Math.abs(player.y-(bossCar.y-10))>=16)return false;
 bossCar.hitAt=performance.now();bossCar.hitSide=facing>0?-1:1;
 triggerImpact(edge,bossCar.y-45,facing,1.25);playCarMetalImpact(false);gainRafaSpecial(6);return true;
}
const punkWreckHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){if(!playerAttackLanded&&!pakoBatAttack&&strikePunkWreck(forceKick||state==='kick'||state==='jumpKick'?120:98)){playerAttackLanded=true;return true}return punkWreckHitBase(forceKick)};
const punkWreckBatBase=pakoBatStrike;
pakoBatStrike=function(){const hit=strikePunkWreck(batHitReach);return punkWreckBatBase()||hit};
