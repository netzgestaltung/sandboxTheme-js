
/**
 * Sanbox Theme Frontend JS Library
 * 
 * Gives you all you need to deal with frontend/client/browser interactions
 *
 * Public API
 *
 * @name    sandboxTheme  global namespace of the lib in the window object 
 *                        you can change it with search/replace
 *
 * @method  init()        use to initiate the lib. you can fill the first param "data" it with a handed over localization script in JSON format
 * @param   object  data  required named usually "sandboxTheme_data"
 *                      
 *                        WordPress: use wp_localize_script to add data. 
 *                        See /theme/wordpress/functions.php for detailed possibilities
 *                      
 *                        Drupal: use the global "window.drupalsettings" data stack
 *                        See https://www.codimth.com/blog/web/drupal/passing-data-php-javascript-drupal-8 for implementations
 *
 *                        Shopify: use "window.theme"
 *
 *
 * @body    jQuery_DOMelement $body  never again select $('body') just use this one or document.body
 *
 *
 * @data    object  page  page data storage, gets extracted from init data with every key/value pairs except for the "info" key
 *
 *                        WordPress usual contents with the sandboxTheme_data:
 *                        - ID:   number
 *                        - name: string  the slug/permalink name of that page/post/content
 *                        - meta: object  other field contents, in WordPress filled with "get_post_custom()"
 *                        - verify:       nonce value used for admin-ajax requests filled with "wp_create_nonce('sandbox_ajax_call')"
 *                        - urls: object  contains addresses where your script can communicate with
 *                        -- admin-ajax:    address to access ajax responder functions
 *                        -- rest:          rest endpoint for that page
 *                        -- template:      Template root folder URL
 *                      
 *                        Drupal usual contents of window.drupalsettings:
 *                        - ajaxTrustedUrl:   object
 *                        - data:   object  contains informations about external links and other stuff
 *                        - path:   object  contains relevant data
 *                        -- baseUrl:             string   root of the website
 *                        -- currentLanguage:     string   2 letter ISO language code
 *                        -- currentPath:         string   the node path, example "node/1" also useable as ID
 *                        -- currentPathIsAdmin:  Boolean
 *                        -- isFront:             Boolean
 *                        -- pathPrefix:          string   ""
 *                        -- scriptPath:          string/null
 *                        - there are even more keys there, to see all look at
 *                        UNFORTUNATLY there is no documentation for Drupal what default values are inside of "drupalssettings"
 *                        also it may be subject to change
 *                        
 *                        Shopify usual contents of window.sandboxTheme_data
 *                        - handle:        string  the slug/permalink name of that page/post/content
 *                        - template:      string  the used template root file name
 *                        - shopCurrency:  string  ISO currency name
 *                        - moneyFormat:   string  template to display an ammount, example: "&euro;{{amount}}"
 *                        
 *                        you can add more values in a similar way as WordPress or you can also use the global
 *                        window.Shopify object as data source, but thats then not extendable.
 *                        UNFORTUNATLY there is no documentation for Shopify what default values are inside of "window.Shopify"
 *                        also it may be subject to change
 *
 *
 * @data    object  info  info data storage, gets extracted from init data "info" key values and gets extended by features informations
 *                        can be also filled and extended like the page data
 *
 *
 * @method  trigger()     use to trigger an internal event. 
 *                        all features methods with the same name as the event name will be executed.
 *
 *                        only event names in the list of the internal "eventNames" array are allowed.
 *                        default events: 'resize', 'scroll', 'ready', 'load', 'sticky'
 *                        you can easily extend that list to allow more event names.
 *
 * @param   string  eventName  required name of the event to trigger
 * @param   object  eventData  optional pass additional data to the event handlers
 *
 *
 * @method  sanitize_html_class()  clone of WordPress PHP API method sanitize_html_class for best compatibility.
 *                                 use it to get save sanitized html classNames
 *                        
 * @param   string  class_name     required  string you want to be a class name
 *
 *
 * @method  is_page()   use to determine if this is a "page", in WordPress this means if it has the post_type "page"
 * @param   number  ID  optional  when in ID gets provided is_page() checks if you are on a post/page/content with that ID 
 *
 *
 * @method  get_page()       returns you all page properties in sandboxTheme.page or single properties if a propertyname is provided
 * @param   string property  optional  throws an error if the property does not exist.
 *
 *
 * @method  get_feature()        returns you all registered features or a single feature if a featurename is provided
 * @param   string feature_name  optional  throws an error if the feature does not exist.
 */
;(function($){
  'use strict';

  window.sandboxTheme = function(){
    var $body = $('body'),
        eventNames = [
          'resize', 
          'scroll',
          'ready', 
          'load', 
          'sticky',
        ],
        readyStates = ['interactive', 'complete'],
        trigger_event = function(){
          var feature,
              featureName,
              eventName = typeof arguments[0] !== 'undefined' ? arguments[0] : null,
              eventData = typeof arguments[1] !== 'undefined' ? arguments[1] : null;

          if ( eventName && $.inArray(eventName, eventNames) !== -1 ) {
            // Trigger all features
            for ( featureName in sandboxTheme.features ) {
              if ( sandboxTheme.features.hasOwnProperty(featureName) ) {
                if ( sandboxTheme.info['feature-' + featureName] ) {
                  feature = sandboxTheme.features[featureName];
                  if ( feature.hasOwnProperty(eventName) ) {
                    feature[eventName](eventData);
                  }
                }
              }
            }
          }
        },
        ready_events_register = function(){
          trigger_event('ready');
          document.addEventListener('scroll', function(){
            trigger_event('scroll');
          }, { passive: true });
          window.addEventListener('resize', function(){
            trigger_event('resize');
          }, { passive: true });
        },
        setup = function setup(){
          var featureName,
              feature,
              featureOptions,
              dataName,
              dataValue,
              data = arguments[0];

          sandboxTheme.info = {};
          sandboxTheme.page = {};
          
          sandboxTheme.page.url_params = new URLSearchParams(window.location.search);

          if ( $.isPlainObject(data) ) {
            for ( dataName in data ) {
              if ( data.hasOwnProperty(dataName) ) {
                dataValue = dataName === 'id' ? parseInt(data[dataName]) : data[dataName];

                if ( dataName !== 'info') {
                  sandboxTheme.page[dataName] = dataValue;
                }
              }
            }
            if ( data.hasOwnProperty('info') ) {
              for ( dataName in data.info ) {
                if ( data.info.hasOwnProperty(dataName) ) {
                  sandboxTheme.info[dataName] = data.info[dataName];
                }
              }
            }
          }

          console.log(data);

          // Loop through all features to set all neccessary data
          for ( featureName in sandboxTheme.features ) {
            if ( sandboxTheme.features.hasOwnProperty(featureName) ) {
              feature = sandboxTheme.features[featureName];

              // Make a copy of merged page feature options and feature options
              // jQuery.extend() will take care for a boolean value of options.page.features[featureName]
              featureOptions = $.extend(true, {}, feature.options || {});

              // Merge the feature with common feature functions, options and info
              $.extend(true, feature, {
                options: featureOptions,
                info: {
                  name: featureName,
                  class_name: sandboxTheme.sanitize_html_class(featureName),
                  /**
                   * Lookup for a hash fragment that starts with the features name
                   * false if no match is found
                   */
                  hash: window.location.hash.length > 0 && window.location.hash.match('^#' + featureName) ? window.location.hash.replace('#' + featureName + '-', '') : false,
                }
              });
              sandboxTheme.info['feature-' + featureName] = Boolean(feature.setup());
            }
          }

          // Execute events
          if ( $.inArray(document.readyState, readyStates) !== -1 ) {
            ready_events_register();
          } else {
            $(document).on('DOMContentLoaded readyStates', function(){
              ready_events_register();
            });
          }
          $(window).on('load', function(){
            trigger_event('load');
          });
        };

    return {
      init: function init(){
        setup(arguments[0] || null);
      },
      $body: $body,
      is_page: function is_page(){
        var id = typeof arguments[0] !== 'undefined' ? parseInt(arguments[0]) : null;

        if ( id ) {
          return id === sandboxTheme.page.id;
        } else {
          return sandboxTheme.info.is_page;
        }
      },
      get_page: function get_page(){
        var property = typeof arguments[0] === 'string' ? arguments[0] : null;

        if ( property ) {
          if ( sandboxTheme.page.hasOwnProperty(property) ) {
            return sandboxTheme.page[property];
          } else {
            throw new Error('no page property called "' + property + '"');
          }
        } else {
          return sandboxTheme.page;
        }
      },
      get_feature: function get_feature(){
        var feature_name = typeof arguments[0] === 'string' ? arguments[0] : null;

        if ( feature_name ) {
          if ( sandboxTheme.features.hasOwnProperty(feature_name) ) {
            return sandboxTheme.features[feature_name];
          } else {
            throw new Error('no feature called "' + feature_name + '"');
          }
        } else {
          return sandboxTheme.features;
        }
      },
      trigger: function trigger(){
        var eventName = typeof arguments[0] !== 'undefined' ? arguments[0] : null,
            data = typeof arguments[1] !== 'undefined' ? arguments[1] : null;

        if ( eventName && $.inArray(eventName, eventNames) !== -1 ) {
          trigger_event(eventName, data);
        }
      },
      sanitize_html_class: function sanitize_html_class(){
        var class_name = typeof arguments[0] === 'string' ? arguments[0] : null;

        // taken from WordPress PHP API for best compatibility
        // https://developer.wordpress.org/reference/functions/sanitize_html_class/
        if ( class_name ) {
          // Strip out any %-encoded octets.
          class_name = class_name.replace(/|%[a-fA-F0-9][a-fA-F0-9]|/, '');
          // Limit to A-Z, a-z, 0-9, '_', '-'.
          class_name = class_name.replace(/[^A-Za-z0-9_-]/, '');
          // replace all "_" to "-"
          class_name = class_name.split('_').join('-');

          return class_name;
        } else {
          throw new Error('Param "class_name" is not a string');
        }
      }
    };
  }();
})(jQuery);
