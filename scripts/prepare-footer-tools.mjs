/** Optimize generated cutouts and derive convex collision slices from their alpha. */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-footer-tools.mjs <folder-with-id.png-files>");
const specs = [
  ["dryer", 230, 0.14, -0.2], ["comb", 235, 0.7, 0.18],
  ["scissors", 260, 0.38, -0.28], ["bowl", 190, 0.85, 0.1],
  ["hairbrush", 240, 0.53, 0.22], ["tint-brush", 245, 0.23, -0.3],
  ["clip", 205, 0.67, 0.16],
];
const hull = (points) => {
  points.sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o, a, b) => (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const half = (list) => { const out=[]; for(const p of list) {while(out.length>1 && cross(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p);}return out; };
  const lower=half(points); const upper=half([...points].reverse());
  return [...lower.slice(0,-1),...upper.slice(0,-1)];
};
await mkdir("public/images/footer-tools", {recursive:true});
const assets=[];
for(const [id,width,x,angle] of specs) {
  const input=path.join(source,`${id}.png`);
  const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width,top=info.height,right=0,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++) {
    if(data[(y*info.width+x)*4+3]>100){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  left=Math.max(0,left-2);top=Math.max(0,top-2);right=Math.min(info.width-1,right+2);bottom=Math.min(info.height-1,bottom+2);
  const cropped=sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1});
  const dest=`public/images/footer-tools/${id}.webp`;
  const output=await cropped.clone().resize({width:640,withoutEnlargement:true}).webp({quality:86,alphaQuality:100}).toBuffer();
  await writeFile(dest,output);
  const mask=await sharp(output).resize({width:96}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const mw=mask.info.width,mh=mask.info.height,parts=[];
  // Narrow connected silhouette strips preserve the dryer handle, brush neck and scissor rings.
  for(let start=0;start<mw;start+=12) {
    const end=Math.min(mw,start+12),seen=new Set();
    for(let yy=0;yy<mh;yy++)for(let xx=start;xx<end;xx++) {
      const key=yy*mw+xx;
      if(seen.has(key)||mask.data[key*4+3]<100)continue;
      const stack=[[xx,yy]],pixels=[];seen.add(key);
      while(stack.length) {
        const [px,py]=stack.pop();pixels.push([px,py]);
        for(const [nx,ny] of [[px-1,py],[px+1,py],[px,py-1],[px,py+1]]) {
          const nk=ny*mw+nx;
          if(nx>=start&&nx<end&&ny>=0&&ny<mh&&!seen.has(nk)&&mask.data[nk*4+3]>=100){seen.add(nk);stack.push([nx,ny]);}
        }
      }
      if(pixels.length<4)continue;
      const vertices=hull(pixels.flatMap(([px,py])=>[{x:px/mw,y:py/mh},{x:(px+1)/mw,y:py/mh},{x:px/mw,y:(py+1)/mh},{x:(px+1)/mw,y:(py+1)/mh}]));
      parts.push(vertices.map(({x,y})=>({x:+x.toFixed(4),y:+y.toFixed(4)})));
    }
  }
  const meta=await sharp(output).metadata();
  assets.push({id,src:`/images/footer-tools/${id}.webp`,width,aspect:meta.width/meta.height,parts,x,angle});
  console.log(`${id}: ${Math.round(output.length/1024)} KB, ${parts.length} silhouette parts`);
}
const geometry=Object.fromEntries(assets.map(({id,aspect,parts})=>[id,{aspect,parts}]));
await writeFile("shared/ui/gravity-footer/geometry.json",JSON.stringify(geometry));
await writeFile("shared/ui/gravity-footer/assets.ts",`// Configurable collection; silhouette data is generated separately.
import type { ToolAsset } from "./types";
import geometry from "./geometry.json";

export const salonTools: ToolAsset[] = [
${assets.map(({id,width,x,angle})=>`  { id: "${id}", src: "/images/footer-tools/${id}.webp", width: ${width}, x: ${x}, angle: ${angle}, ...geometry["${id}"] },`).join("\n")}
];
`);
