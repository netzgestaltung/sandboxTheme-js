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
     * @member  {object}  frame_embed
     * iframe embed GPDR/DSGVO conform
     * 
     * @memberof sandboxTheme.features
     * @example
     * <figure class="frame-preview">
     *   <a href="">
     *     <img src="img/" />
     *   </a>
     *   <figcaption>Mit Klick auf das Vorschaubild wir eine Verbindung zu google aufgebaut. Lesen Sie sich unsere <a href="../datenschutzerklaerung.html">Datenschutzerklärung</a> durch!</figcaption>
     * </figure>
     */
    frame_embed: {
      options: {
        classNames:{
          started: 'started'
        },
        selectors: {
          preview: 'figure.frame-preview',
          frame: '.frame',
        }
      },
      templates:{
        map: '<iframe class="frame" allowfullscreen="allowfullscreen" frameborder="0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />'
      },
      start: function(trigger){
        var classNames = this.options.classNames,
            templates = this.templates,
            $map = $(templates.map);
        
        $map.attr('src', trigger.dataset.map);
        $(trigger).parent().append($map).addClass(classNames.started);
      },
      end: function(trigger){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            $map = $(trigger).siblings(selectors.frame);
        
        $map.remove();
        $(trigger).parent().removeClass(classNames.started);
      },
      events: function events(){
        var classNames = this.options.classNames,
            google_places = this,
            $triggers = this.$previews.children('a');

        $triggers.on('click', function(event){
          if ( $(this).parent().hasClass(classNames.started) ) {
            google_places.end(this);
          } else {
            $triggers.each(function(){
              google_places.end(this);
            });
            google_places.start(this);
          }
          event.preventDefault();
        });
      },
      ready: function ready(){
        // register google previews to the feature
        this.$previews = $(this.options.selectors.preview);

        // use events function to add event handlers
        this.events();
      },
      setup: function setup(){
        var is_setup = true; // is_allowed_page && !( is_denied_permanet || is_denied_by_url );

        // return value gets evaluated at pageload.
        // must return Boolean() true or false
        // if false, other API function will be left out and the script gets faster
        return is_setup;
      }
    }

  });
})(jQuery);
