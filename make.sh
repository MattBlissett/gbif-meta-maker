#!/bin/bash -e
#
# Minifies the build appropriately.
#

temp=$(mktemp --suffix=.js)

cd resources/js

# Files must be in the correct order.
cat Copyright.js \
    CheckColumn.js xml2json.js \
    Ext.ux.datatip.js \
    Ext.ux.dd.GridDragDropRowOrder.js \
    GBIF.MetaMaker.Language.js \
    GBIF.MetaMaker.Center.js \
    GBIF.MetaMaker.CenterTab.js \
    GBIF.MetaMaker.Details.js \
    GBIF.MetaMaker.Extension.js \
    GBIF.MetaMaker.LoadFile.js \
    GBIF.MetaMaker.ExtensionPanel.js \
    GBIF.MetaMaker.ExtensionsTree.js \
    GBIF.MetaMaker.FileSettings.js \
    GBIF.MetaMaker.MetaPanel.js \
    GBIF.MetaMaker.Properties.js \
    GBIF.MetaMaker.app.js \
    > $temp

yui-compressor --charset UTF-8 --line-break=200 --nomunge -o GBIF.MetaMaker.MetaMaker.js $temp

rm -f $temp
