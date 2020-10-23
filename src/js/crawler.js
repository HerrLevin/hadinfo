let cityName = "CITY";

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
            console.log(jsonDM);
            callback(jsonDM);
        }
    })
}

function updateDM() {
    let dmCount = document.getElementById('dm-counter');
    let dmText  = document.getElementById('dm-heading')
    let dmColor = document.getElementById('dm-wrapper');
    let counter = 0;
    fetchDM(data => {
        for (var i in data.storeAvailabilities) {
            for (let j in data.storeAvailabilities[i]) {
                counter += data.storeAvailabilities[i][j].stockLevel
                console.log(j)
            }
        }
        dmCount.innerHTML = counter;
        if (counter < 480) {
            dmColor.className = 'incidence-severe';
            dmText.innerHTML = 'Das Klopapier in ' + cityName + ' ist knapp!';
        } else if(counter < 3000) {
            dmColor.className = 'incidence-medium';
            dmText.innerHTML = 'Das Klopapier in ' + cityName + ' wird knapp!';
        } else {
            dmColor.className = 'incidence-low';
            dmText.innerHTML = 'Es ist genug Klopapier in ' + cityName + ' vorhanden!';
        }
        console.log("Klopapier: " + counter);

    });
}

function updateRKI() {
    let incidenceField = document.getElementById('rki-incidence');
    let incidenceColor = document.getElementById('rki-wrapper');
    let incidenceText  = document.getElementById('rki-heading');
    fetchRKI(data => {
        cityName = data.GEN;
        let casesCount = data.cases7_per_100k.toFixed(2);
        incidenceField.innerHTML = casesCount;
        incidenceText.innerHTML = cityName + ' ist ein Covid-19 Hotspot.'
        if (casesCount < 35) {
            incidenceColor.className = 'incidence-low';
            incidenceText.innerText = cityName + ' ist kein Covid-19 Hotspot.'
        } else if(casesCount < 50) {
            incidenceColor.className = 'incidence-medium';
        } else {
            incidenceColor.className = 'incidence-severe';
        }
    });
}

$(document).ready(function(){
    updateRKI();
    updateDM();
    setInterval(updateRKI,10000);
    setInterval(updateDM,10000);
});