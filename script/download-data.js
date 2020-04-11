const axios = require('axios').default;
const fs = require('fs');

async function main(apiUrl, apiKey, directoryToSave) {
    const covidApi = axios.create({
        baseURL: apiUrl,
        headers: {
            'K-Device': apiKey,
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': 'Nexus 5 / Android 4.4.4 / Android 4.4.4'
        }
    });
    
    const dateParam = new Date();
    const statsResponse = await getApiStats(covidApi, dateParam);
    if (!statsResponse || !statsResponse.data) return process.exit(1);
    
    await saveStatsResponse(directoryToSave + '/stats.json', statsResponse, dateParam);
    console.log('Stats saved for date ' + dateParam);

    const marksResponse = await getApiMarks(covidApi);
    if (!marksResponse || !marksResponse.data) return process.exit(1);

    await saveMarksResponse(directoryToSave + '/points.json', marksResponse);
    console.log('Points Saved');
}

function getApiStats(api, date) {
    return api.get('summary/peru', {
        params: {
            date: formatDate('YYYYMMDD', date)
        }
    });
}

function getApiMarks(api) {
    return api.get('marks');
}

function saveStatsResponse(path, response, datetime) {
    const data = response.data;
    const stats = {
        date: datetime,
        actives: data.TotalConfirmed,
        recovereds: data.TotalRecovered,
        deaths: data.TotalDeaths
    };

    const json = JSON.stringify(stats);

    return saveJsonFile(path, json);
}

function saveMarksResponse(path, response) {
    const points = response.data.map(item => {
        return {lat: item.lat, lon: item.lon};
    });
    const json = JSON.stringify(points);

    return saveJsonFile(path, json);
}

function saveJsonFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, 'utf8', function (err) {
            if (err) {
                return reject(err);
            }

            resolve(true);
        });
    });
}

function formatDate(template, date) {
    var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
    date = new Date(
        date || Date.now() - new Date().getTimezoneOffset() * 6e4
    );
    return date
        .toISOString()
        .split(/[-:.TZ]/)
        .reduce(function (template, item, i) {
        return template.split(specs[i]).join(item);
        }, template);
}

async function start() {
    try {
        await main(process.env.COVID_URL,
            process.env.COVID_KEY,
            process.env.DATA_DIR);
    } catch (error) {
        console.log(error);
        return process.exit(-1);
    }   
}

start();