import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';


const sourceData = require('../gundata.json');

const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
  });

const heatmap = () => new HeatmapLayer({
    id: 'heat',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.n_killed + (d.n_injured * 0.5),
    radiusPixels: 60,
});

const hexagon = () => new HexagonLayer({
    id: 'hex',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => (d.n_killed * 2) + d.n_injured,
    elevationScale: 100,
    extruded: true,
    radius: 1609,         
    opacity: 0.6,        
    coverage: 0.88,
    lowerPercentile: 50
});

const overlay = new GoogleMapsOverlay({
    layers: [
        scatterplot(),
        heatmap(),
        hexagon()
    ],
});


window.initMap = () => {
    // google.maps.Map is refering to the globabl object as setup by the defered script call to GoogleMapsJS API
    // window refers to the viewable chrome window, which has the initMap property as set up by the defered script call mentioned above, called when the script is loaded
    setMap();
}


window.onload = () => {
    var tablinkScatterPlot = document.getElementById('tablinks-scatterplot');
    if (tablinkScatterPlot) {
        tablinkScatterPlot.addEventListener('click', () => {togglePlot('ScatterPlot')})
        // tablinkScatterPlot.addEventListener('click', togglePlot("ScatterPlot"));
    }
    var tablinkHeatMap = document.getElementById('tablinks-heatmap');
    if (tablinkHeatMap) {
        tablinkHeatMap.addEventListener('click', () => {togglePlot("HeatMap")});
    }
    var tablinkHexagon= document.getElementById('tablinks-hexagon');
    if (tablinkHexagon) {
        tablinkHexagon.addEventListener('click', () => {togglePlot("Hexagon")});
    }

    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.0, lng: -100.0},
        zoom: 5,
    });
    
}


const togglePlot = (plotType) => {
    if (plotType == "ScatterPlot") {
        if (contains(plotType, overlay.props.layers) == true) {
            const newOverlay = overlay.props.layers.filter(plot => plot.props.id !== 'scatter');
            overlay.props.layers = newOverlay;
        } else {
            overlay.setProps(scatterplot());   
        }
    }
    if (plotType == "HeatMap") {
        if (contains(plotType, overlay.props.layers)) {
            const newOverlay = overlay.props.layers.filter(plot => plot.props.id !== 'heat');
            overlay.props.layers = newOverlay;
        } else {
            overlay.setProps(heatmap());   
        }
    }
    if (plotType == "Hexagon") {
        if (contains(plotType, overlay.props.layers)) {
                const newOverlay = overlay.props.layers.filter(plot => plot.props.id !== 'hex');
                overlay.props.layers = newOverlay;
        } else {
            overlay.setProps(hexagon());   
        }
    }
    console.log(overlay);
    setMap();
    // overlay.setMap(map);
    // window.initMap();
}

const contains = (plotType, layerWithPlots) => {
    for (var i = 0; i < layerWithPlots.length; i++) {
        let plot = layerWithPlots[i];
        if (plotType == 'ScatterPlot' && plot.props.id == 'scatter') {
            return true;
        }
        if (plotType == 'HeatMap' && plot.props.id == 'heat') {
            return true
        }
        if (plotType == 'Hexagon' && plot.props.id == 'hex') {
            return true
        } 
    }
    return false;
}

const setMap = () => {
    overlay.setMap(map);
}