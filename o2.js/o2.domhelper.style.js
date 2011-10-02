/*global o2 */

/**
 * @module domhelper.style
 * @requires domhelper.core
 * @requires stringhelper.transform
 *
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 * -->
 *
 * <p>A utility package to
 * <strong>add</strong>/<strong>remove</strong>/<strong>modify</strong>
 * styles.</p>
 */
( function(framework, window, UNDEFINED) {

    /*
     * Aliases.
     */
    var me = framework.DomHelper;
    var $ = framework.$;
    var myName = framework.name;
    var toCamelCase = framework.StringHelper.toCamelCase;
    var toDashedFromCamelCase = framework.StringHelper.toDashedFromCamelCase;

    /*
     * Module configuration.
     */
    var config = {

        /*
         *
         */
        constants : {

            /*
             *
             */
            regExp : {
                CAMEL_CASE : /(\-[a-z])/g,
                ALL_CAPS : /([A-Z])/g
            },

            /*
             *
             */
            text : {
                DASH : '-'
            }

        }

    };

    /**
     * @function {static} o2.DomHelper.addStyle
     *
     * <p>Adds style attributes to a <code>DOM</code> node.</p>
     *
     * <p>Note that adding and removing style attributes to a
     * <strong>DOM</strong>
     * not is considered "bad practice". Do not use inline styles to modify the
     * view;
     * assign <strong>className</strong>'s instead of <strong>style</strong>
     * values.</p>
     *
     * @param {Object} obj - the current <code>DOM</code> node, or the
     * <strong>id</strong> of that node, to add styles to.
     * @param {Object} style - styles in the form <code>{style1:value1,
     * style2:value2}</code>.
     */
    me.addStyle = function(obj, style) {

        //
        obj = $(obj);

        if(!obj) {

            return;
        }

        var toCamelCaseCached = toCamelCase;

        for(var key in style) {
            if(style.hasOwnProperty(key)) {
                obj.style[toCamelCaseCached(key)] = style[key];
            }
        }

    };

    /**
     * @function {static} o2.DomHelper.getStyle
     *
     * <p>Gets the <strong>style</strong> of a given property of the element.</p>
     * <p>Tries to parse the <code>currentStyle</code>, if available; otherwise
     * tries to calculate the style using <code>window.getComputedStyle</code>;
     * gets <code>obj.style</code> if everything else fails.
     *
     * <p>Note that adding and removing style attributes to a
     * <strong>DOM</strong> not is considered "bad practice". Do not use inline
     * styles to modify the view;
     * assign <strong>className</strong>'s instead of <strong>style</strong>
     * values.</p>
     *
     * @param {Object} obj - the element, or the <strong>id</strong> of it, to
     * check.
     * @param {String} cssProperty - the css property either
     * <strong>dash-separated</strong>
     * or <strong>camelCased</strong> (i.e.: 'border-color' or 'borderColor')
     *
     * @return the calculated <strong>style</strong> value.
     */
    me.getStyle = function(obj, cssProperty) {

        //
        obj = $(obj);

        if(!obj) {

            return null;
        }

        if(document.defaultView) {
            me.getStyle = function(obj, cssProperty) {

                //
                obj = $(obj);

                if(!obj) {

                    return null;
                }

                var defaultView = document.defaultView;

                //
                cssProperty = toCamelCase(cssProperty);

                //return the property if set inline.
                var val = obj.style[cssProperty];

                if(val) {

                    return val;
                }

                if(obj.currentStyle) {

                    return obj.currentStyle[cssProperty];
                }

                if(defaultView.getComputedStyle) {

                    return defaultView.getComputedStyle(obj, '').getPropertyValue(toDashedFromCamelCase(cssProperty));
                }

                return null;

            };

            return me.getStyle(obj, cssProperty);
        }

        me.getStyle = function(obj, cssProperty) {

            //
            obj = $(obj);

            if(!obj) {

                return;
            }

            var defaultView = window;

            //
            cssProperty = toCamelCase(cssProperty);

            var val = obj.style[cssProperty];

            if(val) {

                return val;
            }

            if(obj.currentStyle) {

                return obj.currentStyle[cssProperty];
            }

            if(defaultView.getComputedStyle) {

                return defaultView.getComputedStyle(obj, '').getPropertyValue(toDashedFromCamelCase(cssProperty));
            }

            return null;

        };

        return me.getStyle(obj, cssProperty);

    };

    /**
     * @function {static} o2.DomHelper.isVisible
     *
     * <p>Checks whether the <strong>DOM</strong> node is visible.</p>
     * <p>Note that being visible does not necessarily mean being available
     * inside the <strong>viewport</strong>.</p>
     * <p>If a <strong>DOM</strong> node has <code>display == 'none'</code>
     * or <code>visibility == 'hidden'</code> <strong>CSS</strong> properties,
     * then it's regarded as "invisible", otherwise it is considered to be
     * "visible".</p>
     *
     * @param {Object} obj - the <strong>DOM</strong> element, or the
     * <strong>id</strong> of it, to test.
     *
     * @return <code>true</code> if the element is visible, <code>false</code>
     * otherwise.
     */
    me.isVisible = function(obj) {

        //
        obj = $(obj);

        if(!obj) {

            return false;
        }

        // has offset dimensions
        // OR display IN (inline,block,'')
        // OR visibility in ('visible','')
        //
        // getStyle returns null if it cannot
        // reliably determine the style (this happens in archaic
        // browsers).
        //
        // So if there's no inline display/visibility attribute is set
        // and cannot acquire those attributes
        // from the computed style, then the method fails and returns
        // false.

        var display = me.getStyle(obj, 'display');
        var visibility = me.getStyle(obj, 'visibility');

        if(visibility == 'hidden') {

            return false;
        }

        if(display == 'none') {

            return false;
        }

        // @formatter:off
        return ((obj.offsetWidth !== 0 || obj.offsetHeight !== 0   )) || 
               ((display    === null   ) && (visibility != 'hidden')) || 
               ((visibility === null   ) && (display    != 'none'  )) || 
               ((display    != 'none'  ) && (visibility != 'hidden'));
        // @formtatter:on

    };

    /**
     * @function {static} o2.DomHelper.activateAlternateStylesheet
     *
     * <p>Activates the <strong>alternate stylesheet</strong> with the given
     * <code>title</code>.</p>
     *
     * @param {String} title - the <code>title</code> of the <strong>alternate
     * stylesheet</strong> to activate.
     */
    me.activateAlternateStylesheet = function(title) {

        var link = null;
        var t = t;
        var links = t('link');
        var shouldDisable = false;
        var linkTitle = '';

        for(var i = 0, len = links.length; i < len; i++) {
            link = links[i];
            linkTitle = link.getAttribute('title');
            shouldDisable = link.getAttribute('rel').indexOf('style') != -1 && title;
            link.disabled = (linkTitle == title) ? false : shouldDisable;
        }

    };

    /**
     * @function {static} o2.DomHelper.hide
     *
     * <p>Hides the given object.</p>
     *
     * @param {Object} obj - the <strong>DOM</strong> node, or the <strong>id</strong> to hide.
     */
    me.hide = function(obj) {

        if(!obj || typeof obj != 'object') {

            return;
        }

        if(obj.style.display != 'none') {
            obj[[myName, '_oldDisplay'].join('')] = obj.style.display;
        }

        obj.style.display = 'none';

    };

    /**
     * @function {static} o2.DomHelper.show
     *
     * <p>Shows the given object.</p>
     *
     * @param {Object} obj - the <strong>DOM</strong> node, or the <strong>id</strong> of it, to show.
     */
    me.show = function(obj) {

        if(!obj || typeof obj != 'object') {

            return;
        }

        obj.style.display = obj[[myName, '_oldDisplay'].join('')] ? obj[[myName, '_oldDisplay'].join('')] : '';

        //
        delete obj[[myName, '_oldDisplay'].join('')];

    };

}(o2, this))