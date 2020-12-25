import web from 'massive-web';
import $ from 'jquery';

class LoadingAnimation {
    /**
     * Initialize component.
     *
     * @param {Object} $el
     */
    initialize($el) {
        this.$el = $($el);
        this.$window = $(window);

        this.bindListeners();
    }

    /**
     * Binds Event Listeners.
     */
    bindListeners() {
        this.$window.on('load', () => {
            this.$el.fadeOut('slow');
        });
    }
}

web.registerComponent('loading-animation', LoadingAnimation);
