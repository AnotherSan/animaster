addListeners();

function addListeners() {
    const {
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        addMove,
        addScale,
        addDelay,
        addFadeIn,
        addFadeOut,
        play,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
    } = animaster();

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document
        .getElementById('fadeInStop')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn(block);
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 5000);
        });

    document
        .getElementById('fadeOutStop')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut(block);
        });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        scale(block, 1000, 1.25);
    });

    document
        .getElementById('moveStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            resetMoveAndScale(block);
        });

    document
        .getElementById('scaleStop')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            resetMoveAndScale(block);
        });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide = moveAndHide(block, 1000)
        });

    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.reset();
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 1000);
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = heartBeating(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    let _steps=[];
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function addMove(duration, translation) {
        this._steps.push([this.move.name, duration, translation])
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push([this.scale.name, duration, ratio])
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push([this.fadeIn.name, duration])
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push([this.fadeOut.name, duration])
        return this;
    }

    function addDelay(duration) {
        this._steps.push(['delay', duration])
        return this;
    }

    function play(element, cycled) {
        if(_steps.length !=0){
            playStep(element);
            if(cycled) _steps.push(_steps[0]);
            setTimeout(() => {
            play(element, cycled);
            }, _steps[1]);
        }
        return {
            stop() {
                clearInterval(interval);
            },
            reset() {
                switch (element.id) {
                    case 'fadeInBlock':
                        setTimeout(()=>resetFadeIn(element),_steps[1]);
                        break;
                    case 'fadeOutBlock':
                        setTimeout(()=>resetFadeOut(element),_steps[1]);
                        break;
                    case 'scaleBlock':
                        setTimeout(()=>resetMoveAndScale(element),_steps[1]);
                        break;
                    case 'moveBlock':
                        setTimeout(()=>resetMoveAndScale(element),_steps[1]);
                        break;
                    case 'moveAndHideBlock':
                        setTimeout(()=>resetMoveAndScale(element),_steps[1]);
                        break;
                }
            }
        }
    }

    function playStep(element) {
        switch(_steps[0]){
            case 'move':
                move(element, _steps[1], _steps[2]);
                break;
            case 'fadeIn':
                fadeIn(element, _steps[1]);
                break;
            case 'scale':
                scale(element, _steps[1], _steps[2]);
                break;
            case 'fadeOut':
                fadeOut(element, _steps[1]);
                break;
        }
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function moveAndHide(element, duration) {
        return animaster().addMove(duration * 0.4, {x: 100, y: 20}).addFadeOut(duration * 0.6).play(element)
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;
        animaster().addFadeIn(interval).addDelay(interval).addFadeOut(interval).play(element)
    }

    function heartBeating(element) {
        return animaster().addScale(500, 1.4).addScale(500, 1).play(element,true);
    }

    return {
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
    };
}
