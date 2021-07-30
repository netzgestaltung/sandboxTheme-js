// Custom page actions
;(function($){
  'use strict';
  
  /**
   * @namespace sandboxTheme
   */
  window.sandboxTheme = window.sandboxTheme || {};

  /**
   * @namespace features
   * @memberof sandboxTheme
   */
  sandboxTheme.features = $.extend(true, sandboxTheme.features || {}, {

    // add features here
    
    /**
     * Feature
     * 
     * Feature to see the api working
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
     *                    - hash: gets filled if there is a "#feature" URL hash starting with the features name with the complete hash
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
     feature: {
      options: {
        classNames:{
          active: 'active',
          dummy: 'dummy'
        },
        selectors: {
          container: '.feature-dummy',
          dummy: '.dummy',
        },
        texts: {
          dummy: 'move your mouse over the box'
        }        
      },
      templates:{
        'dummy': '<div />',
      },
      info: {}, // will be filled automagic with "name" -> info.name = feature
      events: function(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            info = this.info;

        this.$dummy.on('mouseenter', function(event){
          console.log('mouse entered dummy box');
          console.log(this);
        });
        this.$dummy.on('mouseleave', function(event){
          console.log('mouse leaved dummy box');
          console.log(this);
        });
      },

      /**
       * @method [resize] 
       * 
       * gets called passive on "resize" event of the window
       * 
       * @param  {string} [eventData]  event data from the original resize event
       * 
       * @memberof sandboxTheme.features.dummy
       * @example
       * // dummy with only resize method
       * dummy: {
       *   resize: function(event){
       *     console.log('resized and ' + this.info.name + '.resize() API method called');
       *   },
       *   setup: function(){
       *     return true;
       *   }
       * }
       */
      resize: function(){
        console.log('resized and ' + this.info.name + ' resize API method executed');
      },

      /**
       * @method [scroll] 
       * 
       * gets called passive on "scroll" event of the window
       * 
       * @param  {string} [eventData]  event data from the original scroll event
       * 
       * @memberof sandboxTheme.features.dummy
       * @example
       * // dummy with only scroll method
       * dummy: {
       *   scroll: function(event){
       *     console.log('scrolled and ' + this.info.name + '.scroll() API method called');
       *   },
       *   setup: function(){
       *     return true;
       *   }
       * }
       */
      scroll: function(){
        console.log('scrolled and "' + this.info.name + '" scroll API method executed');
      },
      ready: function(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            templates = this.templates,
            info = this.info;

        console.log('Document is ready and "' + this.info.name + '" ready API method executed');

        // create $dummy DOM Element and register it to the feature
        this.$dummy = $(templates.dummy).addClass(classNames.dummy).text(this.options.texts.dummy);
        this.$container = $(selectors.container);

        // add $dummy to $body
        this.$container.append(this.$dummy);

        // add test class to the body element
        document.body.classList.add(this.info.class_name + '-' + this.options.classNames.active);

        // use events function to add event handlers
        this.events();
        console.log('Feature "' + this.info.name + '" finished setup and ready methods');
      },
      setup: function(){
        var is_setup = true; // is_allowed_page && !( is_denied_permanet || is_denied_by_url );

        console.log('Document is laoded and "' + this.info.name + '" setup API method executed');

        // return value gets evaluated at pageload.
        // must return Boolean() true or false
        // if false, other API function will be left out and the script gets faster
        return is_setup;
      }
    }

  });
})(jQuery);
