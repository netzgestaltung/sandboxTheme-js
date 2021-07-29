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
     * Scroll Indicator
     * ================
     * Indicates the scrolled distance
     * in percent relative to the viewport
     * as a progress bar
     */        
    scrollindicator: {
      options: {
        selectors: {
          progress: '#scroll-indicator',
        }
      },
      resize: function resize(){
        if ( this.info.is_active ) {
          this.$progress.attr('max', $(document).height() - sandboxTheme.get_viewport_size().height);
        }
      },
      scroll: function scroll(){
        if ( this.info.is_active ) {
          this.$progress.attr('value', $(window).scrollTop());
        }
      },
      load: function load(){
        if ( this.info.is_active ) {
          this.resize();
          this.scroll();
        }
      },
      ready: function ready(){
        this.$progress = $(this.options.selectors.progress);
        this.info.is_active = this.$progress.length > 0;
      },
      setup: function setup(){
        var isSetup = true;
        return isSetup;
      }
    }

  });
})(jQuery);
