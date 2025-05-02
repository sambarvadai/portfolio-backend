import {activeWindow} from 'get-windows';
//console.log(await activeWindow());
const data = await activeWindow();
console.log(data.owner.name);
setInterval(async ()=>{
    console.log(await activeWindow())
},50000);