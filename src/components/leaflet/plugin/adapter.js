/* SHOULD BE IN STATE */
var selectedRects = [];
var selectedHashes = [];
var currentHash;
var adapter = quadAdapter;
var mousePositionEvent = null;

const quadAdapter = {
  range: ["0", "1", "2", "3"],
  encode: function (centroid, precision) {
    var zoom = precision - 1;
    //var tile = getTileXYZ( centroid.lat, centroid.lng, zoom );
    //return SlippyToQuad( tile.x, tile.y, tile.z );
    return latLonToQtree(centroid.lat, centroid.lng, zoom);
  },
  bbox: function (hash) {
    var tileSize = 256;
    var tile = QuadToSlippy(hash);

    // get NorthWest and SouthEast points
    var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    seTilePoint.x += tileSize;
    seTilePoint.y += tileSize;

    var nwLatLon = map.unproject(nwTilePoint, tile.z);
    var seLatLon = map.unproject(seTilePoint, tile.z);

    return {
      minlng: nwLatLon.lng,
      minlat: seLatLon.lat,
      maxlng: seLatLon.lng,
      maxlat: nwLatLon.lat,
    };
  },
  layers: function (currentHash, zoom) {
    var layers = {};
    if (zoom > 2) layers[currentHash.substr(0, zoom - 2)] = true;
    if (zoom > 1) layers[currentHash.substr(0, zoom - 1)] = true;
    layers[currentHash.substr(0, zoom)] = true;
    return layers;
  },
  labels: function (hash) {
    return {
      long: hash,
      short: hash.substr(-1, 1),
    };
  },
};

function latLonToQtree(lat, lon, zoom) {
  sinlat = Math.sin((lat * Math.PI) / 180);

  x = 0.5 + lon / 360;
  y = 0.5 - Math.log((1 + sinlat) / (1 - sinlat)) / (4 * Math.PI);

  ix = Math.pow(2, zoom) * x;
  iy = Math.pow(2, zoom) * y;

  qtree = "";
  for (i = 0; i < zoom; i++) {
    qtree = ((ix & 1) | (2 * (iy & 1))) + qtree;
    ix = ix >> 1;
    iy = iy >> 1;
  }
  return qtree;
}

function getTileXYZ(lat, lon, zoom) {
  var xtile = parseInt(Math.floor(((lon + 180) / 360) * (1 << zoom)));
  var ytile = parseInt(
    Math.floor(
      ((1 -
        Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) /
        2) *
        (1 << zoom)
    )
  );
  return { x: xtile, y: ytile, z: zoom };
}

function drawRect(bounds, hash, showDigit) {
  // console.log('draw');

  // generate labels
  var hashAndSize = hash + " len:" + hash.length;
  var labels = adapter.labels(hashAndSize); //hash );

  // http://leafletjs.com/reference.html#path-options
  var poly = L.rectangle(bounds, rectStyle);
  poly.bringToBack();
  poly.on("click", function () {
    hashSelect(hash, bounds);
  });
  poly.on("mouseover", function () {
    poly.setStyle(rectStyleHover);
  });
  poly.on("mouseout", function () {
    poly.setStyle(rectStyle);
  });
  poly.on("contextmenu", function (e) {
    console.log(latLonToQtree(e.latlng.lat, e.latlng.lng, hash.length));
  });
  poly.addTo(layerGroup);

  // full (long) hash marker
  if (labels.long.length > 1) {
    //var marker = new L.marker( poly.getBounds().getNorthWest(), { opacity: 0.0001 });
    //var marker = new L.marker( poly.getBounds().getNorthWest(), { opacity: 0.0001 });
    var marker = L.rectangle(bounds, { opacity: 0, fill: false });
    var pointnw = map.latLngToLayerPoint(marker.getBounds().getNorthWest());
    var pointc = map.latLngToLayerPoint(marker.getBounds().getCenter());
    marker.bindTooltip(labels.long, {
      permanent: true,
      className: "my-label",
      offset: [-(pointc.x - pointnw.x), -(pointc.x - pointnw.x) + 20],
      direction: "right",
    });
    marker.on("click", function () {
      hashSelect(hash, bounds);
    });
    marker.addTo(layerGroup);
  }

  /* large single digit marker
    if( showDigit ){
      var marker2 = new L.marker( poly.getBounds().getCenter(), { opacity: 0.0001 });
      //marker2.bindLabel( labels.short, labelConfig2 );
      marker2.bindTooltip( labels.short, {permanent: false, className: "my-label", offset: [0, 0], direction: "bottom" } );
      marker2.on('click', function(){
          hashSelect(hash,poly);
      });
      marker2.addTo( layerGroup );
    }*/
}

function drawLayer(prefix, showDigit) {
  adapter.range.forEach(function (n) {
    var hash = "" + prefix + n;

    var bbox = adapter.bbox(hash);

    var bounds = L.latLngBounds(
      L.latLng(bbox.maxlat, bbox.minlng),
      L.latLng(bbox.minlat, bbox.maxlng)
    );

    // console.log( hash );
    // console.log( bbox );
    // console.log( bounds );

    drawRect(bounds, hash, showDigit);
  });
}

function hashSelect(hash, bounds) {
  for (var i = 0; i < selectedHashes.length; i++) {
    if (selectedHashes[i] == hash) continue;
    if (
      selectedHashes[i].startsWith(hash) ||
      hash.startsWith(selectedHashes[i])
    ) {
      console.log("selection contains already added hashes");
      var popup = L.popup()
        .setLatLng(bounds.getCenter())
        .setContent(
          "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
        )
        .openOn(map);
      return;
    }
  }
  if (selectedHashes.includes(hash)) {
    //rect.setStyle(rectStyle);
    const index = selectedHashes.indexOf(hash);
    selectedGroup.removeLayer(selectedRects[index]);
    if (index > -1) {
      selectedHashes.splice(index, 1);
      selectedRects.splice(index, 1);
    }
  } // new select
  else {
    var selrect = L.rectangle(bounds, rectStyleSelect);
    selrect.bringToFront();
    selrect.on("click", function () {
      hashSelect(hash, selrect);
    });
    selectedHashes.push(hash);
    selectedRects.push(selrect);
    selrect.addTo(selectedGroup);
  }
  console.log(hash + " " + selectedHashes);
  document.getElementById("tiles").innerHTML = selectedHashes;
  if (document.getElementById("tiles").innerHTML == "")
    document.getElementById("tiles").innerHTML = "-";
}

function updateLayer() {
  var zoom = map.getZoom();
  var hashLength = zoom + 1;

  // update current hash
  currentHash = generateCurrentHash(hashLength);

  if (adapter === hashAdapter) {
    hashLength = zoomToHashChars(zoom);
  }

  var hashPrefix = currentHash.substr(0, hashLength);

  // console.log( 'zoom', zoom );
  // console.log( 'prevHash', prevHash );
  // console.log( 'hashPrefix', hashPrefix );

  // performance tweak
  // @todo: not that performant?
  if (prevHash != hashPrefix) {
    // console.log( 'zoom', zoom );
    layerGroup.clearLayers();

    var layers = adapter.layers(currentHash, zoom);
    for (var attr in layers) {
      drawLayer(attr, layers[attr]);
    }
  }

  prevHash = hashPrefix;
}

var zoomToHashChars = function (zoom) {
  return 1 + Math.floor(zoom / 3);
};

function QuadToSlippy(quad) {
  var x = 0;
  var y = 0;
  var z = 0;
  quad.split("").forEach(function (char) {
    x *= 2;
    y *= 2;
    z++;

    if (char == "1" || char == "3") {
      x++;
    }

    if (char == "2" || char == "3") {
      y++;
    }
  });
  return { x: x, y: y, z: z };
}

export {
  quadAdapter,
  drawLayer,
  getTileXYZ,
  hashSelect,
  updateLayer,
  QuadToSlippy,
};
