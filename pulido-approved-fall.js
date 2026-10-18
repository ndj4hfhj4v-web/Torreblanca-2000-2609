// Only Pulido's approved falling/down poses. All other animation paths remain original.
(()=>{
 const data=window.pulidoFallFrames;
 if(!data)return;
 const images=data.frames.map(f=>{const i=new Image();i.src=f.src;return i;});
 let age=0,wasDown=false;
 const originalUpdate=update;
 update=function(dt){
  const paused=gamePaused||document.hidden||window.gameAudioSettings?.isOpen;
  const result=originalUpdate(dt);
  if(paused)return result;
  const down=selectedCharacter==='pulido'&&(playerKnocked||playerDead);
  age=down?(wasDown?age+dt*16.67:0):0;wasDown=down;
  return result;
 };
 const originalDraw=drawPlayer;
 drawPlayer=function(){
  if(selectedCharacter!=='pulido'||introPhase!=='done'||!(playerKnocked||playerDead)||comparisonMode||images.some(i=>!i.complete||!i.naturalWidth))return originalDraw();
  const index=age<160?0:age<330?1:2,f=data.frames[index],image=images[index];
  const scale=mobileGameplayScale(.71)*data.scale;
  const draw=()=>withActorNightLight(player,()=>{
   ctx.save();ctx.translate(player.x-cam,player.y);ctx.scale(facing*scale,scale);ctx.drawImage(image,-f.x,-f.y);ctx.restore();
  });
  if(!policeSceneQueue)return draw();
  policeSceneQueue.push({depth:player.y,draw});
  const queue=policeSceneQueue;policeSceneQueue=null;queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
 };
})();
