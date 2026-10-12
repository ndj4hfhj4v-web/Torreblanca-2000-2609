// Distant rotor ambience; the overhead searchlight is disabled.
const bossSearchlightEnabled=false;
let bossHelicopterSound=null;
let bossSearchlightAnchor=null;
let bossHelicopterDeparted=false,bossHelicopterDepartureMs=0;
function bossHelicopterVisible(){return (!bossHelicopterDeparted||bossHelicopterDepartureMs<3000)&&jefe.active&&!jefe.hidden&&introPhase==='done'&&!comparisonMode&&!stageClear.active&&!stageClear.finished&&!continueCue.active}
function stopBossHelicopter(fadeSeconds=.15){
 if(!bossHelicopterSound)return;
 const {audio,departureGain,sources}=bossHelicopterSound;bossHelicopterSound=null;
 departureGain.gain.cancelScheduledValues(audio.currentTime);departureGain.gain.setTargetAtTime(0,audio.currentTime,fadeSeconds/3);
 for(const source of sources){try{source.stop(audio.currentTime+fadeSeconds+.5)}catch{}}
 setTimeout(()=>departureGain.disconnect(),(fadeSeconds+.6)*1000);
}
function startBossHelicopter(){
 if(bossHelicopterSound||bossHelicopterDeparted)return;
 try{
  const audio=sfxContext();if(!audio)return;
  const gain=audio.createGain(),filter=audio.createBiquadFilter(),noise=audio.createBufferSource(),rotor=audio.createOscillator(),pulse=audio.createGain();
  const buffer=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.6;
  noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=480;
  gain.gain.value=.035;rotor.type='sine';rotor.frequency.value=18;pulse.gain.value=.022;
  noise.connect(filter);filter.connect(gain);rotor.connect(pulse);pulse.connect(gain.gain);
  const departureGain=audio.createGain();departureGain.gain.value=1;
  gain.connect(departureGain);departureGain.connect(audioOutput(audio,'effects'));noise.start();rotor.start();
  bossHelicopterSound={audio,gain,departureGain,sources:[noise,rotor]};
 }catch(error){console.warn('Helicopter ambience unavailable',error)}
}
function bossSearchlightPosition(){
 const anchor=bossSearchlightAnchor||{x:jefe.x,y:jefe.y},time=performance.now();
 // Search across the original boss position, independently of his movement.
 const departure=bossHelicopterDeparted?Math.min(1,bossHelicopterDepartureMs/3000):0;
 return {x:anchor.x+Math.sin(time/1400)*115+departure*340,y:anchor.y+Math.sin(time/2300)*18-departure*90};
}
function drawBossSearchlight(){
 if(!bossSearchlightEnabled||!bossHelicopterVisible())return;
 const light=bossSearchlightPosition(),x=light.x-cam,y=light.y,top=-H*.35;
 ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=bossHelicopterDeparted?Math.max(0,1-bossHelicopterDepartureMs/3000):1;
 const beam=ctx.createLinearGradient(x,top,x,y);
 beam.addColorStop(0,'rgba(255,221,126,.035)');beam.addColorStop(.7,'rgba(255,221,126,.085)');beam.addColorStop(1,'rgba(255,231,151,.16)');
 ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(x+95,top);ctx.lineTo(x+120,y);ctx.quadraticCurveTo(x,y+24,x-120,y);ctx.closePath();ctx.fill();
 ctx.translate(x,y);ctx.scale(1,.27);
 const pool=ctx.createRadialGradient(0,0,8,0,0,145);pool.addColorStop(0,'rgba(255,230,150,.34)');pool.addColorStop(.55,'rgba(255,215,113,.16)');pool.addColorStop(1,'rgba(255,215,113,0)');
 ctx.fillStyle=pool;ctx.fillRect(-145,-145,290,290);ctx.restore();
}
const helicopterActorLightBase=actorNightLight;
actorNightLight=function(actor){const light=helicopterActorLightBase(actor);if(bossSearchlightEnabled&&bossHelicopterVisible()){const p=bossSearchlightPosition(),strength=Math.max(0,1-Math.hypot((actor.x-p.x)/145,(actor.y-p.y)/75));light.warm=Math.max(light.warm,strength*.85*(bossHelicopterDeparted?Math.max(0,1-bossHelicopterDepartureMs/3000):1))}return light};
const helicopterSceneBase=drawIntroCar;
drawIntroCar=function(){const result=helicopterSceneBase();drawBossSearchlight();return result};
const helicopterActivateBase=activateBoss;
activateBoss=function(){const result=helicopterActivateBase();bossHelicopterDeparted=false;bossHelicopterDepartureMs=0;bossSearchlightAnchor={x:jefe.x,y:jefe.y};startBossHelicopter();return result};
const helicopterUpdateBase=update;
update=function(dt){
 const result=helicopterUpdateBase(dt);
 if(!bossHelicopterDeparted&&jefe.active&&jefe.hp<=jefe.maxHp*.5){bossHelicopterDeparted=true;bossHelicopterDepartureMs=0;stopBossHelicopter(3)}
 if(bossHelicopterDeparted&&!window.gameAudioSettings?.isOpen&&!bossFaceoff)bossHelicopterDepartureMs+=dt*16.67;
 if(bossHelicopterVisible())startBossHelicopter();else stopBossHelicopter();return result;
};
const helicopterSelectBase=selectCharacter;
selectCharacter=function(name){stopBossHelicopter();bossSearchlightAnchor=null;bossHelicopterDeparted=false;bossHelicopterDepartureMs=0;return helicopterSelectBase(name)};
