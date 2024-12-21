// pages/api/download.js

import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';

const youtube = {
  getData: async (url) => {
    const config = {
      method: 'GET',
      url: `https://ytconvert.pro/button/?url=${encodeURIComponent(url)}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
        'Accept-Language': 'id-ID',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://ytconvert.pro/en24/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'same-origin',
        'Sec-Fetch-Site': 'same-origin',
        'Priority': 'u=4',
        'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733'
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching YouTube conversion:', error);
      throw error;
    }
  },
  
  audioJob: async (url) => {
    const html = await youtube.getData(url);
    const $ = cheerio.load(html);
    const tokenId = $('button#dlbutton').data('token_id');
    const tokenValidTo = $('button#dlbutton').data('token_validto');
    const convert = 'gogogo';
    const title = $('button#dlbutton div').text().trim();

    let data = qs.stringify({
      'url': url,
      'convert': convert,
      'token_id': tokenId,
      'token_validto': tokenValidTo
    });

    let postConfig = {
      method: 'POST',
      url: 'https://ytconvert.pro/convert/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'id-ID',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': `https://ytconvert.pro/button/?url=${encodeURIComponent(url)}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': 'https://ytconvert.pro',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Priority': 'u=0',
        'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733'
      },
      data: data
    };

    try {
      const postResponse = await axios.request(postConfig);
      const jobid = postResponse.data.jobid;
      return {
        success: true,
        title: title,
        audio: await youtube.getAudio(jobid)
      };
    } catch (error) {
      console.error('Error during conversion:', error);
      throw error;
    }
  },

  getAudio: async (jobid) => {
    const time = Date.now();
    const config = {
      method: 'GET',
      url: `https://ytconvert.pro/convert/?jobid=${jobid}&time=${time}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'id-ID',
        'Referer': `https://ytconvert.pro/button/?url=https://www.youtube.com/watch?v=P-P7NVn4vbQ`,
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Cookie': 'PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733'
      }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error checking conversion status:', error);
      throw error;
    }
  },

  download: async (url) => {
    try {
      const data = await youtube.audioJob(url);
      return data;
    } catch (error) {
      return error;
    }
  }
};

// API Handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
      const data = await youtube.download(url);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
