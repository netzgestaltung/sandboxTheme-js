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
      init: function(){
        setup(arguments[0] || null);
      },
      $body: $body,
      is_page: function(){
        var id = typeof arguments[0] !== 'undefined' ? parseInt(arguments[0]) : null;

        if ( id ) {
          return id === sandboxTheme.page.id;
        } else {
          return sandboxTheme.info.is_page;
        }
      },
      get_page: function(){
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
      get_feature: function(){
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
      trigger: function(){
        var eventName = typeof arguments[0] !== 'undefined' ? arguments[0] : null,
            data = typeof arguments[1] !== 'undefined' ? arguments[1] : null;

        if ( eventName && $.inArray(eventName, eventNames) !== -1 ) {
          trigger_event(eventName, data);
        }
      },
      sanitize_html_class: function(){
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
  
  

  sandboxTheme.features = {
    // add features here
    
    /**
     * Dummy
     * =======
     * Dummy feature to see the api working
     *
     * @name   key        enter the name of the feature as features['key']. It gets used automaticly later
     *                    access in methods with "this.info.name"
     *
     * @data   options    optional  this is the configuration part. its structure is only a convention i use. 
     *                    you can also add your variables directly to the feature root but i prefer it that way but an empty object will be created anyways.
     *                    access in methods with "this.options"
     *
     * @data   templates  optional  this is the templates part. its structure is only a convention i use. 
     *                    you can also add your variables directly to the feature root but i prefer it that way.
     *                    access in methods with "this.templates"
     *
     * @data   info       always  this is where you can store informations about states, data about XHR requests or other stuff.
     *                    access in methods with "this.info"
     *                    you don't need to write it down, it gets created anyway.
     *
     *                    it gets autofilld before setup() gets called with: 
     *                    - name: the feature key you write for the feature
     *                    - class_name: sanitized by a clone of WP "sanitize_html_class()" version of the features name
     *                    - hash: gets filled if there is a "#dummy" URL hash starting with the features name with the complete hash
     *
     * @method setup()    mandatory  gets called imediatly after executing this script
     *                    must return a Boolean() value which desides if any further method of that feature gets called.
     *                    you can use global page and info values to determine the value.
     *                    examples:
     *                    - sandboxTheme.info.is_front_page: feature only executes on the front page
     *                    - sandboxTheme.info.is_single: feature executes on all "single" posts/pages/other post types
     *                    - sandboxTheme.info.comments_open && sandboxTheme.info.is_user_logged_in: feature executes on posts with comments open and logged in user
     *                    - sandboxTheme.info.post_type === 'my_custom_post_type': for all posts of a specific post type
     *                    - sandboxTheme.is_page(8): feature only executes on the page with the ID 8
     *                    - sandboxTheme.get_page('name') === 'my-new-post': looks if permalink name of the content is "my-new-post"
     *                    - sandboxTheme.get_page('url_params').get('myParam') === 'myValue': looks if the URL contains "?myParam=myValue"
     *
     *                    look for "sandboxTheme" in the JS console of your Browser to see all data and methods,
     *
     *                    you can combine that:
     *                    - sandboxTheme.info.is_user_logged_in && ( sandboxTheme.is_page(5142) || sandboxTheme.is_page(5480): only for logged in users on the user frontend profile page
     *
     *                    you can also check for the existance of other global JS variables to support or extend specific plugins 
     *                    or you simply can return true to execute the feature on every page.
     *
     * @method load()     optional  gets called on "load" event of the window
     * @method ready()    optional  gets called on "DOMContentLoaded" event of the document or possible later when the "readyState" is one of "interactive" or "complete"
     * @method scroll()   optional  gets called passive on "scroll" event of the document
     * @method resize()   optional  gets called passive on "resize" event of the window
     *
     * @method events()   this is the place where you can add event listeners. its structure is only a convention i use.
     *                    you need to execute it yourselve, most of the time from the ready method.
     *                    you can also ommit it and add the event listeners to the ready method.
     *
     * @custom events     you can add custom event names ('myCustomEvent') to the list at line 12 and then trigger it with "sandboxTheme.trigger('myCustomEvent');
     *                    if you then add a method "myCustomEvent()" to the feature it gets executed every time the event was triggered. 
     *                    this allows cross-feature event triggering for promises resolving.
     *
     * @custom methods    besides the methods executed by events you can add methods as you like, similar to the "events()" method
     */
    dummy: {
      options: {
        classNames:{
          active: 'active',
          dummy: 'dummy'
        },
        selectors: {
          dummy: '.dummy',
        }
      },
      templates:{
        'dummy': '<div />',
      },
      info: {}, // will be filled automagic with "name" -> info.name = dummy
      events: function(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            info = this.info;

        this.$dummy.on('mouseenter', function(event){
          console.log('mouse entered $dummy');
          console.log($dummy);
        });
        this.$dummy.on('mouseleave', function(event){
          console.log('mouse leaved $dummy');
          console.log($dummy);
        });
      },
      resize: function(){
        console.log('resized and ' + this.info.name + ' API function called');
      },
      scroll: function(){
        console.log('scrolled and ' + this.info.name + ' API function called');
      },
      ready: function(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            templates = this.templates,
            info = this.info,
            $body = sandboxTheme.$body;

        console.log('Document is ready and ' + this.info.name + ' API function called');

        // create $dummy DOM Element and register it to the feature
        this.$dummy = $(templates.dummy).addClass(classNames.dummy).text(this.info.name);

        // add $dummy to $body
        $body.prepend($dummy);

        // add test class to the body element
        document.body.classList.add(this.info.class_name + '-' + this.options.classNames.active);

        // use events function to add event handlers
        this.events();
        console.log('Feature ' + this.info.name + ' finished setup and ready methods');
      },
      setup: function(){
        var is_setup = false; // is_allowed_page && !( is_denied_permanet || is_denied_by_url );

        console.log('Document is laoded and ' + this.info.name + ' API function called');

        // return value gets evaluated at pageload.
        // must return Boolean() true or false
        // if false, other API function will be left out and the script gets faster
        return is_setup;
      }
    },
  };

  /**
   * Initiate theme actions
   *
   * merges WP REST API results with theme_data
   *
   * @object sandboxTheme_data   data handed over with wp_localize_script
   * @object siteData            WP REST API result
   *
   * @use    sandboxTheme.init() initiates the page theme actions
   */
  var siteData = $.getJSON(sandboxTheme_data.urls.rest);

  siteData.done(function(pageData){
    if ( $.isPlainObject(pageData) ) {
      sandboxTheme.init($.extend(sandboxTheme_data, pageData));
    } else {
      sandboxTheme.init(sandboxTheme_data);
    }
  });

})(jQuery);
  
  
