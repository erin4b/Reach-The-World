/**
 * @file
 * GIcon manager for GMap.
 * Required for markers to operate properly.
 */

/*global jQuery, Drupal, GIcon, GPoint, GSize, G_DEFAULT_ICON */

/**
 * Get the GIcon corresponding to a setname / sequence.
 * There is only one GIcon for each slot in the sequence.
 * The marker set wraps around when reaching the end of the sequence.
 * @@@ TODO: Move this directly into the preparemarker event binding.
 */
Drupal.gmap.getIcon = function (setname, sequence) {
  var othimg = ['printImage', 'mozPrintImage', 'printShadow', 'transparent'];
  // If no setname, return google's default icon.
  if (!setname) {
    return;
  }
  if (!this.gicons) {
    this.gicons = {};
  }
  if (!this.gshadows) {
    this.gshadows = {};
  }

  // If no sequence, synthesise one.
  if (!sequence) {
    // @TODO make this per-map.
    if (!this.sequences) {
      this.sequences = {};
    }
    if (!this.sequences[setname]) {
      this.sequences[setname] = -1;
    }
    this.sequences[setname]++;
    sequence = this.sequences[setname];
  }

  if (!this.gicons[setname]) {
    if (!Drupal.gmap.icons[setname]) {
      alert('Request for invalid marker set ' + setname + '!');
    }
    this.gicons[setname] = [];
    this.gshadows[setname] = [];
    var q = Drupal.gmap.icons[setname];
    var p, t;
    for (var i = 0; i < q.sequence.length; i++) {
      /*
      t = new GIcon();
      p = Drupal.gmap.iconpath + q.path;
      t.image = p + q.sequence[i].f;
      if (q.shadow.f !== '') {
        t.shadow = p + q.shadow.f;
        t.shadowSize = new GSize(q.shadow.w, q.shadow.h);
      }
      t.iconSize = new GSize(q.sequence[i].w, q.sequence[i].h);
      t.iconAnchor = new GPoint(q.anchorX, q.anchorY);
      t.infoWindowAnchor = new GPoint(q.infoX, q.infoY);
      */
      p = Drupal.gmap.iconpath + q.path;
      t = new google.maps.MarkerImage(p + q.sequence[i].f,
        new google.maps.Size(q.sequence[i].w, q.sequence[i].h),
        null,
        new google.maps.Point(q.anchorX, q.anchorY)
      );
      if (q.shadow.f !== '') {
        this.gshadows[setname][i] = new google.maps.MarkerImage(p + q.shadow.f,
          new google.maps.Size(q.shadow.w, q.shadow.h),
          null,
          new google.maps.Point(q.anchorX, q.anchorY)
        );
      }
      else {
        this.gshadows[setname][i] = null;
      }
      
      for (var j = 0; j < othimg.length; j++) {
        if (q[othimg[j]] !== '') {
          t[othimg[j]] = p + q[othimg[j]];
        }
      }
      // @@@ imageMap?
      this.gicons[setname][i] = t;
    }
    delete Drupal.gmap.icons[setname];
  }
  // TODO: Random, other cycle methods.
  return this.gicons[setname][sequence % this.gicons[setname].length];
};

Drupal.gmap.getShadow = function (setname, sequence) {
  if (this.gshadows) return this.gshadows[setname][sequence % this.gicons[setname].length];
};

/**
 * JSON callback to set up the icon defs.
 * When doing the JSON call, the data comes back in a packed format.
 * We need to expand it and file it away in a more useful format.
 */
Drupal.gmap.iconSetup = function () {
  Drupal.gmap.icons = {};
  var m = Drupal.gmap.icondata;
  var filef, filew, fileh, files;
  for (var path in m) {
    if (m.hasOwnProperty(path)) {
      // Reconstitute files array
      filef = m[path].f;
      filew = Drupal.gmap.expandArray(m[path].w, filef.length);
      fileh = Drupal.gmap.expandArray(m[path].h, filef.length);
      files = [];
      for (var i = 0; i < filef.length; i++) {
        files[i] = {f : filef[i], w : filew[i], h : fileh[i]};
      }

      for (var ini in m[path].i) {
        if (m[path].i.hasOwnProperty(ini)) {
          jQuery.extend(Drupal.gmap.icons, Drupal.gmap.expandIconDef(m[path].i[ini], path, files));
        }
      }
    }
  }
};

/**
 * Expand a compressed array.
 * This will pad arr up to len using the last value of the old array.
 */
Drupal.gmap.expandArray = function (arr, len) {
  var d = arr[0];
  for (var i = 0; i < len; i++) {
    if (!arr[i]) {
      arr[i] = d;
    }
    else {
      d = arr[i];
    }
  }
  return arr;
};

/**
 * Expand icon definition.
 * This helper function is the reverse of the packer function found in
 * gmap_markerinfo.inc.
 */
Drupal.gmap.expandIconDef = function (c, path, files) {
  var decomp = ['key', 'name', 'sequence', 'anchorX', 'anchorY', 'infoX',
    'infoY', 'shadow', 'printImage', 'mozPrintImage', 'printShadow',
    'transparent'];
  var fallback = ['', '', [], 0, 0, 0, 0, {f: '', h: 0, w: 0}, '', '', '', ''];
  var imagerep = ['shadow', 'printImage', 'mozPrintImage', 'printShadow',
    'transparent'];
  var defaults = {};
  var sets = [];
  var i, j;
  // Part 1: Defaults / Markersets
  // Expand arrays and fill in missing ones with fallbacks
  for (i = 0; i < decomp.length; i++) {
    if (!c[0][i]) {
      c[0][i] = [ fallback[i] ];
    }
    c[0][i] = Drupal.gmap.expandArray(c[0][i], c[0][0].length);
  }
  for (i = 0; i < c[0][0].length; i++) {
    for (j = 0; j < decomp.length; j++) {
      if (i === 0) {
        defaults[decomp[j]] = c[0][j][i];
      }
      else {
        if (!sets[i - 1]) {
          sets[i - 1] = {};
        }
        sets[i - 1][decomp[j]] = c[0][j][i];
      }
    }
  }
  for (i = 0; i < sets.length; i++) {
    for (j = 0; j < decomp.length; j++) {
      if (sets[i][decomp[j]] === fallback[j]) {
        sets[i][decomp[j]] = defaults[decomp[j]];
      }
    }
  }
  var icons = {};
  for (i = 0; i < sets.length; i++) {
    var key = sets[i].key;
    icons[key] = sets[i];
    icons[key].path = path;
    delete icons[key].key;
    delete sets[i];
    for (j = 0; j < icons[key].sequence.length; j++) {
      icons[key].sequence[j] = files[icons[key].sequence[j]];
    }
    for (j = 0; j < imagerep.length; j++) {
      if (typeof(icons[key][imagerep[j]]) === 'number') {
        icons[key][imagerep[j]] = files[icons[key][imagerep[j]]];
      }
    }
  }
  return icons;
};

/**
 * We attach ourselves if we find a map somewhere needing markers.
 * Note: Since we broadcast our ready event to all maps, it doesn't
 * matter which one we attached to!
 */
Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;

  obj.bind('init', function () {
    // Only expand once.
    if (!Drupal.gmap.icons) {
      Drupal.gmap.iconSetup();
    }
  });

  obj.bind('ready', function () {
    // Compatibility event.
    if (Drupal.gmap.icondata) {
      obj.deferChange('iconsready', -1);
    }
  });

  if (!obj.vars.behavior.customicons) {
    // Provide icons to markers.
    obj.bind('preparemarker', function (marker) {
      marker.opts.icon = Drupal.gmap.getIcon(marker.markername, marker.offset);
      marker.opts.shadow = Drupal.gmap.getShadow(marker.markername, marker.offset);
    });
  }
});
;


/**
 * @file
 * Common marker routines.
 */

/*global jQuery, Drupal, GEvent, GInfoWindowTab, GLatLng, GLatLngBounds */

Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;

  var infowindow = null;

  obj.bind('init', function () {
    if (obj.vars.behavior.autozoom) {
      obj.bounds = new google.maps.LatLngBounds();
    }
  });

  obj.bind('addmarker', function (marker) {
    marker.opts.position = new google.maps.LatLng(marker.latitude, marker.longitude);
    marker.opts.map = obj.map;
    var m = Drupal.gmap.factory.marker(marker.opts);
    marker.marker = m;
    google.maps.event.addListener(m, 'click', function () {
      obj.change('clickmarker', -1, marker);
    });
    if (obj.vars.behavior.highlight) {
      google.maps.event.addListener(m, 'mouseover', function () {
        var highlightColor = '#' + obj.vars.styles.highlight_color;
        highlightMarker(obj, marker, 'hoverHighlight', highlightColor);
      });
      google.maps.event.addListener(m, 'mouseout', function () {
        unHighlightMarker(obj, marker, 'hoverHighlight');
      });
    }
    if (obj.vars.behavior.extramarkerevents) {
      google.maps.event.addListener(m, 'mouseover', function () {
        obj.change('mouseovermarker', -1, marker);
      });
      google.maps.event.addListener(m, 'mouseout', function () {
        obj.change('mouseoutmarker', -1, marker);
      });
      google.maps.event.addListener(m, 'dblclick', function () {
        obj.change('dblclickmarker', -1, marker);
      });
    }
    /**
     * Perform a synthetic marker click on this marker on load.
     */
    if (marker.autoclick || (marker.options && marker.options.autoclick)) {
      obj.deferChange('clickmarker', -1, marker);
    }
    if (obj.vars.behavior.autozoom) {
      obj.bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
    }
    // If the highlight arg option is used in views highlight the marker.
    if (marker.opts.highlight == 1) {
      google.maps.event.addListener( obj.mm, 'loaded', function() {
        highlightMarker(obj, marker, 'viewHighlight', marker.opts.highlightcolor);
      } );
    }
  });

  // Default marker actions.
  obj.bind('clickmarker', function (marker) {
    // Close infowindow if open to prevent multiple windows
    if (infowindow != null){
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow();
    if (marker.text) {
	  infowindow.setContent(marker.text);
      infowindow.open(obj.map, marker.marker);
    }
    // Info Window Query / Info Window Offset
    else if (marker.iwq || (obj.vars.iwq && typeof marker.iwo != 'undefined')) {
      var iwq, iwo;
      if (obj.vars.iwq) {
        iwq = obj.vars.iwq;
      }
      if (marker.iwq) {
        iwq = marker.iwq;
      }
      iwo = 0;
      if (marker.iwo) {
        iwo = marker.iwo;
      }
      // Create a container to store the cloned DOM elements.
      var el = document.createElement('div');
      // Clone the matched object, run through the clone, stripping off ids, and move the clone into the container.
      jQuery(iwq).eq(iwo).clone(false).find('*').removeAttr('id').appendTo(jQuery(el));
	  marker.setContent(el);
      infowindow.open(obj.map, marker.marker);
    }
    // AJAX content
    else if (marker.rmt) {
      var uri = marker.rmt;
      // If there was a callback, prefix that.
      // (If there wasn't, marker.rmt was the FULL path.)
      if (obj.vars.rmtcallback) {
        uri = obj.vars.rmtcallback + '/' + marker.rmt;
      }
      // @Bevan: I think it makes more sense to do it in this order.
      // @Bevan: I don't like your choice of variable btw, seems to me like
      // @Bevan: it belongs in the map object, or at *least* somewhere in
      // @Bevan: the gmap settings proper...
      //if (!marker.text && Drupal.settings.loadingImage) {
      //  marker.marker.openInfoWindowHtml(Drupal.settings.loadingImage);
      //}
      jQuery.get(uri, {}, function (data) {
		infowindow.setContent(data);
        infowindow.open(obj.map, marker.marker);
      });
    }
    // Tabbed content
    else if (marker.tabs) {
      var data = "";
      //tabs in an infowindow is no longer supported in API ver3.  
      for (var m in marker.tabs) {
        data += marker.tabs[m];
      }
	  infowindow.setContent(data);
      infowindow.open(obj.map, marker.marker);
    }
    // No content -- marker is a link
    else if (marker.link) {
      open(marker.link, '_self');
    }
  });

  obj.bind('markersready', function () {
    // If we are autozooming, set the map center at this time.
    if (obj.vars.behavior.autozoom) {
      if (!obj.bounds.isEmpty()) {
        obj.map.fitBounds(obj.bounds);
        var listener = google.maps.event.addListener(obj.map, "idle", function() {
          if (obj.vars.maxzoom) {
            var maxzoom = parseInt(obj.vars.maxzoom)
            if (obj.map.getZoom() > maxzoom) obj.map.setZoom(maxzoom); 
            google.maps.event.removeListener(listener);             
          }
        });
      }
    }
  });

  obj.bind('clearmarkers', function () {
    // Reset bounds if autozooming
    // @@@ Perhaps we should have a bounds for both markers and shapes?
    if (obj.vars.behavior.autozoom) {
      obj.bounds = new google.maps.LatLngBounds();
    }
  });

  // @@@ TODO: Some sort of bounds handling for deletemarker? We'd have to walk the whole thing to figure out the new bounds...
});
;

/**
 * @file
 * Common marker highlighting routines.
 */

/**
 * Highlights marker on rollover.
 * Removes highlight on previous marker.
 *
 * Creates a "circle" using 20-sided GPolygon at the given point
 * Circle polygon object is global variable as there is only one highlighted marker at a time
 * and we want to remove the previously placed polygon before placing a new one.
 * 
 * Original code "Google Maps JavaScript API Example"
 */
highlightMarker = function (gmap, currentMarker, highlightID, color) {

  var map = gmap.map;

  var markerPoint = currentMarker.marker.getPosition();
  var polyPoints = Array();

  var mapNormalProj = gmap.highlight.overlay.getProjection();

  var mapZoom = map.getZoom();
  var clickedPixel = mapNormalProj.fromLatLngToDivPixel(markerPoint, mapZoom);

  var polySmallRadius = 20;
  var polyNumSides = 20;
  var polySideLength = 18;

  for (var a = 0; a < (polyNumSides + 1); a++) {
    var aRad = polySideLength * a * (Math.PI/180);
    var polyRadius = polySmallRadius; 
    var pixelX = clickedPixel.x + polyRadius * Math.cos(aRad);
    var pixelY = clickedPixel.y + polyRadius * Math.sin(aRad);
    var polyPixel = new google.maps.Point(pixelX, pixelY);
    var polyPoint = mapNormalProj.fromDivPixelToLatLng(polyPixel, mapZoom);
    polyPoints.push(polyPoint);
  }
  // Using GPolygon(points,  strokeColor?,  strokeWeight?,  strokeOpacity?,  fillColor?,  fillOpacity?)
  gmap.highlight.polygon = new google.maps.Polygon( {
    paths: polyPoints,
    strokeColor: color,
    strokeWeight: 2,
    strokeOpacity: 0,
    fillColor: color,
    fillOpacity: 0.5
  } );
  gmap.highlight.polygon.setMap( map );

};

unHighlightMarker = function (gmap, currentMarker, highlightID) {
  if (gmap.highlight.polygon) {
    gmap.highlight.polygon.setMap( null );
    delete gmap.highlight.polygon;
  }
};

Drupal.gmap.addHandler('gmap', function (elem) {

  var obj = this;

  function HighlightOverlay(m) { this.setMap(m); }

  HighlightOverlay.prototype = new google.maps.OverlayView();

  HighlightOverlay.prototype.onAdd = function() { }
  HighlightOverlay.prototype.onRemove = function() { }
  HighlightOverlay.prototype.draw = function() { }

  obj.bind('init', function () {

    obj.highlight = {};
    obj.highlight.overlay = new HighlightOverlay( obj.map );

  });

} );;

/**
 * @file
 * GPolyLine / GPolygon manager
 */

/*global Drupal, GLatLng, GPoint */

Drupal.gmap.map.prototype.poly = {};

/**
 * Distance in pixels between 2 points.
 */
Drupal.gmap.map.prototype.poly.distance = function (point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

/**
 * Circle -- Following projection.
 */
Drupal.gmap.map.prototype.poly.computeCircle = function (obj, center, point2) {
  var numSides = 36;
  var sideInc = 10; // 360 / 20 = 18 degrees
  var convFactor = Math.PI / 180;
  var points = [];
  var radius = obj.poly.distance(center, point2);
  // 36 sided poly ~= circle
  for (var i = 0; i <= numSides; i++) {
    var rad = i * sideInc * convFactor;
    var x = center.x + radius * Math.cos(rad);
    var y = center.y + radius * Math.sin(rad);
    //points.push(obj.map.getCurrentMapType().getProjection().fromPixelToLatLng(new GPoint(x,y),obj.map.getZoom()));
    points.push(new GPoint(x, y));
  }
  return points;
};

Drupal.gmap.map.prototype.poly.calcPolyPoints = function (center, radM, numPoints, sAngle) {
  if (!numPoints) {
    numPoints = 32;
  }
  if (!sAngle) {
    sAngle = 0;
  }

  var d2r = Math.PI / 180.0;
  var r2d = 180.0 / Math.PI;
  var angleRad = sAngle * d2r;
  // earth semi major axis is about 6378137 m
  var latScale = radM / 6378137 * r2d;
  var lngScale = latScale / Math.cos(center.latRadians());

  var angInc = 2 * Math.PI / numPoints;
  var points = [];
  for (var i = 0; i < numPoints; i++) {
    var lat = parseFloat(center.lat()) + latScale * Math.sin(angleRad);
    var lng = parseFloat(center.lng()) + lngScale * Math.cos(angleRad);
    points.push(new GLatLng(lat, lng));
    angleRad += angInc;
  }

  // close the shape and return it
  points.push(points[0]);
  return points;
};
;

/**
 * @file
 * Location chooser interface.
 */

/*global $, Drupal, GEvent, GLatLng, GMarker */

(function ($) {
Drupal.gmap.addHandler('gmap', function (elem) {
  var obj = this;

  var binding = obj.bind("locpickchange", function () {
    if (obj.locpick_coord) {
      google.maps.event.trigger(obj.map, "click", { 'latLng': obj.locpick_coord });
    }
  });

  obj.bind("locpickremove", function () {
    //obj.map.removeOverlay(obj.locpick_point);
    if (obj.locpick_point) obj.locpick_point.setMap(null);
    obj.locpick_point = null;
    obj.locpick_coord = null;
    obj.change('locpickchange', -1);
  });

  obj.bind("init", function () {
    if (obj.vars.behavior.locpick) {
      obj.locpick_coord = new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude);

      google.maps.event.addListener(obj.map, "click", function (event) {
        google.maps.event.trigger(obj.map, "resize");
        if (event) {
          if (!obj.locpick_point) {
            obj.locpick_point = new google.maps.Marker({
              position: event.latLng,
              map: obj.map,
              draggable: true
            });
          }
          else {
            obj.locpick_point.setPosition(event.latLng);
          }
          google.maps.event.addListener(obj.locpick_point, 'drag', function () {
            //obj.locpick_coord = obj.locpick_point.getLatLng();
            obj.locpick_coord = new google.maps.LatLng(obj.locpick_point.position.lat(), obj.locpick_point.position.lng());
            obj.change('locpickchange', binding);
          });
          google.maps.event.addListener(obj.locpick_point, 'dragend', function () {
            //obj.locpick_coord = obj.locpick_point.getLatLng();
            obj.locpick_coord = new google.maps.LatLng(obj.locpick_point.position.lat(), obj.locpick_point.position.lng());
            obj.change('locpickchange', binding);
          });
          obj.locpick_coord = event.latLng;
          obj.map.panTo(event.latLng);
          obj.change('locpickchange', binding);
        }
        else {
          // Unsetting the location
          obj.change('locpickremove', -1);
        }
      });
    }
  });

  obj.bind("ready", function () {
    // Fake a click to set the initial point, if one was set.
    if (obj.vars.behavior.locpick) {
      if (!obj.locpick_invalid) {
        obj.change('locpickchange', -1);
      }
    }
  });

});

Drupal.gmap.addHandler('locpick_latitude', function (elem) {
  var obj = this;

  obj.bind("init", function () {
    if (elem.value !== '') {
      obj.vars.latitude = Number(elem.value);
      //obj.locpick_coord = new GLatLng(obj.vars.latitude, obj.vars.longitude);
      obj.locpick_coord = new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude);
    }
    else {
      obj.locpick_coord = null;
      obj.locpick_invalid = true;
    }
  });

  var binding = obj.bind("locpickchange", function () {
    if (obj.locpick_coord) {
      elem.value = obj.locpick_coord.lat();
    }
    else {
      elem.value = '';
    }
  });

  $(elem).change(function () {
    if (elem.value !== '') {
      if (obj.locpick_coord) {
        //obj.locpick_coord = new GLatLng(Number(elem.value), obj.locpick_coord.lng());
        obj.locpick_coord = new google.maps.LatLng(Number(elem.value), obj.locpick_coord.lng());
        obj.change('locpickchange', binding);
      }
      else {
        //obj.locpick_coord = new GLatLng(Number(elem.value), 0.0);
        obj.locpick_coord = new google.maps.LatLng(Number(elem.value), 0.0);
      }
    }
    else {
      obj.change('locpickremove', -1);
    }
  });
});

Drupal.gmap.addHandler('locpick_longitude', function (elem) {
  var obj = this;

  obj.bind("init", function () {
    if (elem.value !== '') {
      obj.vars.longitude = Number(elem.value);
      //obj.locpick_coord = new GLatLng(obj.vars.latitude, obj.vars.longitude);
      obj.locpick_coord = new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude);
    }
    else {
      obj.locpick_invalid = true;
    }
  });

  var binding = obj.bind("locpickchange", function () {
    if (obj.locpick_coord) {
      elem.value = obj.locpick_coord.lng();
    }
    else {
      elem.value = '';
    }
  });

  $(elem).change(function () {
    if (elem.value !== '') {
      if (obj.locpick_coord) {
        //obj.locpick_coord = new GLatLng(obj.locpick_coord.lat(), Number(elem.value));
        obj.locpick_coord = new google.maps.LatLng(obj.locpick_coord.lat(), Number(elem.value));
        obj.change('locpickchange', binding);
      }
      else {
        //obj.locpick_coord = new GLatLng(0.0, Number(elem.value));
        obj.locpick_coord = new google.maps.LatLng(0.0, Number(elem.value));
      }
    }
    else {
      obj.change('locpickremove', -1);
    }
  });
});
})(jQuery);
;
