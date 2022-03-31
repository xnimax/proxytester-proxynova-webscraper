const readline = require("readline");
const fs = require("fs");

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

async function processLineByLine() {
  const fileStream = fs.createReadStream("proxylist.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    const split = line.split(":");
    const ip = split[0];
    const port = split[1];
    const myUrl = "https://downloadly.ir";
    const res = await proxyCaller(myUrl, ip, port);
    console.log(res);
  }
}

processLineByLine();
