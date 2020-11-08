let cityName = "Karlsruhe";

function fetchRKI(callback){
    $.ajax({
        url: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?outFields=OBJECTID,cases7_per_100k,GEN&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelWithin&inSR=4326&outSR=4326&f=json&geometry=8.4034195,49.0068705',
        type: 'post',
        success: function(response){
            // Perform operation on the return value
            let jsonRKI = JSON.parse(response);
            let data = jsonRKI.features[0].attributes;
            callback(data);
        }
    });
}

function fetchDM(callback) {
    $.ajax({
        url: '/klopapier',
        type: 'get',
        success: function(response){
            // Perform operation on the return value
            let jsonDM = JSON.parse(JSON.stringify(response));
            callback(jsonDM);
        }
    })
}

function updateDM() {
    let dmCount = document.getElementById('dm-counter');
    let dmCountEng = document.getElementById('dm-counter-eng');
    let dmText  = document.getElementById('dm-heading')
    let dmTextEng  = document.getElementById('dm-heading-eng')
    let dmColor = document.getElementById('dm-wrapper');
    let dmColorEng = document.getElementById('dm-wrapper-eng');
    let counter = 0;
    fetchDM(data => {
        for (var i in data.storeAvailabilities) {
            for (let j in data.storeAvailabilities[i]) {
                counter += data.storeAvailabilities[i][j].stockLevel;
            }
        }
        dmCount.innerHTML = counter;
        dmCountEng.innerHTML = counter;
        if (counter < 480) {
            dmColor.className = 'incidence-severe';
            dmColorEng.className = 'incidence-severe';
            dmText.innerHTML = 'Das Klopapier in ' + cityName + ' ist knapp!';
            dmTextEng.innerHTML = 'Toilet paper in ' + cityName + ' is short in supply!';
        } else if(counter < 3000) {
            dmColor.className = 'incidence-medium';
            dmText.innerHTML = 'Das Klopapier in ' + cityName + ' wird knapp!';
            dmTextEng.innerHTML = 'Toilet paper in ' + cityName + ' is running out!';
        } else {
            dmColor.className = 'incidence-low';
            dmText.innerHTML = 'Es ist genug Klopapier in ' + cityName + ' vorhanden!';
            dmTextEng.innerHTML = 'There is enough toilet paper in ' + cityName + '!';
        }
    });
}

function updateRKI() {
    let incidenceField = document.getElementById('rki-incidence');
    let incidenceFieldEng = document.getElementById('rki-incidence-eng');
    let incidenceColor = document.getElementById('rki-wrapper');
    let incidenceColorEng = document.getElementById('rki-wrapper-eng');
    let incidenceText = document.getElementById('rki-heading');
    let incidenceTextEng = document.getElementById('rki-heading-eng');
    fetchRKI(data => {
        cityName = data.GEN;
        let casesCount = data.cases7_per_100k.toFixed(2);
        incidenceField.innerHTML = casesCount;
        incidenceFieldEng.innerHTML = casesCount;
        incidenceText.innerHTML = cityName + ' ist ein Covid-19 Hotspot.'
        incidenceTextEng.innerHTML = cityName + ' is a Covid-19 hotspot.'
        if (casesCount < 35) {
            incidenceColor.className = 'incidence-low';
            incidenceText.innerText = cityName + ' ist kein Covid-19 Hotspot.'
            incidenceTextEng.innerText = cityName + ' is no Covid-19 hotspot.'
        } else if (casesCount < 50) {
            incidenceColor.className = 'incidence-medium';
            incidenceColorEng.className = 'incidence-medium';
        } else {
            incidenceColor.className = 'incidence-severe';
            incidenceColorEng.className = 'incidence-severe';
        }
    });
}

$(document).ready(function(){
    updateRKI();
    updateDM();
    setInterval(updateRKI,100000);
    setInterval(updateDM,100000);
});