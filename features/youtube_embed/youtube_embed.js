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
     * Youtube embed
     * 
     * Example YouTube URL formats
     * * http://www.youtube.com/embed?v=aqz-KE-bpKQ
     * * http://www.youtube.com/watch?v=aqz-KE-bpKQ
     * * https://youtu.be/aqz-KE-bpKQ
     *
     * Download the Youtube Preview image from here
     * @link https://get-youtube-video-thumbnail-image.com
     *
     * Upload it to your server and use it as preview image src attribute
     * 
     * @example
     * <figure class="youtube-preview">
     *   <a href="https://youtu.be/aqz-KE-bpKQ"><img src="img/big-buck-bunny-preview.jpg" /></a>
     *   <figcaption>Mit Klick auf das Vorschaubild wir eine Verbindung zu Youtube aufgebaut. Lesen Sie sich unsere <a href="../datenschutzerklaerung.html">Datenschutzerklärung</a> durch!</figcaption>
     * </figure>
     */
    youtube_embed: {
      options: {
        youtube_api_src: 'https://www.youtube.com/iframe_api',
        autoplay: true,
        classNames:{
          preview: 'youtube-preview',
          iframe: 'youtube-iframe',
        },
        selectors: {
          preview: 'figure.youtube-preview',
          caption: 'figcaption',
          api_script: '#youtube-api',
        }
      },
      templates:{
        'api_script': '<script id="youtube-api">',
      },
      youtube_parser: function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return ( match && match[7].length === 11 ) ? match[7] : false;
      },
      events: function events(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            templates = this.templates,
            autoplay = this.options.autoplay,
            youtube_api_src = this.options.youtube_api_src,
            info = this.info,
            youtube_preview_iframe = this;

        this.$previews.children('a').on('click', function(event){
          var player_id = Date.now().toString(),
              $anchor = $(this).attr('id', player_id),
              $preview = $anchor.parent(),
              $preview_img = $(this).children('img'),
              youtube_id = youtube_preview_iframe.youtube_parser($anchor.get(0)['href']),
              player,
              player_ready = function(){
                $preview.children(selectors.caption).hide();
                if ( autoplay ) {
                  player.playVideo();
                }
              },
              player_call = function(){
                timeout = clearTimeout(timeout);
                if ( typeof window.YT === 'undefined' || window.YT.loaded === 0 ) {
                  console.log('loading YT');
                  timeout = setTimeout(player_call, 15);
                } else {
                  player = new YT.Player(player_id, {
                    height: $preview_img.height(),
                    width: $preview_img.width(),
                    videoId: youtube_id,
                    events: {
                      'onReady': player_ready,
                    }
                  });
                }
              },
              timeout;

          if ( $(selectors.api_script).length <= 0 ) {
            $anchor.parent().append($(templates.api_script).attr('src', youtube_api_src));
          }
          timeout = setTimeout(player_call, 15);
          event.preventDefault();
        });
      },
      ready: function ready(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            templates = this.templates,
            info = this.info,
            $body = sandboxTheme.$body;

        // register youtube previews to the feature
        this.$previews = $(selectors.preview);

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
