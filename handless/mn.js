const puppeteer=require('puppeteer');
const {mn}=require('./config/default');
const srcToImg=require('./helper/srcToimg');
(async()=>{
    const browser=await puppeteer.launch();
    const page=await browser.newPage();
    await page.goto('http://image.baidu.com/');
    console.log('go to http://image.baidu.com/');

    await page.setViewport({
        width:1920,
        height:1080
    })
    console.log('rest viewport');

    await page.focus('#kw');
    await page.keyboard.sendCharacter('狗');
    await page.click('.s_search');
    console.log('go to search list');

    page.on('load',async ()=>{
        console.log('page loading done, start fetch...');
        //console.log(page);
        const srcs=await page.evaluate(()=>{
            const images=document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images,img=>img.src);
        });
        //const srcs=await page.$$eval('img.main_img');
        console.log(`get ${srcs.length} image`)
        srcs.forEach(async (src)=>{
            await page.waitFor(200);
          await  srcToImg(src,mn);
        });
         await browser.close();
    })
  //  await browser.close();
})();