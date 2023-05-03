function numericToRadians() {
  if (typeof Number.prototype.toRad === "undefined") {
    Number.prototype.toRad = function () {
      return (this * Math.PI) / 180;
    };
  }
}

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

function latLonToQtree(lat, lon, zoom) {
  const sinlat = Math.sin((lat * Math.PI) / 180);

  const x = 0.5 + lon / 360;
  const y = 0.5 - Math.log((1 + sinlat) / (1 - sinlat)) / (4 * Math.PI);

  let ix = Math.pow(2, zoom) * x;
  let iy = Math.pow(2, zoom) * y;

  let qtree = "";
  for (let i = 0; i < zoom; i++) {
    qtree = ((ix & 1) | (2 * (iy & 1))) + qtree;
    ix = ix >> 1;
    iy = iy >> 1;
  }
  return qtree;
}

var zoomToHashChars = function (zoom) {
  return 1 + Math.floor(zoom / 3);
};

export {
  numericToRadians,
  QuadToSlippy,
  getTileXYZ,
  latLonToQtree,
  zoomToHashChars,
};
