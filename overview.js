(() => {
const board=document.querySelector('.overview-board');
if(!board)return;
const svg=board.querySelector('svg'), group=svg.querySelector('g');
const nodes=[...board.querySelectorAll('[data-overview-node]')];
const find=id=>nodes.find(n=>n.dataset.overviewNode===id);
function draw(){
 const base=board.getBoundingClientRect();svg.setAttribute('viewBox','0 0 '+base.width+' '+base.height);group.replaceChildren();
 const point=(id,side,f=.5)=>{const r=find(id).getBoundingClientRect();return {x:r.left-base.left+(side==='left'?0:side==='right'?r.width:r.width*f),y:r.top-base.top+(side==='top'?0:side==='bottom'?r.height:r.height*f)}};
 const line=(from,to,a,b,both=false,f=.5,t=.5)=>{const p=point(from,a,f),q=point(to,b,t),path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M '+p.x+' '+p.y+' L '+q.x+' '+q.y);if(both)path.setAttribute('class','bidirectional');group.append(path)};
 ['collect','normalize','select','generate','send','judge'].forEach((id,i)=>line(id,['normalize','select','generate','send','judge','aggregate'][i],'right','left'));
 line('settings','collect','bottom','top');
 const normalize=point('normalize','top');const run=find('running').getBoundingClientRect();line('running','normalize','bottom','top',false,(normalize.x-(run.left-base.left))/run.width);
 line('aggregate','report','top','bottom');
 const zap=find('zap').getBoundingClientRect();for(const id of ['collect','select','send']){const p=point(id,'bottom');line(id,'zap','bottom','top',true,.5,(p.x-(zap.left-base.left))/zap.width)}
 line('zap','webapp','bottom','top',true,.5,.5);
 const judge=point('judge','bottom'),fire=find('firefox').getBoundingClientRect();line('judge','firefox','bottom','top',true,.5,(judge.x-(fire.left-base.left))/fire.width);
 line('firefox','webapp','left','right');
}
nodes.forEach(node=>node.addEventListener('click',()=>{const active=node.getAttribute('aria-pressed')!=='true';nodes.forEach(n=>n.setAttribute('aria-pressed',String(active&&n===node)));document.querySelector('#overview-description').textContent=active?node.dataset.description:''}));
new ResizeObserver(draw).observe(board);document.fonts.ready.then(draw);draw();
})();