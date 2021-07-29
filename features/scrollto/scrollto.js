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
     * scrollto scroll to a given hash value
     * 
     * @example
     * <a href="#top" rel="srollto">scroll to top</a>
     * <button data-href="#top" rel="srollto">scroll to top</button>
     * 
     * @name   key        enter the name of the feature as features['key']. It gets used automaticly later
     *                    access in methods with "this.info.name"      
     * 
     * @data   options    optional  this is the configuration part. its structure is only a convention i use. 
     *                    you can also add your variables directly to the feature root but i prefer it that way but an empty object will be created anyways.
     *                    access in methods with "this.options"
     *
     */
    scrollto: {
      options: {
        /**
         * options for the scrollIntoView method
         * @link https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView
         */
        scrollIntoViewOptions: {
          behavior:'smooth'
        }
      },
      /**
       * @data   info       always  this is where you can store informations about states, data about XHR requests or other stuff.
       *                    access in methods with "this.info"
       *                    you don't need to write it down, it gets created anyway.
       *                    it gets autofilld before setup() gets called with: 
       * 
       *                    - name: the feature key you write for the feature
       *                    - class_name: sanitized by a clone of WP "sanitize_html_class()" version of the features name
       *                    - hash: gets filled if there is a "#this.dataset.top" URL hash starting with the features name with the complete hash
       *
       */

      /**
       * @method [events] 
       * 
       * Selects all elements with the attribute `rel` and the value `scrollto`
       * For elements that are anchors it searches the hash value 
       * for all other elements it needs a `data-href` attribute to get the hash value
       * Based on the hash value the target element is selected.
       * If `target_element` is not null the page will be scrolled to it otherwise you will recieve an error massage.
       */
      events: function(){
        var scrollIntoViewOptions = this.options.scrollIntoViewOptions,
            $window = this.$window;

        document.querySelectorAll('[rel="' + this.info.class_name + '"]').forEach(function(element){
          element.addEventListener('click', function(event){
            var target_element = null;
            
            if ( typeof this.hash !== 'undefined' ) {
              if ( this.hash !== '' ) { 
                target_element = document.getElementById(this.hash.replace('#', ''));
              }
            } else if ( typeof this.dataset.href !== 'undefined' ) {
              if ( this.dataset.href !== '' && this.dataset.href.lastIndexOf('#', 0) === 0 ) {
                target_element = document.getElementById(this.dataset.href.replace('#', '')); 
              }
            }
            if ( target_element !== null ) {
              target_element.scrollIntoView(scrollIntoViewOptions);
            } else {
              throw new Error('there is no element to scroll to');
            }
            event.preventDefault();
          });
        });        
      },

      /**
       * @method [ready]  
       * 
       * executes the events method.
       * gets called on "DOMContentLoaded" event of the document or possible later when the "readyState" is one of "interactive" or "complete"
       * 
       * @memberof sandboxTheme.features.scrollto
       */
      ready: function(){
        this.events();
      },

      /**
       * @method setup
       * 
       * returns true because its used on every page.
       * 
       * mandatory  gets called imediatly after executing this script
       * must return a Boolean() value which desides if any further method of that feature gets called.
       * you can use global page and info values to determine the value.
       * examples:
       * - sandboxTheme.info.is_front_page: feature only executes on the front page
       * - sandboxTheme.info.is_single: feature executes on all "single" posts/pages/other post types
       * - sandboxTheme.info.comments_open && sandboxTheme.info.is_user_logged_in: feature executes on posts with comments open and logged in user
       * - sandboxTheme.info.post_type === 'my_custom_post_type': for all posts of a specific post type
       * - sandboxTheme.is_page(8): feature only executes on the page with the ID 8
       * - sandboxTheme.get_page('name') === 'my-new-post': looks if permalink name of the content is "my-new-post"
       * - sandboxTheme.get_page('url_params').get('myParam') === 'myValue': looks if the URL contains "?myParam=myValue"
       *
       *  look for "sandboxTheme" in the JS console of your Browser to see all data and methods,
       *
       *  you can combine that:
       *  - sandboxTheme.info.is_user_logged_in && ( sandboxTheme.is_page(5142) || sandboxTheme.is_page(5480): only for logged in users on the user frontend profile page
       *
       *  you can also check for the existance of other global JS variables to support or extend specific plugins 
       *  or you simply can return true to execute the feature on every page.
       * 
       * @memberof sandboxTheme.features.scrollto
       * 
       * @returns  boolean  is_setup
       */
      setup: function(){
        return true;
      }
    },
  });
})(jQuery);