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

    /**
     * @member  {object} scrolled
     * 
     * Checks for a value in window.location.hash and scrolls there
     * Controlls a className to be set, when the page has been scrolled
     * Any layout based on this behaviour is at style.css
     *
     * @memberof sandboxTheme.features
     * @example  <caption>Example CSS usage of scrolled class_name.</caption>
     * 
     * header{
     *   height:150px;
     *   transition:height ease 150ms;
     * }
     * 
     * .scrolled header{
     *   height:40px;
     * }
     */
    scrolled: {
    
      /**
       * @member  {object}  info  gerneral purpose data storage. 
       *
       * Gets also created by sandboxTheme.init() if not present
       * @property {boolean}       is_scrolled  - current scroll state
       * @property {string}        name         - the feature name
       * @property {string}        class_name   - the feature name sanitzed by sandboxTheme.sanitize_html_class()
       * @property {string|false}  hash         - String if a hash fragment that starts with the features name exists, false otherwise
       * 
       * @memberof andboxTheme.features.scrolled
       */
      info: {
        is_scrolled: false
      },

      /**
       * @method [scroll] 
       * 
       * gets first time executed in the end of the ready event method
       * gets executed passive on "scroll" event of the window
       * 
       * @param  {string} [eventData]  event data from the original scroll event
       * 
       * @memberof andboxTheme.features.scrolled
       * @example
       * // dummy feature with only scroll method
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
        if (this.$window.scrollTop() > 100){
          if ( !this.info.isScrolled ) {
            this.info.isScrolled = true;
            document.body.classList.add(this.info.class_name);
          }
        } else {
          if ( this.info.isScrolled ) {
            this.info.isScrolled = false;
            document.body.classList.remove(this.info.class_name);
          }
        }
      },

      /**
       * @method [ready] 
       * 
       * gets executed on DOMContentLoaded or after API call if any
       * 
       * @memberof andboxTheme.features.scrolled
       * @example
       * // dummy with only ready method
       * dummy: {
       *   ready: function(){
       *     console.log('Document is ready and ' + this.info.name + ' API function called');
       *   },
       *   setup: function(){
       *     return true;
       *   }
       * }
       */
      ready: function(){
        var scrollTop = 0;

        this.$window = $(window);
        this.$target = window.location.hash.length > 0 ? $(window.location.hash) : false;

        if ( this.$target && this.$target.length > 0 ) {
          scrollTop = this.$target.offset().top;
        }
        $('html, body').scrollTop(scrollTop);
        this.scroll();
      },

      /**
       * @method setup
       * 
       * gets executed directly on script load
       * 
       * @memberof andboxTheme.features.scrolled
       * @example
       * // dummy with only setup method
       * dummy: {
       *   setup: function(){
       *     console.log('Script started and ' + this.info.name + ' API function called. Check sandboxTheme.info["feature-' + this.info.name + '"] for the return value of this setup()')
       *     return false;
       *   }
       * }
       */
      setup: function(){
        var isSetup = true; //sandboxTheme.info.is_front_page || sandboxTheme.info.is_home || sandboxTheme.info.is_archive;
        return isSetup;
      }
    },
  });
})(jQuery);
