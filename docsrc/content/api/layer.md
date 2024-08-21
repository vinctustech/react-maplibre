Layer
=====

A component that adds a [layer](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/) to a map.

[//]: # (TODO: example)

Props
-----

#### `layer` AnyLayer

The Mapbox Layer object. Currently, the `layer.id` is copied to `layer.source` so that the source and layer have the same id.

#### `source` GeoJSONSourceRaw

A raw GeoJSON source object. Currently, only raw GeoJSON is supported as a source.
