import web from 'massive-web';
import $ from 'jquery';
import 'slick-carousel';

class Slider {
    /**
     * Initialize component.
     *
     * @param {Object} $el
     * @param {Array} options
     * @param {String} options.type
     */
    initialize($el, options) {
        this.$el = $($el);
        this.$window = $(window);
        this.options = options;

        if (!this.options) {
            return false;
        }

        this.startSlider();
        this.bindListeners();
    }

    /*
     * Calls the corresponding function depending on the given type.
     */
    startSlider() {
        switch (this.options.type) {
            case 'projects':
                this.startProjectSlider();
                break;
            case 'technology':
                this.startTechnologySlider();
                break;
        }
    }

    /**
     * Reinitialize slider on window resize to allow for responsive slider behaviour.
     */
    bindListeners() {
        this.$window.on('resize', this.startSlider.bind(this));
    }

    /**
     * Starts the project Slider.
     */
    startProjectSlider() {
        const $projectSlider = this.$el.find('.js-project-slider');
        const $currentSlide = this.$el.find('.js-current-slide');

        if ($projectSlider.hasClass('slick-initialized')) {
            return;
        }

        $projectSlider.on('afterChange', (event, slick) => {
            const index = slick.currentSlide;

            $currentSlide.text(index + 1);
            this.changeProjectSliderText(index);
        });

        $projectSlider.slick({
            rows: 0,
            slidesToShow: 1,
            arrows: true,
            speed: 800,
            appendArrows: this.$el.find('.js-projects-arrows'),
            prevArrow: this.$el.find('.js-projects-prev-arrow'),
            nextArrow: this.$el.find('.js-projects-next-arrow'),
        });
    }

    /**
     * Changes the text displayed depending on the current Slide.
     * @param currentSlideIndex
     */
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

    /**
     * Starts the technologies Slider.
     */
    startTechnologySlider() {
        const $technologySlider = this.$el.find('.js-technologies-slider');
        const $navigationItems = this.$el.find('.js-technologies-table-navigation-item');

        $navigationItems.on('click', (event) => {
            const $navigationItem = $(event.currentTarget);

            $navigationItems.removeClass('technologies-table-navigation-item--active');
            $navigationItem.addClass('technologies-table-navigation-item--active');
            $technologySlider.slick('slickGoTo', $navigationItem.data('index'));
        });

        $technologySlider.on('afterChange', (event, slick) => {
            const index = slick.currentSlide;

            $navigationItems.removeClass('technologies-table-navigation-item--active');
            $($navigationItems.get(index)).addClass('technologies-table-navigation-item--active');
        });

        if ($technologySlider.hasClass('slick-initialized')) {
            return;
        }

        $technologySlider.slick({
            rows: 0,
            slidesToShow: 1,
            speed: 300,
            fade: true,
            cssEase: 'linear',
            arrows: true,
            prevArrow: this.$el.find('.js-technologies-prev-arrow'),
            nextArrow: this.$el.find('.js-technologies-next-arrow'),
            responsive: [
                {
                    breakpoint: 9999, // Workaround for hiding arrows on Desktop.
                    settings: {
                        arrows: false,
                    },
                },
                {
                    breakpoint: 1025,
                    settings: {
                        fade: false,
                        speed: 1000,
                        cssEase: 'ease',
                    },
                }],
        });
    }
}

web.registerComponent('slider', Slider);
