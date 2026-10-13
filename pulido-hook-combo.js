// All six fighters: two connected punches unlock a manual one-second hook.
const pulidoHookImage=imgFromData('assets/characters/pulido/uppercut-combo-v1.png');
const pulidoHookFrames=[];
let pulidoHookBodyHeight=0,pulidoHookCount=0,pulidoHookGap=0,pulidoHookWindow=0,pulidoHookAttack=null,pulidoHookTarget=null;
function preparePulidoHook(){
 if(!pulidoHookImage.complete||!pulidoHookImage.naturalWidth)return;
 pulidoHookFrames.length=0;const w=pulidoHookImage.naturalWidth/3,h=pulidoHookImage.naturalHeight/2;
 for(let i=0;i<6;i++){
  const c=document.createElement('canvas');c.width=w;c.height=h;const p=c.getContext('2d');p.drawImage(pulidoHookImage,i%3*w,Math.floor(i/3)*h,w,h,0,0,w,h);
  const data=p.getImageData(0,0,w,h),d=data.data;let top=h,bottom=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4;if(d[k+3]<=200)d[k+3]=0;else{top=Math.min(top,y);bottom=Math.max(bottom,y)}}
  p.putImageData(data,0,0);let left=w,right=0;
  for(let y=Math.max(0,bottom-Math.ceil((bottom-top)*.16));y<=bottom;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>200){left=Math.min(left,x);right=Math.max(right,x)}
  pulidoHookFrames.push({image:c,anchorX:(left+right)/2,anchorY:bottom+1,height:bottom-top+1});
 }
 pulidoHookBodyHeight=pulidoHookFrames[5].height;
}
pulidoHookImage.onload=preparePulidoHook;preparePulidoHook();
const characterHookVisuals={};
const characterHookPaths={rafa:'rafa-king/idle.png',salvi:'salvi/f1.png',cajaman:'cajaman/idle.png',casta:'casta/idle1.png',pako:'pako/idle.png'};
for(const [name,path] of Object.entries(characterHookPaths)){
 const entry=characterHookVisuals[name]={frames:[],bodyHeight:0,referenceHeight:0};
 const sheet=imgFromData('assets/characters/hooks/'+name+'-uppercut-v1.png'),original=imgFromData('assets/characters/'+path);
 const prepare=()=>{
  if(!sheet.complete||!sheet.naturalWidth||!original.complete||!original.naturalWidth)return;
  const w=sheet.naturalWidth/3,h=sheet.naturalHeight/2;entry.frames.length=0;
  for(let i=0;i<6;i++){
   const c=document.createElement('canvas');c.width=w;c.height=h;const p=c.getContext('2d');p.drawImage(sheet,i%3*w,Math.floor(i/3)*h,w,h,0,0,w,h);
   const data=p.getImageData(0,0,w,h),d=data.data;let top=h,bottom=-1;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4;if(d[k+3]<=200)d[k+3]=0;else{top=Math.min(top,y);bottom=Math.max(bottom,y)}}
   p.putImageData(data,0,0);let left=w,right=0;
   for(let y=Math.max(0,bottom-Math.ceil((bottom-top)*.18));y<=bottom;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>200){left=Math.min(left,x);right=Math.max(right,x)}
   entry.frames.push({image:c,anchorX:(left+right)/2,anchorY:bottom+1,height:bottom-top+1});
  }
  entry.bodyHeight=entry.frames[5].height;
  const c=document.createElement('canvas');c.width=original.naturalWidth;c.height=original.naturalHeight;const p=c.getContext('2d');p.drawImage(original,0,0);
  const d=p.getImageData(0,0,c.width,c.height).data;let top=c.height,bottom=-1;
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>40){top=Math.min(top,y);bottom=Math.max(bottom,y)}
  entry.referenceHeight=bottom-top+1;
 };
 sheet.onload=prepare;original.onload=prepare;prepare();
}
function activeHookVisual(){return selectedCharacter==='pulido'?{frames:pulidoHookFrames,bodyHeight:pulidoHookBodyHeight,referenceHeight:225}:characterHookVisuals[selectedCharacter];}
function clearPulidoHook(){pulidoHookCount=0;pulidoHookGap=0;pulidoHookWindow=0;pulidoHookAttack=null;pulidoHookTarget=null;}
function pulidoHookPlayable(){return (selectedCharacter==='pulido'||Object.hasOwn(characterHookPaths,selectedCharacter))&&introPhase==='done'&&!comparisonMode&&!playerDead&&!playerKnocked&&!timeExpired&&!stageClear.active&&!stageClear.finished&&!continueCue.active&&!pakoHasBat&&!jumpActive&&!bossFaceoff&&!(typeof punkEntrance!=='undefined'&&punkEntrance&&punkEntrance.phase!=='combat');}
function pulidoHookReady(){return pulidoHookPlayable()&&pulidoHookWindow>0&&!pulidoAttack&&!pulidoHookAttack&&playerHitTimer<=0&&activeHookVisual()?.frames.length===6;}
function startPulidoHook(){
 if(!pulidoHookReady())return false;
 pulidoHookWindow=0;pulidoHookGap=0;pulidoHookCount=0;pulidoHookAttack={elapsed:0,landed:false};
 pulidoAttack=null;attackTimer=1;playerAttackLanded=false;state='hookWindup';zPressed=false;xPressed=false;return true;
}
const hookPunchStartBase=startPulidoAttack;
startPulidoAttack=function(kind){
 if(pulidoHookPlayable()){
  if(kind!=='punch'||pulidoHookWindow>0||pulidoHookGap<=0){pulidoHookCount=0;pulidoHookWindow=0;pulidoHookTarget=null;}
 }
 return hookPunchStartBase(kind);
};
const hookPunchUpdateBase=updatePulidoAttack;
const hookConnectedPunchBase=tryPlayerHit;
tryPlayerHit=function(...args){
 const attack=pulidoAttack,eligible=pulidoHookPlayable()&&attack?.kind==='punch'&&!pulidoHookAttack&&!pakoHasBat&&!jumpActive;
 const targets=eligible?combatActors().map(actor=>({actor,hp:actor.hp})):[];
 const result=hookConnectedPunchBase(...args);
 const hit=targets.find(entry=>entry.actor.hp<entry.hp);
 if(hit){attack.hookEnemyHit=true;attack.hookEnemyTarget=hit.actor;}
 return result;
};
updatePulidoAttack=function(dt){
 const attack=pulidoAttack,result=hookPunchUpdateBase(dt);
 if(attack?.kind==='punch'&&pulidoAttack!==attack&&pulidoHookPlayable()){
  if(!attack.hookEnemyHit){pulidoHookCount=0;pulidoHookGap=0;pulidoHookTarget=null;return result;}
  if(pulidoHookTarget!==attack.hookEnemyTarget)pulidoHookCount=0;
  pulidoHookTarget=attack.hookEnemyTarget;pulidoHookCount++;pulidoHookGap=850;
  if(pulidoHookCount>=2){
   pulidoHookWindow=1000;pulidoHookGap=0;
   // Do not let an extra buffered normal punch consume the hook opportunity.
   if(pulidoAttack){pulidoAttack=null;attackTimer=0;state='idle';}
  }
 }
 return result;
};
function strikePulidoHook(){
 for(const actor of combatActors()){
  if(actor.dead||actor.knocked||actor.hidden||(actor.x-player.x)*facing<=0||Math.abs(actor.x-player.x)>=120||Math.abs(actor.y-player.y)>=meleeLaneTolerance)continue;
  const damaged=damageEnemy(actor,22,facing,true);playerAttackLanded=true;
  if(damaged&&actor!==jefe)knockDownFromAirKick(actor,facing);
  return damaged;
 }
 return false;
}
const hookGameplayUpdateBase=update;
update=function(dt){
 if(typeof gamePaused!=='undefined'&&gamePaused||window.gameAudioSettings?.isOpen)return hookGameplayUpdateBase(dt);
 if(!pulidoHookPlayable()||playerHitTimer>0){if(pulidoHookAttack){attackTimer=0;state=playerDead?'dead':playerKnocked?'down':'idle';}clearPulidoHook();}
 else{
  pulidoHookWindow=Math.max(0,pulidoHookWindow-dt*16.67);pulidoHookGap=Math.max(0,pulidoHookGap-dt*16.67);
  if(!pulidoAttack&&!pulidoHookAttack&&pulidoHookWindow===0&&pulidoHookGap===0)pulidoHookCount=0;
 }
 if(pulidoHookAttack){attackTimer=1;zPressed=false;xPressed=false;pulidoAttack=null;}
 const result=hookGameplayUpdateBase(dt);
 if(pulidoHookAttack){
  if(!pulidoHookPlayable()||playerHitTimer>0){clearPulidoHook();attackTimer=0;return result;}
  const move=pulidoHookAttack;move.elapsed+=dt*16.67;state=move.elapsed<175?'hookWindup':move.elapsed<320?'hookImpact':'hookRecover';
  if(move.elapsed>=175&&!move.landed){move.landed=true;strikePulidoHook();}
  if(move.elapsed>=540){pulidoHookAttack=null;attackTimer=0;state='idle';}
 }
 return result;
};
const hookPlayerDrawBase=drawPlayer;
drawPlayer=function(){
 const visual=activeHookVisual();
 if(!pulidoHookAttack||visual?.frames.length!==6||!pulidoHookPlayable())return hookPlayerDrawBase();
 const durations=[100,75,65,80,95,125];let index=0,end=durations[0];while(pulidoHookAttack.elapsed>=end&&index<5)end+=durations[++index];
 const frame=visual.frames[index],scale=mobileGameplayScale(selectedCharacter==='casta'?.58:.71)*visual.referenceHeight/visual.bodyHeight;
 const draw=()=>withActorNightLight(player,()=>{ctx.save();ctx.translate(player.x-cam,player.y);ctx.scale(facing,1);ctx.drawImage(frame.image,-frame.anchorX*scale,-frame.anchorY*scale,frame.image.width*scale,frame.image.height*scale);ctx.restore()});
 if(!policeSceneQueue)return draw();
 policeSceneQueue.push({depth:player.y,draw});const queue=policeSceneQueue;policeSceneQueue=null;queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
};
const hookSelectBase=selectCharacter;
selectCharacter=function(...args){clearPulidoHook();return hookSelectBase(...args)};
const hookIntroBase=startIntro;
startIntro=function(...args){clearPulidoHook();return hookIntroBase(...args)};
const pulidoHookButton=document.createElement('button');pulidoHookButton.id='pulidoHookButton';pulidoHookButton.textContent='GANCHO';pulidoHookButton.hidden=true;pulidoHookButton.setAttribute('aria-label','Gancho');
pulidoHookButton.style.cssText='position:fixed;z-index:45;border-radius:50%;border:3px solid #ffd290;background:#a64f15e8;color:white;font:bold 13px Arial;box-shadow:0 0 12px #ffb53688;touch-action:none;user-select:none;cursor:pointer';document.body.appendChild(pulidoHookButton);
pulidoHookButton.addEventListener('pointerdown',event=>{event.preventDefault();event.stopPropagation();startPulidoHook();});
window.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='h'&&!event.repeat&&startPulidoHook()){event.preventDefault();event.stopImmediatePropagation();}},true);
const hookUiBase=ui;
ui=function(){
 hookUiBase();const punch=touchControls.querySelector('[data-key="z"]'),box=punch.getBoundingClientRect();
 const shown=pulidoHookReady()&&box.width>0&&!(typeof gamePaused!=='undefined'&&gamePaused)&&!window.gameAudioSettings?.isOpen;
 pulidoHookButton.hidden=!shown;
 if(shown){pulidoHookButton.style.left=box.left+'px';pulidoHookButton.style.top=Math.max(8,box.top-box.height-14)+'px';pulidoHookButton.style.width=box.width+'px';pulidoHookButton.style.height=box.height+'px';}
};
