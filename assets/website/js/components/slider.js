import web from 'massive-web';
import $ from 'jquery';
import 'slick-carousel';

class Slider {
    /**
     * Initialize component.
     *
     * @param {Object} $el
     */
    initialize($el) {
        this.$el = $($el);
        this.$window = $(window);

        this.startSlider();
        this.bindListeners();
    }

    /**
     * Reinitialize slider on window resize to allow for responsive slider behaviour.
     */
    bindListeners() {
        this.$window.on('resize', this.startSlider.bind(this));
    }

    startSlider() {
        this.$projectSlider = this.$el.find('.js-project-slider');
        this.$currentSlide = this.$el.find('.js-current-slide');

        if (this.$projectSlider.hasClass('slick-initialized')) {
            return;
        }

        this.$projectSlider.on('afterChange', (event, slick) => {
            const index = slick.currentSlide;

            this.$currentSlide.text(index + 1);
            this.changeProjectSliderText(index);
        });

        this.$projectSlider.slick({
            rows: 0,
            slidesToShow: 1,
            arrows: true,
            speed: 800,
            appendArrows: this.$el.find('.js-projects-arrows'),
            prevArrow: this.$el.find('.js-projects-prev-arrow'),
            nextArrow: this.$el.find('.js-projects-next-arrow'),
        });
    }

    changeProjectSliderText(currentSlideIndex) {
        const $texts = this.$el.find('.js-projects-slider-text');

        $texts.each((index, text) => {
            const button = $(text).find('.js-projects-slider-text-button').get(0);

            $(text).hide();

            if (button) {
                $(button).addClass('button--no-animation');
            }

            if (index === currentSlideIndex) {
                $(text).fadeIn('slow');

                if (button) {
                    $(button).hover(() => {
                        $(button).removeClass('button--no-animation');
                    });
                }
            }
        });
    }
}

web.registerComponent('slider', Slider);
