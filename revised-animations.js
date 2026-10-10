// Oct 9 sheets. Originals remain intact; crop/registration is rendering only.
(() => {
'use strict';
function isolate(image,x,y,w,h){
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,x,y,w,h,0,0,w,h);
 const pixels=ctx.getImageData(0,0,w,h),d=pixels.data,seen=new Uint8Array(w*h);let largest=[];
 for(let start=0;start<w*h;start++){if(seen[start]||d[start*4+3]<=40)continue;const queue=[start],group=[];seen[start]=1;
  for(let k=0;k<queue.length;k++){const p=queue[k];group.push(p);const px=p%w,py=Math.floor(p/w);for(const q of [px?p-1:-1,px<w-1?p+1:-1,py?p-w:-1,py<h-1?p+w:-1])if(q>=0&&!seen[q]&&d[q*4+3]>40){seen[q]=1;queue.push(q)}}
  if(group.length>largest.length)largest=group;
 }
 if(!largest.length)throw Error('Celda vacía');const mask=new Uint8Array(w*h);let left=w,top=h,right=0,bottom=0;
 for(const p of largest){mask[p]=1;const px=p%w,py=Math.floor(p/w);left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py)}
 for(let p=0;p<w*h;p++)if(!mask[p])d[p*4+3]=0;ctx.putImageData(pixels,0,0);
 const feet=largest.filter(p=>Math.floor(p/w)>=bottom-8).map(p=>p%w).sort((a,b)=>a-b);
 return {canvas,left,top,right,bottom,height:bottom-top+1,anchor:feet[Math.floor(feet.length/2)]??(left+right)/2,touchesEdge:left<2||top<2||right>w-3||bottom>h-3};
}
function paint(ctx,frame,scale,cx,base,elevation=0,mirror=false){ctx.save();ctx.translate(cx,base-elevation);ctx.scale(mirror?-scale:scale,scale);ctx.drawImage(frame.canvas,-frame.anchor,-frame.bottom);ctx.restore()}
// Standing poses need BOTH shoes. The lowest 8px can contain just one sole,
// making the old median jump from one foot to the other (notably Salvi frame 2).
function registerStandingFrame(frame){
 const w=frame.canvas.width,h=frame.canvas.height;
 const data=frame.canvas.getContext('2d').getImageData(0,0,w,h).data;
 let left=w,right=-1;
 const top=Math.max(0,frame.bottom-Math.ceil(frame.height*.18));
 for(let y=top;y<=frame.bottom;y++)for(let x=0;x<w;x++){
  if(data[(y*w+x)*4+3]>40){left=Math.min(left,x);right=Math.max(right,x)}
 }
 if(right>=left)frame.anchor=(left+right)/2;
}
function sheetRegions(image){
 const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);const w=canvas.width,h=canvas.height,d=ctx.getImageData(0,0,w,h).data,seen=new Uint8Array(w*h),groups=[];
 for(let p=0;p<w*h;p++){if(seen[p]||d[p*4+3]<=40)continue;const queue=[p];seen[p]=1;let l=w,t=h,r=0,b=0,sx=0,sy=0;
  for(let k=0;k<queue.length;k++){const q=queue[k],x=q%w,y=Math.floor(q/w);l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);sx+=x;sy+=y;for(const n of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&d[n*4+3]>40){seen[n]=1;queue.push(n)}}
  if(queue.length>1000)groups.push({l,t,r,b,count:queue.length,cx:sx/queue.length,cy:sy/queue.length});
 }
 const largest=groups.sort((a,b)=>b.count-a.count).slice(0,16).sort((a,b)=>a.cy-b.cy),ordered=[];
 if(largest.length!==16)throw Error('No se detectan 16 poses separadas; revisar hoja antes de integrarla');
 for(let row=0;row<4;row++)ordered.push(...largest.slice(row*4,row*4+4).sort((a,b)=>a.cx-b.cx));
 return ordered.map(g=>[Math.max(0,g.l-3),Math.max(0,g.t-3),Math.min(w,g.r+4)-Math.max(0,g.l-3),Math.min(h,g.b+4)-Math.max(0,g.t-3)]);
}

const referencePaths={rafa:'rafa-king/idle.png',salvi:'salvi/f1.png',cajaman:'cajaman/idle.png',casta:'casta/idle1.png',pako:'pako/idle.png'};
const assets={};
function readImage(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error(src));im.src=src})}
window.revisedAnimationsReady=Promise.all(Object.entries(referencePaths).map(async ([name,path])=>{
 try {
 const [sheet,original]=await Promise.all([readImage('assets/characters/revision-20261009/'+name+'.png'),readImage('assets/characters/'+path)]);
 const frames=sheetRegions(sheet).map(r=>isolate(sheet,...r));
 // Guard and grounded punches share a stable stance; kicks keep their support foot.
 frames.slice(0,8).forEach(registerStandingFrame);
 const heights=frames.slice(0,4).map(f=>f.height).sort((a,b)=>a-b);
 const reference=isolate(original,0,0,original.width,original.height);
 assets[name]={frames,height:(heights[1]+heights[2])/2,referenceHeight:reference.height};
 if(name==='pako'){
  const kickSheet=await readImage('assets/characters/pako/kick-muay-thai-v1.png');
  const half=kickSheet.width/2,split=Math.round(kickSheet.height*.515625);
  const kickFrames=[[0,0,half,split],[half,0,half,split],[0,split,half,kickSheet.height-split],[half,split,half,kickSheet.height-split]].map(r=>isolate(kickSheet,...r));
  const kickHeights=kickFrames.map(f=>f.height).sort((a,b)=>a-b);
  assets[name].kickFrames=kickFrames;assets[name].kickHeight=(kickHeights[1]+kickHeights[2])/2;
 }
 return name;
 } catch(error){console.error('Animation sheet unavailable; keeping original',name,error);return null}
}));
let clock=0,airStart=0;
const updateBase=update;
update=function(dt){
 if(jumpActive&&xPressed&&!pakoHasBat)airStart=jumpT;
 if(!jumpActive)airStart=0;
 if(!playerDead&&!playerKnocked&&!timeExpired&&!stageClear.active&&!stageClear.finished&&!continueCue.active)clock+=dt*16.67;
 if((batSpecialActive()||playerKnocked||playerDead)&&selectedCharacter!=='pulido')pulidoAttack=null;
 return updateBase(dt);
};
const drawBase=drawPlayer;
drawPlayer=function(){
 const entry=assets[selectedCharacter];
 if(!entry||introPhase!=='done'||playerDead||playerKnocked||playerHitTimer>0||pakoHasBat||batSpecialActive()){drawBase();return}
 let index=-1;
 if(state==='idle'&&!jumpActive)index=[0,1,2,3,2,1][Math.floor(clock/240)%6];
 else if(pulidoAttack&&!jumpActive){
  if(pulidoAttack.kind==='punch'){
   const prep=pulidoAttack.arm?6:4;
   if(state==='punchWindup'||state==='punchRecover')index=prep;
   else if(state==='punchImpact'||state==='punchHold')index=prep+1;
  } else {
   if(state==='kickWindup')index=pulidoAttack.elapsed<60?8:9;
   else if(state==='kickImpact'||state==='kickHold')index=10;
   else if(state==='kickRecover')index=11;
  }
 } else if(jumpActive&&jumpKick){
  index=state==='jumpRecover'?15:jumpT-airStart<.0048?12:jumpT-airStart<.008?13:14;
 }
 if(index<0){drawBase();return}
 const newPakoKick=selectedCharacter==='pako'&&index>=8&&index<=11&&entry.kickFrames;
 const frame=newPakoKick?entry.kickFrames[index-8]:entry.frames[index],scale=mobileGameplayScale(selectedCharacter==='casta'?.58:.71)*entry.referenceHeight/(newPakoKick?entry.kickHeight:entry.height);
 // One scale per character; do not enlarge tucked aerial poses.
 const base=index>=12?player.y+jumpY-(entry.height-frame.height)*scale:player.y;
 paint(ctx,frame,scale,player.x-cam,base,0,facing<0);
 if(index>=12){ctx.save();ctx.globalAlpha=.28;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(player.x-cam,player.y+4,28,7,0,0,Math.PI*2);ctx.fill();ctx.restore()}
};
})();
