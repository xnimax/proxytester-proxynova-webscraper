const axios = require("axios");
const cheerio = require("cheerio");

/**
 * INITIALIZING
 */

const getIPS = async () => {
  const url = "https://www.proxynova.com/proxy-server-list/country-ir/";
  const callUrl = async (url) => {
    return await axios.get(url);
  };

  const sanitizeIP = (str) => {
    if (String(str).includes("document.write")) {
      const toArr = str.split("");
      const firstPrIdx = toArr.findIndex((item) => item === "(");
      const lastPrIdx = toArr.findIndex((item) => item === ")");
      const sliced = toArr.slice(firstPrIdx + 2, lastPrIdx - 1);
      return sliced
        .filter((item) => {
          if (item === "'" || item == "+" || item === " ") return false;
          return true;
        })
        .join("");
    }
    return false;
  };
  const sanitizePort = (str) => {
    return String(str).trim();
  };
  const res = await callUrl(url);
  const $ = cheerio.load(res.data);
  const ips = [];
  $("tr[data-proxy-id]").each((idx, el) => {
    const elToText = $(el).html();
    const port = sanitizePort($($(el).children()[1]).html());
    const ip = sanitizeIP(elToText);
    ips.push({ ip, port });
  });
  return ips;
};

// ********** ///
const proxyCaller = async (url, propxyIP, proxyPort) => {
  try {
    const res = await axios.get(url, {
      proxy: {
        host: propxyIP,
        port: proxyPort,
      },
    });
    const p = cheerio.load(res.data);
    return {
      workered: { ip: propxyIP, port: proxyPort },
    };
  } catch (error) {
    return { data: { notWorked: { propxyIP, proxyPort } } };
  }
};

const myUrl = "https://downloadly.ir";
const run = async () => {
  const ips = await getIPS();
  console.log({ips})
  ips.forEach(async (item) => {
    const res = await proxyCaller(myUrl, item.ip, item.port);
    console.log(res);
  });
};

run();
