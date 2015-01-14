/* See LICENSE file for terms of use */
'use strict';

var unit = require('unit.js'),
    TOTP;

describe('- TOTPTest file', function()
{
    // init before each tests
    beforeEach(function()
    {
        // require TOTP
        TOTP = require('../../lib/components/TOTP');
    });

    // delete after each tests
    afterEach(function()
    {
        // delete TOTP
        TOTP = null;
    });

    // test TOTP instance
    describe('- test TOTP singleton object', function()
    {
        // check if singleton is loaded
        it('- it is loaded', function()
        {
            unit.object(TOTP);
        });

        // check if object has the following properties
        describe('- it has the following properties', function()
        {
            it('- `singleton` property', function()
            {
                unit.object(TOTP)
                    .hasOwnProperty('singleton')
                    .isNotEnumerable('singleton');
            });

            it('- `gen` property', function()
            {
                unit.object(TOTP)
                    .hasOwnProperty('gen')
                    .isEnumerable('gen');
            });
        });

        // check if singleton property has been setted correctly
        describe('- `singleton` property has been setted correctly', function()
        {
            it('- `singleton` is a function', function()
            {
                unit.function(TOTP.singleton);
            });

            it('- `singleton` function must return same instance of `TOTP`', function()
            {
                var TOTP2 =  TOTP.singleton();

                unit.object(TOTP2).isIdenticalTo(TOTP);
            });
        });

        // check if gen property has been setted correctly
        describe('- `gen` property has been setted correctly', function()
        {
            it('- `gen` is a function', function()
            {
                unit.function(TOTP.gen);
            });

            it('- `gen` function must have `key` attribute setted to work', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `key` is not setted', function ()
                    {
                        TOTP.gen();
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key must be an object');
            });

            it('- `gen` function must have `key` attribute which is a validated object', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `key` is not a validated object', function ()
                    {
                        TOTP.gen({});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key must contain at least one of string, hex');
            });

            it('- `gen` function must have `key` attribute with no empty `string` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `key` object has empty `string` value', function ()
                    {
                        TOTP.gen({string: ''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key is not allowed to be empty');
            });

            it('- `gen` function must have `key` attribute with no empty `hex` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `key` object has empty `hex` value', function ()
                    {
                        TOTP.gen({hex: ''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key is not allowed to be empty');
            });

            it('- `gen` function must have `key` attribute with conform `hex` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `key` object has `hex` value not conform', function ()
                    {
                        TOTP.gen({hex: 'A'});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key fails to match the required pattern');
            });

            it('- `gen` function must have `key` attribute with one of `string` or `hex` value', function()
            {
                unit.exception(function()
                {
                    unit.when('call `gen` and `key` object has `string` and `hex` values', function()
                    {
                        TOTP.gen({string: '', hex:''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('key contains a conflict between exclusive peers string, hex');
            });

            it('- `gen` function must have `opt` attribute with number `time` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no number `time` value', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {time:''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be a number');
            });

            it('- `gen` function must have `opt` attribute with `time` value larger than or equal to 1', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no validated `time` value less than 1', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {time:0});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be larger than or equal to 1');
            });

            it('- `gen` function must have `opt` attribute with number `timestamp` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no number `timestamp` value', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {timestamp:''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be a number');
            });

            it('- `gen` function must have `opt` attribute with `timestamp` value larger than or equal to 0', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no validated `timestamp` value less than 0', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {timestamp:-1});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be larger than or equal to 0');
            });

            it('- `gen` function must have `opt` attribute with `codeDigits` value larger than or equal to 1', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `codeDigits` value less than 1', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {codeDigits:0});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be larger than or equal to 1');
            });

            it('- `gen` function must have `opt` attribute with `codeDigits` value less than or equal to 10', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `codeDigits` value larger than 10', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {codeDigits:11});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be less than or equal to 10');
            });

            it('- `gen` function must have `opt` attribute with boolean `addChecksum` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no boolean `addChecksum` value', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {addChecksum:0});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be a boolean');
            });

            it('- `gen` function must have `opt` attribute with number `truncationOffset` value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has no number `truncationOffset` value', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {truncationOffset:''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be a number');
            });

            it('- `gen` function must have `opt` attribute with `truncationOffset` value larger than or equal to 0', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `truncationOffset` value less than 0', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {truncationOffset:-1});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be larger than or equal to 0');
            });

            it('- `gen` function must have `opt` attribute with `truncationOffset` value less than or equal to 15', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `truncationOffset` value larger than 15', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {truncationOffset:16});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be less than or equal to 15');
            });

            it('- `gen` function must have `opt` attribute with `algorithm` non empty value', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `algorithm` empty value', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {algorithm:''});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt is not allowed to be empty');
            });

            it('- `gen` function must have `opt` attribute with `algorithm` value equal to \'sha1\', \'sha256\' or \'sha512\'', function()
            {
                unit.exception(function ()
                {
                    unit.when('call `gen` and `opt` object has `algorithm` value different to \'sha1\', \'sha256\' or \'sha512\'', function ()
                    {
                        TOTP.gen({string: 'secret user'}, {algorithm:'algo'});
                    });
                })
                    .isInstanceOf(Error)
                    .hasMessage('opt must be one of sha1, sha256, sha512');
            });
        });

        // check if gen function works correctly
        describe('- `gen` works correctly', function()
        {
            it('- `gen` method create `key` variable with string value', function()
            {
                TOTP.gen({string: 'secret user'});
            });

            it('- `gen` method create `key` variable with hexadecimal value', function()
            {
                TOTP.gen({hex: '00'});
            });

            it('- `gen` method take `truncationOffset` value from `opt` parameter', function()
            {
                TOTP.gen({string: 'secret user'}, {truncationOffset:0});
            });
        });
    });
});