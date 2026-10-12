// Global gameplay pause. Resume requires a deliberate tap after app switching.
let gamePaused=false;
const gamePauseLayer=document.createElement('div');gamePauseLayer.id='gamePauseLayer';gamePauseLayer.hidden=true;
gamePauseLayer.innerHTML='<section><h2 id="gamePauseTitle">Pausa</h2><button id="gameResume">Continuar</button><button id="gameRetry">Reintentar</button></section>';
const gamePauseButton=document.createElement('button');gamePauseButton.id='gamePauseButton';gamePauseButton.textContent='Ⅱ';gamePauseButton.setAttribute('aria-label','Pausar partida');gamePauseButton.hidden=true;
const gamePauseStyle=document.createElement('style');
gamePauseStyle.textContent='#gamePauseButton{position:fixed;top:48px;left:50%;transform:translateX(-50%);z-index:10010;width:38px;height:34px;border-radius:8px;border:1px solid #fff6;background:#101828b0;color:white;font:18px Arial;touch-action:manipulation}#gamePauseButton[hidden],#gamePauseLayer[hidden]{display:none}#gamePauseLayer{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;background:#050a12b0;color:white;font:16px Arial}#gamePauseLayer section{width:min(280px,80vw);padding:20px;background:#172236;border:1px solid #fff5;border-radius:12px;text-align:center}#gamePauseLayer h2{margin:0 0 14px}#gamePauseLayer button{display:block;width:100%;margin-top:9px;padding:12px;border:0;border-radius:7px;background:#344961;color:white;font:16px Arial;touch-action:manipulation}';
document.head.appendChild(gamePauseStyle);document.body.appendChild(gamePauseButton);document.body.appendChild(gamePauseLayer);
function pauseGameplay(){
 if(introPhase==='none'||startScreenActive()||selectionScreenActive()||mapScreenActive()||stageClear.finished)return;
 gamePaused=true;resetMobileInput();window.gameAudioSettings?.pauseAll();
 gamePauseLayer.hidden=false;document.getElementById('gamePauseTitle').textContent=playerDead?'Derrota':timeExpired?'Tiempo agotado':'Pausa';
 document.getElementById('gameResume').hidden=playerDead||timeExpired;
}
function resumeGameplay(){
 if(document.hidden||playerDead||timeExpired)return;
 resetMobileInput();gamePaused=false;gamePauseLayer.hidden=true;last=performance.now();window.gameAudioSettings?.resumeAll();
}
function quickRetryGameplay(){
 resetMobileInput();gamePaused=false;gamePauseLayer.hidden=true;window.gameAudioSettings?.resumeAll();
 if(typeof window.retryBossPlaytest==='function'){window.retryBossPlaytest();last=performance.now();return}
 const name=selectedCharacter;selectCharacter(name);clearTimeout(mapTimer);
 // Reuse the real phase setup, then skip only its already-seen fence introduction.
 beginPhaseIntro();const layout=streetLayout();
 introPhase='done';introClock=0;player.x=layout.fenceX+140;state='idle';jumpActive=false;jumpY=0;walkDistance=0;walkFrame=0;
 cameraLastPlayerX=player.x;cameraFollowVelocity=0;cam=0;resetMobileInput();last=performance.now();
}
gamePauseButton.onclick=pauseGameplay;
document.getElementById('gameResume').onclick=resumeGameplay;
document.getElementById('gameRetry').onclick=quickRetryGameplay;
window.addEventListener('blur',pauseGameplay);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGameplay()});
document.addEventListener('keydown',event=>{
 const key=event.key.toLowerCase();
 if(key==='r'&&(playerDead||timeExpired)){event.preventDefault();event.stopImmediatePropagation();quickRetryGameplay();return}
 if(key==='escape'&&introPhase!=='none'&&!startScreenActive()&&!selectionScreenActive()&&!mapScreenActive()){event.preventDefault();event.stopImmediatePropagation();if(gamePaused)resumeGameplay();else pauseGameplay();return}
 if(gamePaused){event.preventDefault();event.stopImmediatePropagation()}
},{capture:true});
const gamePauseUpdateBase=update;
update=function(dt){if(gamePaused||document.hidden)return;return gamePauseUpdateBase(dt)};
const gamePauseUiBase=ui;
ui=function(){
 gamePauseUiBase();const playing=introPhase==='done'&&!startScreenActive()&&!selectionScreenActive()&&!mapScreenActive()&&!stageClear.active&&!stageClear.finished&&!continueCue.active;
 gamePauseButton.hidden=!playing||playerDead||timeExpired||gamePaused;
 if(playing&&(playerDead||timeExpired)&&!gamePaused)pauseGameplay();
};
