function y(){}function E(t,n){for(const e in n)t[e]=n[e];return t}function j(t){return t()}function A(){return Object.create(null)}function v(t){t.forEach(j)}function q(t){return typeof t=="function"}function B(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let i;function C(t,n){return t===n?!0:(i||(i=document.createElement("a")),i.href=n,t===i.href)}function D(t){return Object.keys(t).length===0}function m(t,...n){if(t==null){for(const r of n)r(void 0);return y}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function F(t){let n;return m(t,e=>n=e)(),n}function P(t,n,e){t.$$.on_destroy.push(m(n,e))}function U(t,n,e,r){if(t){const o=k(t,n,e,r);return t[0](o)}}function k(t,n,e,r){return t[1]&&r?E(e.ctx.slice(),t[1](r(n))):e.ctx}function G(t,n,e,r){if(t[2]&&r){const o=t[2](r(e));if(n.dirty===void 0)return o;if(typeof o=="object"){const l=[],_=Math.max(n.dirty.length,o.length);for(let s=0;s<_;s+=1)l[s]=n.dirty[s]|o[s];return l}return n.dirty|o}return n.dirty}function H(t,n,e,r,o,l){if(o){const _=k(n,e,r,l);t.p(_,o)}}function I(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let r=0;r<e;r++)n[r]=-1;return n}return-1}function J(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}function K(t,n){const e={};n=new Set(n);for(const r in t)!n.has(r)&&r[0]!=="$"&&(e[r]=t[r]);return e}function L(t){return t&&q(t.destroy)?t.destroy:y}let f;function d(t){f=t}function x(){if(!f)throw new Error("Function called outside component initialization");return f}function N(t){x().$$.on_mount.push(t)}function Q(t){x().$$.after_update.push(t)}function R(t,n){const e=t.$$.callbacks[n.type];e&&e.slice().forEach(r=>r.call(this,n))}const a=[],b=[];let u=[];const g=[],w=Promise.resolve();let p=!1;function O(){p||(p=!0,w.then(M))}function T(){return O(),w}function z(t){u.push(t)}const h=new Set;let c=0;function M(){if(c!==0)return;const t=f;do{try{for(;c<a.length;){const n=a[c];c++,d(n),S(n.$$)}}catch(n){throw a.length=0,c=0,n}for(d(null),a.length=0,c=0;b.length;)b.pop()();for(let n=0;n<u.length;n+=1){const e=u[n];h.has(e)||(h.add(e),e())}u.length=0}while(a.length);for(;g.length;)g.pop()();p=!1,h.clear(),d(t)}function S(t){if(t.fragment!==null){t.update(),v(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(z)}}function V(t){const n=[],e=[];u.forEach(r=>t.indexOf(r)===-1?n.push(r):e.push(r)),e.forEach(r=>r()),u=n}export{d as A,j as B,a as C,O as D,Q as a,b,U as c,G as d,P as e,K as f,I as g,E as h,J as i,R as j,L as k,C as l,q as m,y as n,N as o,F as p,A as q,v as r,B as s,T as t,H as u,M as v,D as w,z as x,V as y,f as z};
