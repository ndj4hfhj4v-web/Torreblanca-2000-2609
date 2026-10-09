// First night pass: scenery only. Actors, cars and HUD retain their own colors.
function nightGlow(x,y,rx,ry,color,alpha){
 ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
 const g=ctx.createRadialGradient(0,0,0,0,0,1);
 g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.45,`rgba(${color},${alpha*.45})`);g.addColorStop(1,`rgba(${color},0)`);
 ctx.fillStyle=g;ctx.fillRect(-1,-1,2,2);ctx.restore();
}
function drawPoliceNightReflection(r,hp){
 if(hp<=0)return;
 const x=r.x-cam;if(x+r.width< -220||x>W/.8192+220)return;
 const beat=performance.now()%800,side=beat<400?0:1;
 const on=beat%400<100||(beat%400>160&&beat%400<260);
 if(!on)return;
 const lx=x+r.width*(side?.63:.50);
 ctx.save();ctx.globalCompositeOperation='screen';
 // Light falls on the facade, not on the actors drawn later.
 ctx.save();ctx.beginPath();ctx.rect(-1000,-1000,W/.8192+2000,laneTop()+1000);ctx.clip();
 nightGlow(lx-40,r.y-170,160,145,'24,86,255',.38);
 nightGlow(lx+120,r.y-195,180,160,'35,111,255',.23);ctx.restore();
 nightGlow(lx,r.y+5,180,30,'24,90,255',.24);ctx.restore();
}
const nightBackgroundBase=drawBackground;
drawBackground=function(){
 nightBackgroundBase();
 if(!bg.complete||!bg.naturalWidth)return;
 ctx.save();ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
 const night=ctx.createLinearGradient(0,0,0,H);
 night.addColorStop(0,'rgba(3,9,24,.75)');night.addColorStop(.65,'rgba(4,12,28,.66)');night.addColorStop(1,'rgba(3,9,22,.57)');
 ctx.fillStyle=night;ctx.fillRect(0,0,W,H);ctx.restore();
 const scenery=mobileLayout()?2.35:1,scale=Math.max(H/bg.height,W/bg.width*.62);
 const iw=worldW*scenery,ih=bg.height*scale*scenery;
 const progress=Math.max(0,Math.min(1,cam/Math.max(1,worldW-W)));
 const ox=mobileLayout()?W*.5*(1-scenery)+(W/.8192-iw-W*.5*(1-scenery))*progress:-cam,oy=H*.72*(1-scenery);
 ctx.save();ctx.translate(ox,oy);ctx.scale(iw/bg.width,ih/bg.height);ctx.globalCompositeOperation='screen';
 for(const x of [600,1500,1800,2400,3000,3600,4200,4800]){
  // Lamps and their pools remain anchored to the same sidewalk coordinates.
  if(ox+x*iw/bg.width< -220||ox+x*iw/bg.width>W/.8192+220)continue;
  nightGlow(x,425,55,86,'246,176,76',.24);
  nightGlow(x,528,88,21,'238,164,61',.34);
  nightGlow(x,337,18,13,'255,190,89',.75);
  nightGlow(x,337,4,3,'255,222,143',.95);
 }
 ctx.restore();
 if(introPhase!=='none')drawPoliceNightReflection(policeCarRect(),policeCar.hp);
 if(introPhase==='done'){
  const p=heavyStreetCarPosition();drawPoliceNightReflection({x:p.x-heavyStreetCar.width/2,y:p.y,width:heavyStreetCar.width},heavyStreetCar.hp);
 }
};
