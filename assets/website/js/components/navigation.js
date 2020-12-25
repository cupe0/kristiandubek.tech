import web from 'massive-web';
import $ from 'jquery';

class Navigation {
    /**
     * Initialize component.
     *
     * @param {Object} $el
     */
    initialize($el) {
        this.$el = $($el);
        this.$window = $(window);
        this.$navigation = this.$el.find('.js-navigation');
        this.$anchorLink = this.$navigation.find('.js-navigation-item');
        this.$anchorTag = this.$el.find('.js-navigation-anchor');

        this.bindListeners();
    }

    /**
     * Binds Event Listeners.
     */
    bindListeners() {
        this.$window.on('load scroll resize', this.toggleActiveNavigationItem.bind(this));
    }

    toggleActiveNavigationItem() {
        let anchorTagY;
        let activeIndex = this.$anchorTag.length;

        do {
            anchorTagY = this.$anchorTag.get(--activeIndex).getBoundingClientRect().top;

            if (activeIndex === 0) {
                break;
            }
        } while (anchorTagY > 1);

        this.$anchorLink.each((linkIndex, navigationLink) => {
            if (linkIndex === activeIndex) {
                $(navigationLink).addClass('navigation-item--active');
            } else {
                $(navigationLink).removeClass('navigation-item--active');
            }
        });
    }
}

web.registerComponent('navigation', Navigation);
