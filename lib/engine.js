"use strict";
/*!
* suggestify-engine v1.2.2
* (c) 2021 Max van der Schee
* @license MIT
* Engine does Vroem Vroem..
*/const t=(t,n)=>n.sort(((n,r)=>{const l=e(t,n),h=e(t,r);return l>h?1:l<h?-1:0})),e=(t,e)=>{if(!t.length)return e.length;if(!e.length)return t.length;const n=[];for(let r=0;r<=e.length;r++){n[r]=[r];for(let l=1;l<=t.length;l++)n[r][l]=0===r?l:Math.min(n[r-1][l]+1,n[r][l-1]+1,n[r-1][l-1]+(t[l-1]===e[r-1]?0:1))}return n[e.length][t.length]};module.exports=async function(n,r,l,h){const s=n.charAt(0),o=l[s]?l[s]:r,c=new RegExp(n.replace(/\W+/g,"|"),"i"),g={MIN_DISTANCE:3|h.MIN_DISTANCE,ITEM_CAP:8|h.ITEM_CAP},a={match:[],alt:[]},u=t=>{e(t,n)<=g.MIN_DISTANCE&&a.alt.push(t)};for(let t=0;t<o.length;t++)I=o[t],c.test(I)&&a.match.push(I);var I;if(a.match.length<=g.ITEM_CAP)for(let t=0;t<o.length;t++)u(o[t]);const i=t(n,a.match),f=new Set([...i,...a.alt.sort()]);return Promise.resolve([...f].slice(0,g.ITEM_CAP))};
