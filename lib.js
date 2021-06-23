;(function($){
  'use strict';

  /**
   * Sandbox Theme Frontend JS Revealing Module
   *
   * Gives you all you need to deal with frontend/client/browser interactions
   * - feature methods API to easy develop fast forward features
   * - global API methods to access page data and information about the current page
   * - global namespace of the lib in the window object
   * - you can change the name with search/replace
   * 
   * @namespace  sandboxTheme
   */
  window.sandboxTheme = (function(){

        /**
         * @var  {jQuery_DOMelement}  $body  selected body element         * 
         * @memberof! sandboxTheme
         * @private
         */
    var $body = $('body'),

        /**
         * @var  {array}  eventNames  list of allowed event names. 
         * 
         * Can be extended with custom names
         * 
         * Default event names:
         * - 'resize'
         * - 'scroll'
         * - 'ready'
         * - 'load'
         * - 'sticky'
         * 
         * @memberof! sandboxTheme
         * @private
         */
        eventNames = [
          'resize', 
          'scroll',
          'ready', 
          'load', 
          'sticky',
        ],

        /**
         * @var  {array}  readyStates  list of possible ready states. 
         * 
         * @memberof! sandboxTheme
         * @private
         */
        readyStates = ['interactive', 'complete'],

        /**
         * @function  trigger_event  loops trough all features, checks if its active and executes the callback if any is present
         * @param    {string}  eventName    name of the event to trigger
         * @param    {object}  [eventData]  pass additional data to the event handlers
         * 
         * @memberof! sandboxTheme
         * @private
         */
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
                  if ( typeof feature[eventName] === 'function' ) {
                    feature[eventName](eventData);
                  }
                }
              }
            }
          }
        },

        /**
         * @function  ready_events_register  sets all event handler after the document has become "ready"   
         *
         * @memberof! sandboxTheme
         * @private
         */
        ready_events_register = function(){
          trigger_event('ready');
          document.addEventListener('scroll', function(event){
            trigger_event('scroll', event);
          }, { passive: true });
          window.addEventListener('resize', function(event){
            trigger_event('resize', event);
          }, { passive: true });
        },

        /**
         * @function  setup  initiates the sandboxTheme 
         * @param    {object}  data  data stack to instantiate with   
         *
         * @memberof! sandboxTheme
         * @private
         */
        setup = function setup(){
          var featureName,
              feature,
              featureOptions,
              dataName,
              dataValue,
              data = arguments[0];


          /**
           * @member  {object}  info  gerneral purpose data storage, gets extracted from init data "info" key values and gets extended by features informations
           * 
           * can be also filled and extended like the page data
           * 
           * @memberof sandboxTheme
           */
          sandboxTheme.info = {};

          /**
           * @member  {object}  page  page data storage, gets extracted from init data with every key/value pairs except for the "info" key
           *
           *   WordPress usual contents with the sandboxTheme_data:
           *   - ID:   number
           *   - name: string  the slug/permalink name of that page/post/content
           *   - meta: object  other field contents, in WordPress filled with "get_post_custom()"
           *   - verify:       nonce value used for admin-ajax requests filled with "wp_create_nonce('sandbox_ajax_call')"
           *   - urls: object  contains addresses where your script can communicate with
           *   -- admin-ajax:    address to access ajax responder functions
           *   -- rest:          rest endpoint for that page
           *   -- template:      Template root folder URL
           *                        
           *   Drupal usual contents of window.drupalsettings:
           *   - ajaxTrustedUrl:   object
           *   - data:   object  contains informations about external links and other stuff
           *   - path:   object  contains relevant data
           *   -- baseUrl:             string   root of the website
           *   -- currentLanguage:     string   2 letter ISO language code
           *   -- currentPath:         string   the node path, example "node/1" also useable as ID
           *   -- currentPathIsAdmin:  Boolean
           *   -- isFront:             Boolean
           *   -- pathPrefix:          string   ""
           *   -- scriptPath:          string/null
           *   - there are even more keys there, to see all look at
           *   UNFORTUNATLY there is no documentation for Drupal what default values are inside of "drupalssettings"
           *   also it may be subject to change
           *                        
           *   Shopify usual contents of window.sandboxTheme_data
           *   - handle:        string  the slug/permalink name of that page/post/content
           *   - template:      string  the used template root file name
           *   - shopCurrency:  string  ISO currency name
           *   - moneyFormat:   string  template to display an ammount, example: "&euro;{{amount}}"
           *                        
           *   you can add more values in a similar way as WordPress or you can also use the global
           *   window.Shopify object as data source, but thats then not extendable.
           *   UNFORTUNATLY there is no documentation for Shopify what default values are inside of "window.Shopify"
           *   also it may be subject to change
           *
           * @memberof sandboxTheme
           */
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

    /**
     * Public API
     */
    return {

      /**
       * init method
       * 
       * use to initiate the lib. 
       * you can fill the first param "data" it with a handed over localization script in JSON format
       * 
       * @param    {object}  data  named usually "sandboxTheme_data"
       *                      
       *   WordPress: use wp_localize_script to add data. 
       *   See /theme/wordpress/functions.php for detailed possibilities
       *                      
       *   Drupal: use the global "window.drupalsettings" data stack
       *   See https://www.codimth.com/blog/web/drupal/passing-data-php-javascript-drupal-8 for implementations
       * 
       *   Shopify: use "window.theme"
       * @memberof sandboxTheme
       * @example
       * // only prepared data
       * sandboxTheme.init(sandboxTheme_data);
       * 
       * // get more data from the WordPress REST API
       * // Don't forget to add "'show_in_rest' => true," when registering a custom post type
       * var siteData = $.getJSON(sandboxTheme_data.urls.rest);
       *
       * siteData.done(function(pageData){
       *   if ( $.isPlainObject(pageData) ) {
       *     sandboxTheme.init($.extend(sandboxTheme_data, pageData));
       *   } else {
       *     sandboxTheme.init(sandboxTheme_data);
       *   }
       * });
       */
      init: function init(){
        setup(arguments[0] || null);
      },

      /**
       * @member  {jQuery_DOMelement}  $body  never again select $('body') just use sandboxTheme.$body or document.body
       * @memberof sandboxTheme
       * @example
       * sandboxTheme.$body.addClass('myClass');
       */
      $body: $body,

      /**
       * is_page method
       * 
       * use to determine if this is a "page", in WordPress this means if it has the post_type "page"
       * 
       * @param    {number}  [ID]  when an ID gets provided is_page() checks if you are on a post/page/content with that ID 
       * @memberof sandboxTheme
       * @example
       * if ( sandboxTheme.is_page(8) { 
       *   // on page with the ID 8
       * };
       */
      is_page: function is_page(){
        var id = typeof arguments[0] !== 'undefined' ? parseInt(arguments[0]) : null;

        if ( id ) {
          return id === sandboxTheme.page.id;
        } else {
          return sandboxTheme.info.is_page;
        }
      },

      /**
       * get_page  method
       * 
       * returns you all page properties in sandboxTheme.page or single properties if a propertyname is provided
       * 
       * @param   {string}  [property]  inspect sandboxTheme.page for possible values. 
       *
       * Throws an error if the property does not exist.
       *
       * @memberof sandboxTheme
       * @example
       * var ajax_url = sandboxTheme.get_page('urls').ajax;
       * 
       * if ( sandboxTheme.get_page('url_params').get('view') === 'student' ) { 
       *   // URL has "?view=student"
       * };
       */
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

      /**
       * get_feature
       * 
       * returns you all registered features or a single feature if a featurename is provided
       * 
       * @param  {string} [feature_name]  inspect sandboxTheme.featrues for possible values.
       *                                  throws an error if the feature does not exist.
       * @return {namespace|object}       all registered features or a single feature if a featurename is provided
       * @memberof sandboxTheme
       * @example
       * var scrolled_feature = sandboxTheme.get_feature('scrolled');
       * 
       * // sandboxTheme.info['feature-scrolled'] true when setup() of that feature returned true
       * // typeof scrolled_feature.ready === 'function' check if that optional method exists
       * if ( sandboxTheme.info['feature-scrolled'] && typeof scrolled_feature.ready === 'function' ) {
       *   scrolled_feature.ready();
       * }
       */
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

      /**
       * trigger method
       * 
       * use to trigger an internal event. 
       * all features methods with the same name as the event name will be executed.
       *
       * only event names in the list of the internal "eventNames" array are allowed.
       *
       * Default event names:
       * - 'resize'
       * - 'scroll'
       * - 'ready'
       * - 'load'
       * - 'sticky'
       * 
       * you can easily extend that list to allow more event names.
       *
       * @param    {string}  eventName    name of the event to trigger
       * @param    {object}  [eventData]  pass additional data to the event handlers
       * @memberof sandboxTheme
       * @example
       * element.addEventlistener('click', function(event){
       *   if ( document.body.classList.contains('active') ) {
       *     // all present "disable_element()" methods of all features get executed
       *     sandboxTheme.trigger('disable_element', element);
       *   } else {
       *     // all present "enable_element()" methods of all features get executed
       *     sandboxTheme.trigger('enable_element', element);
       *   }
       * });
       */
      trigger: function trigger(){
        var eventName = typeof arguments[0] !== 'undefined' ? arguments[0] : null,
            data = typeof arguments[1] !== 'undefined' ? arguments[1] : null;

        if ( eventName && $.inArray(eventName, eventNames) !== -1 ) {
          trigger_event(eventName, data);
        }
      },

      /**
       * Sanitize HTML class
       * 
       * Clone of WordPress PHP API method sanitize_html_class for best compatibility.
       * 
       * Use it to get save sanitized html classNames
       *                        
       * @param    {string}  class_name  required  string you want to be a class name
       * @memberof sandboxTheme
       * @example
       * var text = element.textContent, // hello world
       *     class_name = sandboxTheme.sanitize_html_class(text); // hello-world
       */
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
  })();
  

  /**
   * place to add your features.
   * @namespace  sandboxTheme.features
   * @member  {namespace}
   * @memberof   sandboxTheme
   */
  sandboxTheme.features = {};
  
})(jQuery);

