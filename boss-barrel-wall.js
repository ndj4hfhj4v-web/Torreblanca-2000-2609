// A stationary two-high barrel barricade across the right end of the road.
function bossBarrelWallPosition(){
 const finalCamera=Math.max(0,worldW-W),anchor=finalCamera+W/.8192*.94-punkBackdropOffsetAt(finalCamera);
 return {x:streetPropWorldX(anchor),top:laneTop()+24,bottom:laneBottom()+8};
}
function bossBarrelWallFootprint(){const p=bossBarrelWallPosition();return {left:p.x-38,right:p.x+44,top:laneTop(),bottom:laneBottom()+16}}
function drawBossBarrelWall(){
 if(introPhase==='none'||!smokingBarrelImage.complete||!smokingBarrelImage.naturalWidth)return;
 const p=bossBarrelWallPosition();if(p.x-cam<-140||p.x-cam>W/.8192+140)return;
 const height=76,width=height*smokingBarrelImage.naturalWidth/smokingBarrelImage.naturalHeight;
 for(let row=0;row<4;row++){
  const y=p.top+(p.bottom-p.top)*row/3,x=p.x+row*2;
  const draw=()=>{
   ctx.save();ctx.filter='brightness(.67) saturate(.8)';
   ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x-cam,y+2,width*.85,10,0,0,Math.PI*2);ctx.fill();
   for(let level=0;level<2;level++)for(let column=0;column<2;column++){
    const dx=(column-.5)*width*.85+(level?width*.08:0);
    ctx.drawImage(smokingBarrelImage,x-cam+dx-width/2,y-height-level*height*.87,width,height);
   }
   ctx.restore();
  };
  if(policeSceneQueue)policeSceneQueue.push({depth:y,draw});else draw();
 }
}
const barrelWallSceneBase=drawIntroCar;
drawIntroCar=function(){const result=barrelWallSceneBase();drawBossBarrelWall();return result};
const barrelWallObstacleBase=streetObstacleAt;
streetObstacleAt=function(x,y){
 const obstacle=barrelWallObstacleBase(x,y);if(obstacle||introPhase!=='done')return obstacle;
 const r=bossBarrelWallFootprint();return x>r.left-13&&x<r.right+13&&y>r.top-8&&y<r.bottom+8?r:null;
};
