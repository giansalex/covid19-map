const updateCloudflareDnslink = require('dnslink-cloudflare')

async function main(token, domain, hash) {
    const api = {
      token
    }

    const opts = {
      zone: domain,
      record: `_dnslink.${domain}`,
      link: `/ipfs/${hash}`,
    };

    try {
      const content = await updateCloudflareDnslink(api, opts);
      console.log(`Updated TXT ${opts.record} to ${content}`);
    } catch (error) {
        console.log(error);

        return process.exit(-1);
    }
}

main(process.env.CF_API_TOKEN,
     process.env.CF_DOMAIN,
     process.env.IPFS_HASH);