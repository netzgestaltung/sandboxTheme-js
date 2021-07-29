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
          progress: 'progress.scroll',
        }
      },
      resize: function resize(){
        if ( this.info.is_active ) {
          this.progresses.forEach(function(progress){
            progress.setAttribute('max', document.body.scrollHeight - sandboxTheme.get_viewport_size().height);
          });
        }
      },
      scroll: function scroll(){
        if ( this.info.is_active ) {
          this.progresses.forEach(function(progress){
            progress.setAttribute('value', window.scrollY);
          });
        }
      },
      load: function load(){
        if ( this.info.is_active ) {
          this.resize();
          this.scroll();
        }
      },
      ready: function ready(){
        this.progresses = document.querySelectorAll(this.options.selectors.progress);
        this.info.is_active = this.progresses.length > 0;
      },
      setup: function setup(){
        var isSetup = true;
        return isSetup;
      }
    }

  });
})(jQuery);
