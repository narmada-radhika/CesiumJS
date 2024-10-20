// Initialize Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer');

// Adding Bhuvan TileMap Service
const bangaloreTileServer = 'https://bhuvan.nrsc.gov.in/tiles/bangalore/{z}/{x}/{y}.png';
const imageryProvider = new Cesium.TileMapServiceImageryProvider({
    url: bangaloreTileServer,
    maximumLevel: 19,
    credit: 'Bhuvan, NRSC'
});
viewer.imageryLayers.addImageryProvider(imageryProvider);

// Define BEL Campus Polygon Coordinates
const belCampusCoordinates = [
    Cesium.Cartesian3.fromDegrees(77.5593, 13.0422),
    Cesium.Cartesian3.fromDegrees(77.5653, 13.0422),
    Cesium.Cartesian3.fromDegrees(77.5653, 13.0472),
    Cesium.Cartesian3.fromDegrees(77.5593, 13.0472),
    Cesium.Cartesian3.fromDegrees(77.5593, 13.0422) // Close the polygon
];

// Add BEL Campus Polygon Entity
const belCampusPolygon = viewer.entities.add({
    name: 'BEL Campus',
    polygon: {
        hierarchy: belCampusCoordinates,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK
    }
});

// Camera View and Flight Animation to BEL Campus
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(77.5946, 12.9716, 10000), // Bangalore location
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
    }
});

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(77.5623, 13.0447, 1000) // Close to BEL Campus
});

// Add Layer Toggle Buttons for Water and Road Layers
const layerToggleButtons = document.getElementById('layer-toggle-buttons');

if (layerToggleButtons) {
    // Water Layer (OpenStreetMap)
    const waterLayer = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
    });
    viewer.imageryLayers.addImageryProvider(waterLayer);

    const waterLayerButton = document.createElement('button');
    waterLayerButton.textContent = 'Water Layer';
    waterLayerButton.onclick = () => {
        waterLayer.enabled = !waterLayer.enabled; // Toggle water layer
    };
    layerToggleButtons.appendChild(waterLayerButton);

    // Road Layer (OpenStreetMap)
    const roadLayer = new Cesium.OpenStreetMapImageryProvider({
        url: 'https://b.tile.openstreetmap.org/'
    });
    viewer.imageryLayers.addImageryProvider(roadLayer);

    const roadLayerButton = document.createElement('button');
    roadLayerButton.textContent = 'Road Layer';
    roadLayerButton.onclick = () => {
        roadLayer.enabled = !roadLayer.enabled; // Toggle road layer
    };
    layerToggleButtons.appendChild(roadLayerButton);
} else {
    console.error("Error: layerToggleButtons element not found");
}

// User Interaction: Drawing Irregular Boundary on Mouse Move
let drawing = false;
let polygonPoints = [];

viewer.canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    const cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
        polygonPoints.push(cartesian);
    }
});

viewer.canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        const cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            polygonPoints.push(cartesian);
        }
    }
});

viewer.canvas.addEventListener('mouseup', () => {
    drawing = false;
    const polygon = new Cesium.PolygonHierarchy(polygonPoints);
    viewer.entities.add({
        name: 'Irregular Boundary',
        polygon: {
            hierarchy: polygon,
            material: Cesium.Color.BLUE.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.BLACK
        }
    });
    polygonPoints = []; // Reset points after drawing
});
