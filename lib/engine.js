"use strict";
/*!
* suggestify-engine v1.2.1
* (c) 2021 Max van der Schee
* @license MIT
* Engine does Vroem Vroem..
*/const e=(e,t)=>{const n=[],r=new RegExp(t,"i"),l=new RegExp(t.replace(/\W+/g,"|"),"i"),s={},c=e.filter((e=>{const t=r.exec(e);return!t||0!==t.index||(n.push(e),!1)})).filter((e=>!r.test(e)||(n.push(e),!1))).filter((e=>{const t=l.exec(e);return!t||(s[e]=t.index,!1)})),h=Object.keys(s).sort(((e,t)=>s[e]-s[t]));return[...n,...h,...c]},t=(e,t)=>{if(!e.length)return t.length;if(!t.length)return e.length;const n=[];for(let r=0;r<=t.length;r++){n[r]=[r];for(let l=1;l<=e.length;l++)n[r][l]=0===r?l:Math.min(n[r-1][l]+1,n[r][l-1]+1,n[r-1][l-1]+(e[l-1]===t[r-1]?0:1))}return n[t.length][e.length]};module.exports=async function(n,r,l,s){const c=n.charAt(0),h=l[c]?l[c]:r,o=new RegExp(n.replace(/\W+/g,"|"),"i"),g={MIN_DISTANCE:3|s.MIN_DISTANCE,ITEM_CAP:8|s.ITEM_CAP},i={match:[],alt:[]},u=e=>{t(e,n)<=g.MIN_DISTANCE&&i.alt.push(e)};for(let e=0;e<h.length;e++)a=h[e],o.test(a)&&i.match.push(a);var a;if(i.match.length<=g.ITEM_CAP)for(let e=0;e<h.length;e++)u(h[e]);const f=e(i.match,n),p=new Set([...f,...i.alt.sort()]);return Promise.resolve([...p].slice(0,g.ITEM_CAP))};
