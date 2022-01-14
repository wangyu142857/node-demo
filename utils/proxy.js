const cheerio = require('cheerio');
const axios = require('axios');
const iconv = require('iconv-lite');
const fs = require('fs');
const config = require('../config');
const { content } = require('../config');

const proxy = {
  async search(url, page) {
    url = config.url + url;
    const res = await axios.get(url);
    const str = res.data.replace(/&nbsp;/g, '').replace(/<br \/>/g, '\n').replace(/<br>/g, '\n');
    return handleSearch(str, page)
  },

  async getContent(url) {
    url = config.url + url;
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      transformResponse: [function (data) {
        data = iconv.decode(data, 'GBK');
        return data;
      }]
    });
    const str = res.data.replace(/&nbsp;/g, '').replace(/<br \/>/g, '\n').replace(/<br>/g, '\n');
    const $ = cheerio.load(str);
    const arr = [];
    $('#list a').each(function (i, el) {
      arr.push({
        url: $(this).attr('href'),
        name: $(this).text(),
        index: i
      });
    });
    return arr;
  },

  async getDetail(url) {
    url = config.url + url;
    const data = await getHtml(url)
    const str = data.replace(/&nbsp;/g, '').replace(/<br \/>/g, 'br').replace(/<br>/g, 'br');

    const $ = cheerio.load(str);
    const val = $('#content').text().replace(/br/g, '<br \/>');
    const $bottom = $('.bookname')
    const title = $bottom.find('h1').text();

    const $a = $bottom.find('.bottem1 a')
    const prev = $a.eq(0).attr('href');
    const content = $a.eq(1).attr('href');
    const next = $a.eq(2).attr('href');

    return { val, prev, next, title, content };
  }
}


function handleSearch(str, page) {
  const $ = cheerio.load(str);
  const content = [];
  $('.result-item').each(function (i, el) {
    const $link = $(this).find('.result-game-item-title-link')
    const name = $link.text()
    const url = $link.attr('href')
    const auth = $(this).find('.result-game-item-info-tag').first().text()
    content.push({
      name, url, auth
    })
  });

  const len = $('.search-result-page-main a').length
  const pageCount = page && page > 1 ? len - 1 : len

  return {
    content,
    pageCount
  };
}

async function getHtml(url) {
  console.time();
  const res = await axios({
    responseType: 'arraybuffer',
    transformResponse: [function (data) {
      data = iconv.decode(data, 'GBK');
      return data;
    }],
    url,
  });
  return res.data;

  // const res = await axios({
  //   url,
  //   responseType: 'stream',
  // });
  // return new Promise(resolve => {
  //   const chunks = [];
  //   res.data.on('data', chunk => {
  //     chunks.push(chunk)
  //   })
  //   res.data.on('end', () => {
  //     const buffer = Buffer.concat(chunks)
  //     const data = iconv.decode(buffer, 'GBK');
  //     resolve(data)
  //   })
  // })
}

module.exports = proxy
