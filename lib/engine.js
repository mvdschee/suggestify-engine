"use strict";
/*!
* suggestify-engine v1.2.0
* (c) 2021 Max van der Schee
* @license MIT
* Engine does Vroem Vroem..
*/Object.defineProperty(exports,"__esModule",{value:!0}),exports[Symbol.toStringTag]="Module";const e=(e,t)=>{const n=[],r=new RegExp(t,"i"),l=new RegExp(t.replace(/\W+/g,"|"),"i"),s={},o=e.filter((e=>{const t=r.exec(e);return!t||0!==t.index||(n.push(e),!1)})).filter((e=>!r.test(e)||(n.push(e),!1))).filter((e=>{const t=l.exec(e);return!t||(s[e]=t.index,!1)})),c=Object.keys(s).sort(((e,t)=>s[e]-s[t]));return[...n,...c,...o]},t=(e,t)=>{if(!e.length)return t.length;if(!t.length)return e.length;const n=[];for(let r=0;r<=t.length;r++){n[r]=[r];for(let l=1;l<=e.length;l++)n[r][l]=0===r?l:Math.min(n[r-1][l]+1,n[r][l-1]+1,n[r-1][l-1]+(e[l-1]===t[r-1]?0:1))}return n[t.length][e.length]};exports.suggestifyEngine=async function(n,r,l,s){const o=n.charAt(0),c=l[o]?l[o]:r,g=new RegExp(n.replace(/\W+/g,"|"),"i"),h={MIN_DISTANCE:3|s.MIN_DISTANCE,ITEM_CAP:8|s.ITEM_CAP},i={match:[],alt:[]},u=e=>{t(e,n)<=h.MIN_DISTANCE&&i.alt.push(e)};for(let e=0;e<c.length;e++)a=c[e],g.test(a)&&i.match.push(a);var a;if(i.match.length<=h.ITEM_CAP)for(let e=0;e<c.length;e++)u(c[e]);const f=e(i.match,n),p=new Set([...f,...i.alt.sort()]);return Promise.resolve([...p].slice(0,h.ITEM_CAP))};
