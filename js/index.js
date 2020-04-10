import L from 'leaflet';
import _ from 'leaflet.markercluster';

function covid19(mapId, baseDataUrl) {
    var mymap;
    
    function getApiLocation() {
        return requestJson("https://ipapi.co/json/");
    }

    function getBrowserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              function success(position) {
                resolve(position.coords);
              },
              function error(error) {
                reject(error);
              }
            );
        });
    }

    function getUserLocation() {
        if ("geolocation" in navigator) {
          return getBrowserLocation().catch(() => getApiLocation());
        }

        return getApiLocation();
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

    function createLegend(data) {
        var info = L.control();

        info.onAdd = function() {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function() {
            var content = '<h4>COVID-19 en Perú</h4><span class="line danger"></span> ' + data.actives +'<br/><span class="line success"></span> ' + data.recovereds +'<br/><span class="line dark"></span> ' + data.deaths +'<br/>';
            content +='<br/><b>Actualizado</b><br/> ' + formatDate('DD/MM/YYYY', data.date)
            this._div.innerHTML = content;
        };

        info.addTo(mymap);
    }
    function configureMap() {
        mymap = L.map(mapId).setView([-12.047, -77.056], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mymap);
    }

    function loadData() {
        getUserLocation()
        .then(function (location) {
            L.marker([location.latitude, location.longitude]).addTo(mymap);
            mymap.setView([location.latitude, location.longitude], 16);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            return loadMarkers();
        });    
    }

    function loadMarkers() {
        return requestJson(baseDataUrl + 'points.json')
        .then(function(marks) {
            
            var markers = L.markerClusterGroup();
            marks.forEach(function(mark) {
                
                var cMark = L.circleMarker([mark.lat, mark.lon], {
                    color: '#f03',
                    opacity: 0.5,
                    weight: 5,
                    fillColor: '#f03',
                    fillOpacity: 0.7,
                    radius: 12,
                });
    
                markers.addLayer(cMark);
            });
            mymap.addLayer(markers);
            
            return requestJson(baseDataUrl + 'stats.json')
            .then(function (data) {
                createLegend(data);
            });
        });
    }

    function requestJson(url) {

        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
    
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var json = JSON.parse(xhr.responseText);
                    resolve(json);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = function() {
                reject(xhr.statusText);
            };
    
            xhr.open("GET", url, true);
            xhr.send(); 
        });
    }

    this.init = function () {
        configureMap();
        loadData();
    }
}
window.covid19 = covid19;