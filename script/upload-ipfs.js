const axios = require('axios').default;
const ipfsClient = require('ipfs-http-client');
const { globSource } = ipfsClient;

async function main(ipfsUser, ipfsPass, directory) {
    const jwt = await loginIpfsGateway(ipfsUser, ipfsPass);
    if (!jwt) return process.exit(1);

    const hash = await uploadDir(jwt, directory);

    console.log(hash);

    return process.exit(0);
}

function loginIpfsGateway(user, pass) {
   return axios.post('https://api.temporal.cloud/v2/auth/login', {
        'username': user,
        'password': pass
    }).then(response => {
        if (!response || !response.data) {
            return;
        }
    
        return response.data.token;
    });
}

async function uploadDir(token, directory) {
    const ipfs = createIpfs(token);

    var hash = '';
    for await (const file of ipfs.add(globSource(directory, { recursive: true }))) {
        hash = file.cid.toString();
    }

    return hash;
}

function createIpfs(token) {
    // specify how we will connect the ipfs client
    const ipfs = ipfsClient({
        // the hostname (or ip address) of the endpoint providing the ipfs api
        host: 'api.ipfs.temporal.cloud',
        // the port to connect on
        port: '443',
        'api-path': '/api/v0/',
        // the protocol, https for security
        protocol: 'https',
        // provide the jwt within an authorization header
        headers: {
            authorization: 'Bearer ' + token
        }
    });

    return ipfs;
}

async function start() {
    try {
        await main(process.env.TEMPORAL_USER,
            process.env.TEMPORAL_PASS,
            process.env.UPLOAD_DIR);
    } catch (error) {
        console.log(error);
        return process.exit(-1);
    }   
}

start();
    