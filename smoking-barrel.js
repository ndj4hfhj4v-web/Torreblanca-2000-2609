// Decorative street prop: bounded smoke particles, no new invisible collision.
const smokingBarrelImage=imgFromData('assets/props/smoking-barrel-v1.png');
function drawSmokingBarrel(){
 if(introPhase==='none'||!smokingBarrelImage.complete||!smokingBarrelImage.naturalWidth)return;
 const position=streetBarrelPosition(),x=position.x-cam,base=position.y,h=100;
 if(x<-120||x>W/.8192+120)return;
 const w=h*smokingBarrelImage.naturalWidth/smokingBarrelImage.naturalHeight;
 ctx.save();
 const warmth=.85+.08*Math.sin(performance.now()/190)+.05*Math.sin(performance.now()/83);
 ctx.save();ctx.globalCompositeOperation='screen';
 ctx.save();ctx.translate(x,base-5);ctx.scale(1,.32);
 const pool=ctx.createRadialGradient(0,0,3,0,0,140);
 pool.addColorStop(0,`rgba(255,156,48,${.30*warmth})`);pool.addColorStop(.5,`rgba(235,107,28,${.12*warmth})`);pool.addColorStop(1,'rgba(235,107,28,0)');
 ctx.fillStyle=pool;ctx.fillRect(-145,-145,290,290);ctx.restore();
 const glow=ctx.createRadialGradient(x,base-h+18,1,x,base-h+18,95);
 glow.addColorStop(0,`rgba(255,184,65,${.28*warmth})`);glow.addColorStop(1,'rgba(255,130,35,0)');
 ctx.fillStyle=glow;ctx.fillRect(x-95,base-h-77,190,190);ctx.restore();
 ctx.fillStyle='rgba(0,0,0,.20)';ctx.beginPath();ctx.ellipse(x,base-4,23,6,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(smokingBarrelImage,x-w/2,base-h,w,h);
 ctx.save();ctx.globalCompositeOperation='screen';
 const ember=ctx.createRadialGradient(x,base-h+18,0,x,base-h+18,18);
 ember.addColorStop(0,`rgba(255,210,110,${.7*warmth})`);ember.addColorStop(1,'rgba(255,105,25,0)');
 ctx.fillStyle=ember;ctx.fillRect(x-18,base-h,36,36);ctx.restore();
 const seconds=performance.now()/1000;
 for(let i=0;i<14;i++){
  const p=((seconds*.28+i/14)%1),radius=5+p*17;
  const sx=x+Math.sin(p*5+i*.8)*(3+p*8)+p*14,sy=base-h+16-p*115;
  const opacity=Math.sin(p*Math.PI)*.22;
  const gradient=ctx.createRadialGradient(sx,sy,0,sx,sy,radius);
  gradient.addColorStop(0,'rgba(130,133,130,'+opacity+')');
  gradient.addColorStop(.5,'rgba(120,122,120,'+opacity*.7+')');
  gradient.addColorStop(1,'rgba(120,122,120,0)');
  ctx.fillStyle=gradient;ctx.fillRect(sx-radius,sy-radius,radius*2,radius*2);
 }
 ctx.restore();
}
const smokingBarrelSceneBase=drawIntroCar;
drawIntroCar=function(){smokingBarrelSceneBase();drawSmokingBarrel()};
