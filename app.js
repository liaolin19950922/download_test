const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
 
const host = 'http://www.xbiquge.la';
const startPath = '/17/17377/8705057.html';
 
const distPath = '雅骚.txt';
 
// 删除上一次的文件 有可能不存在 所以try一下
try {
  fs.unlinkSync(distPath);
} catch(e) {
 
}
run();
 
function run(nextPath) {
  const url = `${host}${nextPath ? nextPath : startPath}`;
  request({
    url
  }, (err, response, body) => {
    if (!err) {
      const $ = cheerio.load(body);
      let title = $('.bookname h1').text();
	  let index = title.indexOf('第');
	  title = title.substring(index);
      const content = $('#content').text().replace(/\s{4,}/g, '\r\n\r\n');
      fs.appendFile(distPath, `\r\n${title}\r\n${content}`, err => {
        console.log(`下载 ${title} 完成！`);
        const $next = $('.bottem2 a').eq(3);
        const path = $next.attr('href');
        if (/\.html/.test(path)) {
          run(path);
        }else{
			console.log(`下载 ${distPath} 完成！输入exit可退出窗口。`);
		}
      });
    }else {
		console.log(`err:${err}`);
	}
  });
}