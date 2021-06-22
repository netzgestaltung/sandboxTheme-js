// Custom page actions
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
