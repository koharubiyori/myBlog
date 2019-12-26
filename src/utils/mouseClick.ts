import mojs from '@mojs/core'

const pop = new mojs.Shape({
  fill: 'none',
  stroke: { '#27ae60': '#c0392b' },
  radius: { 0: 80 },
  strokeWidth: { 8: 0 },
  opacity: { 1: 0 },
  duration: 1000 });


const burst = new mojs.Burst({
  radius: { 0: 100 },
  angle: { 0: 100, easing: 'cubic.out' },
  count: 25,
  children: {
    radius: { 0: 10 },
    shape: 'circle',
    fill: { '#fff': '#8e44ad' },
    duration: 800 } });



const spark = new mojs.Burst({
  radius: { 0: 150 },
  angle: { 0: -60 },
  count: 10,
  children: {
    shape: 'line',
    stroke: { '#d35400': '#e67e22' },
    strokeWidth: { 5: 2 },
    duration: 800 } });



const lines = new mojs.Burst({
  radius: { 50: 150 },
  count: 10,
  children: {
    shape: 'line',
    stroke: '#222',
    strokeWidth: 4,
    opacity: { 1: 0 },
    duration: 1000 } });




const triangles = new mojs.Burst({
  radius: { 50: 150 },
  angle: { 0: 120 },
  count: 15,
  children: {
    shape: 'polygon',
    points: 3,
    fill: '#16a085',
    duration: 1500 } });



var animArr: any = [];
animArr.push(pop, burst, spark, triangles, lines);


window.addEventListener('mousedown', e => {
  animArr.forEach((anim: any) => {
    anim.el.style.top = 0;
    anim.el.style.left = 0;
    anim.tune({ x: e.x, y: e.y }).replay();
  });
});