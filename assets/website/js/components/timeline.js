import anime from 'animejs';
import web from 'massive-web';
import $ from 'jquery';

class Timeline {
    /**
     * Initialize component.
     *
     * @param {Object} $el
     */
    initialize($el) {
        this.$el = $($el);
        this.$window = $(window);
        this.$svg = this.$el.find('.js-timeline-separator-svg');
        this.$animationImageContainers = this.$el.find('.js-timeline-event-image-container');
        this.animConnectorObjects = [];

        this.$svg.each((index, obj) => {
            this.animConnectorObjects.push({
                svg: obj,
                animation: anime({
                    targets: `#${obj.id} path`,
                    strokeDashoffset: [anime.setDashoffset, 0],
                    easing: 'linear',
                    duration: 1500,
                    direction: 'normal',
                    autoplay: false,
                }),
            });
        });

        this.bindListeners();
    }

    /**
     * Binds Event Listeners.
     */
    bindListeners() {
        this.$window.on('load scroll', this.animateConnectors.bind(this));
        this.$window.on('load scroll', this.animateFrames.bind(this));
        this.$window.on('load resize', this.scaleConnector.bind(this));
    }

    /**
     * Animates connectors.
     */
    animateConnectors() {
        $(this.animConnectorObjects).each((index, obj) => {
            const animationPercent = this.calculateAnimationPercent(obj.svg);
            obj.animation.seek(animationPercent * obj.animation.duration);
        });
    }

    /**
     * Animates image frames.
     */
    animateFrames() {
        this.$animationImageContainers.each((index, obj) => {
            const visibleFrameIndex = this.getVisibleFrameIndex(obj);

            $(obj).children().each((frameIndex, frame) => {
                if (frameIndex === visibleFrameIndex) {
                    $(frame).css('visibility', 'visible');
                } else {
                    $(frame).css('visibility', 'hidden');
                }
            });
        });
    }

    /**
     * Fixes connector animation on ultra-wide and 4k displays.
     * Todo: Use constant values.
     */
    scaleConnector() {
        if (this.$window.innerWidth() >= 1921) {
            this.$svg.children().each((index, connector) => {
                $(connector).attr('vector-effect', '');
            });
        } else {
            this.$svg.children().each((index, connector) => {
                $(connector).attr('vector-effect', 'non-scaling-stroke');
            });
        }
    }

    /**
     * Returns the index of the Image-Frame that currently should be visible.
     *
     * @param animationContainer
     * @returns {number}
     */
    getVisibleFrameIndex(animationContainer) {
        const animationPercent = this.calculateAnimationPercent(animationContainer);
        const numberFrames = $(animationContainer).children().length;

        if (animationPercent === 0) {
            return 0;
        } else if (animationPercent === 1) {
            return numberFrames - 1;
        } else {
            return Math.floor(numberFrames * animationPercent);
        }
    }

    /**
     * Calculates the percentage of an animation based on how much the user has scrolled.
     *
     * @param elem
     * @returns {number}
     */
    calculateAnimationPercent(elem) {
        const rect = elem.getBoundingClientRect();
        const innerHeight = this.$window.innerHeight();

        const startPercent = 0.9;
        const endPercent = 0.6;

        const startCoordinate = innerHeight * startPercent;
        const endCoordinate = innerHeight * endPercent;

        if (rect.bottom > startCoordinate) { // Not Started.
            return 0;
        } else if (rect.bottom < endCoordinate) { // Finished.
            return 1;
        } else { // Running.
            const animationArea = (innerHeight - endCoordinate) - (innerHeight - startCoordinate);
            const bottomDistanceToStart = startCoordinate - rect.bottom;

            return bottomDistanceToStart / animationArea;
        }
    }
}

web.registerComponent('timeline', Timeline);
