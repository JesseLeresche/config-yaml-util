#!/usr/bin/env node
'use strict';

/**
 * Require dependencies
 *
 */

const program = require('commander'),
    chalk = require("chalk"),
    pkg = require('./package.json'),
    yaml = require('yamljs'),
    jsyaml = require('js-yaml'),
    fs   = require('fs'),
    parser = require('./scripts/parser'),
    alphabetize = require('alphabetize-object-keys');


function sortFile(file, options) {
    try {

        var files = [];
        const properties = new Set();
        jsyaml.safeLoadAll(fs.readFileSync(file), function (doc) {
            if (options.verbose) console.log(doc);
            files.push(parser.deflate(doc));
        });

        for (let j = 0; j < files.length; j++) {
            for (let k = 0; k < files[j].length; k++) {
                if (!files[j][k].includes("spring.profiles")) {
                    properties.add(files[j][k]);
                }
            }
        }

        if (options.verbose) {
            properties.forEach(function (value) {
                console.log(value);
            });
        }

        var inflated = parser.inflate(properties);
        var sorted = alphabetize(inflated);

        console.log(yaml.stringify(sorted, 8));
    } catch (e) {
        console.log(e);
    }
}

function sortJson(file, options) {
    var jsonFile = JSON.parse(fs.readFileSync(file));
    if (options.verbose) console.log(jsonFile);

    var sorted = alphabetize(jsonFile);
    console.log(sorted);
}

program
    .version(pkg.version)
    .command('sort <file>')
    .option('-v, --verbose', 'Show verbose logging')
    .action(sortFile);

program
    .command('json-sort <file>')
    .option('-v, --verbose', 'Verbose logging')
    .action(sortJson);

program.parse(process.argv);