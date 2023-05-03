// import L from "leaflet";

// /* SHOULD BE IN STATE */
// var selectedRects = [];
// var selectedHashes = [];
// var currentHash;

// const quadAdapter = {
//   range: ["0", "1", "2", "3"],
//   encode: function (centroid, precision) {
//     var zoom = precision - 1;
//     //var tile = getTileXYZ( centroid.lat, centroid.lng, zoom );
//     //return SlippyToQuad( tile.x, tile.y, tile.z );
//     return latLonToQtree(centroid.lat, centroid.lng, zoom);
//   },
//   bbox: function (hash) {
//     var tileSize = 256;
//     var tile = QuadToSlippy(hash);

//     // get NorthWest and SouthEast points
//     /* LEAFLET */
//     var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
//     var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
//     seTilePoint.x += tileSize;
//     seTilePoint.y += tileSize;

//     var nwLatLon = map.unproject(nwTilePoint, tile.z);
//     var seLatLon = map.unproject(seTilePoint, tile.z);

//     return {
//       minlng: nwLatLon.lng,
//       minlat: seLatLon.lat,
//       maxlng: seLatLon.lng,
//       maxlat: nwLatLon.lat,
//     };
//   },
//   layers: function (currentHash, zoom) {
//     var layers = {};
//     if (zoom > 2) layers[currentHash.substr(0, zoom - 2)] = true;
//     if (zoom > 1) layers[currentHash.substr(0, zoom - 1)] = true;
//     layers[currentHash.substr(0, zoom)] = true;
//     return layers;
//   },
//   labels: function (hash) {
//     return {
//       long: hash,
//       short: hash.substr(-1, 1),
//     };
//   },
// };

// function drawRect(bounds, hash, showDigit) {
//   // console.log('draw');

//   // generate labels
//   var hashAndSize = hash + " len:" + hash.length;
//   var labels = quadAdapter.labels(hashAndSize); //hash );

//   // http://leafletjs.com/reference.html#path-options
//   /* LEAFLET */

//   // vanilla
//   // https://leafletjs.com/reference.html#rectangle
//   // react
//   // https://react-leaflet.js.org/docs/example-vector-layers/
//   var poly = L.rectangle(bounds, rectStyle);
//   poly.bringToBack();
//   poly.on("click", function () {
//     hashSelect(hash, bounds);
//   });
//   poly.on("mouseover", function () {
//     poly.setStyle(rectStyleHover);
//   });
//   poly.on("mouseout", function () {
//     poly.setStyle(rectStyle);
//   });
//   poly.on("contextmenu", function (e) {
//     console.log(latLonToQtree(e.latlng.lat, e.latlng.lng, hash.length));
//   });
//   poly.addTo(layerGroup);

//   // full (long) hash marker
//   if (labels.long.length > 1) {
//     /* LEAFLET */
//     var marker = L.rectangle(bounds, { opacity: 0, fill: false });
//     var pointnw = map.latLngToLayerPoint(marker.getBounds().getNorthWest());
//     var pointc = map.latLngToLayerPoint(marker.getBounds().getCenter());
//     marker.bindTooltip(labels.long, {
//       permanent: true,
//       className: "my-label",
//       offset: [-(pointc.x - pointnw.x), -(pointc.x - pointnw.x) + 20],
//       direction: "right",
//     });
//     marker.on("click", function () {
//       hashSelect(hash, bounds);
//     });
//     marker.addTo(layerGroup);
//   }
// }

// function drawLayer(prefix, showDigit) {
//   quadAdapter.range.forEach(function (n) {
//     var hash = "" + prefix + n;

//     var bbox = quadAdapter.bbox(hash);

//     /* LEAFLET */
//     var bounds = L.latLngBounds(
//       L.latLng(bbox.maxlat, bbox.minlng),
//       L.latLng(bbox.minlat, bbox.maxlng)
//     );

//     drawRect(bounds, hash, showDigit);
//   });
// }

// function hashSelect(hash, bounds) {
//   for (var i = 0; i < selectedHashes.length; i++) {
//     if (selectedHashes[i] == hash) continue;
//     if (
//       selectedHashes[i].startsWith(hash) ||
//       hash.startsWith(selectedHashes[i])
//     ) {
//       console.log("selection contains already added hashes");
//       /* LEAFLET */
//       var popup = L.popup()
//         .setLatLng(bounds.getCenter())
//         .setContent(
//           "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
//         )
//         .openOn(map);
//       return;
//     }
//   }
//   if (selectedHashes.includes(hash)) {
//     //rect.setStyle(rectStyle);
//     const index = selectedHashes.indexOf(hash);
//     /* LEAFLET */
//     selectedGroup.removeLayer(selectedRects[index]);
//     if (index > -1) {
//       selectedHashes.splice(index, 1);
//       selectedRects.splice(index, 1);
//     }
//   } // new select
//   else {
//     /* LEAFLET */
//     var selrect = L.rectangle(bounds, rectStyleSelect);
//     selrect.bringToFront();
//     selrect.on("click", function () {
//       hashSelect(hash, selrect);
//     });
//     selectedHashes.push(hash);
//     selectedRects.push(selrect);
//     selrect.addTo(selectedGroup);
//   }
//   console.log(hash + " " + selectedHashes);
//   document.getElementById("tiles").innerHTML = selectedHashes;
//   if (document.getElementById("tiles").innerHTML == "")
//     document.getElementById("tiles").innerHTML = "-";
// }

// function updateLayer() {
//   /* LEAFLET */
//   var zoom = map.getZoom();
//   var hashLength = zoom + 1;

//   // update current hash
//   currentHash = generateCurrentHash(hashLength);

//   if (quadAdapter === hashAdapter) {
//     hashLength = zoomToHashChars(zoom);
//   }

//   var hashPrefix = currentHash.substr(0, hashLength);
//   if (prevHash != hashPrefix) {
//     layerGroup.clearLayers();

//     var layers = quadAdapter.layers(currentHash, zoom);
//     for (var attr in layers) {
//       drawLayer(attr, layers[attr]);
//     }
//   }

//   prevHash = hashPrefix;
// }

// export { quadAdapter, drawLayer, hashSelect, updateLayer };
