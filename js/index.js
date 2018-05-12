var app = new Vue({
    el: '#app',
    data: {
        count: 20,
        mapData: [],
        snake: [],
        target: [],
        direction: 'R',
        pause: false,
        score: 0,
        interval: -1,
        time: 200,
        end: false,
        endMsg: ''
    },
    methods: {
        initMap: function () {
            var _data = [];
            for (let i = 0; i < this.count; i++) {
                var _row = [];
                for (let j = 0; j < this.count; j++) {
                    _row.push(0);
                }
                _data.push(_row);
            }
            this.mapData = _data;
        },
        initSnake: function () {
            this.snake = [
                [4, 0],
                [3, 0],
                [2, 0],
                [1, 0],
                [0, 0]
            ];
        },
        keydown: function (e) {
            switch (e.keyCode) {
                case 38:
                    if (this.direction !== 'D') {
                        this.direction = 'U';
                    }
                    break;
                case 40:
                    if (this.direction !== 'U') {
                        this.direction = 'D';
                    }
                    break;
                case 37:
                    if (this.direction !== 'R') {
                        this.direction = 'L';
                    }
                    break;
                case 39:
                    if (this.direction !== 'L') {
                        this.direction = 'R';
                    }
                    break;
                case 32:
                    this.pause = !this.pause;
                    this.changeSate();
                    break;
                default:
                    break;
            }
        },
        createOneTarget: function () {
            var valid = false,
                x, y, food,
                number = Math.ceil(Math.random() * this.count * this.count);
            while (!valid) {
                x = (number - 1) % (this.count);
                y = Math.ceil(number / this.count) - 1;
                food = [x, y];
                if (this.exit(food)) {
                    number++;
                    if (number > this.count * this.count) {
                        number = number - this.count * this.count;
                    }
                } else {
                    valid = true;
                }
            }
            this.target = food;
            Vue.set(this.mapData[y], x, 2);
        },
        exit: function (p) {
            var _exit = false;
            this.snake.forEach(e => {
                if (p[0] === e[0] && p[1] === e[1]) {
                    _exit = true;
                    return;
                }
            });
            return _exit;
        },
        createNewHead: function () {
            var _snake = this.snake;
            var _head = _snake[0];
            var _newHead = [];
            switch (this.direction) {
                case 'U':
                    _newHead[0] = _head[0];
                    _newHead[1] = _head[1] - 1;
                    break;
                case 'D':
                    _newHead[0] = _head[0];
                    _newHead[1] = _head[1] + 1;
                    break;
                case 'L':
                    _newHead[0] = _head[0] - 1;
                    _newHead[1] = _head[1];
                    break;
                case 'R':
                    _newHead[0] = _head[0] + 1;
                    _newHead[1] = _head[1];
                    break;
                default:
                    break;
            }
            return _newHead;
        },
        draw: function (h, t) {
            if (h) {
                Vue.set(app.mapData[h[1]], h[0], 1);
            }
            if (t) {
                Vue.set(app.mapData[t[1]], t[0], 0);
            }
        },
        move: function () {
            var _newHead = this.createNewHead(),
                _snake = this.snake,
                _tail;
            //是否超出边界
            if (_newHead[0] < 0 || _newHead[1] < 0 || _newHead[0] > this.count - 1 || _newHead[1] > this.count - 1) {
                this.end = true;
                clearInterval(this.interval);
                this.endMsg = '游戏结束！';
                return;
            } else { //是否撞到自己 
                if (this.exit(_newHead)) {
                    this.end = true;
                    clearInterval(this.interval);
                    this.endMsg = '游戏结束！';
                    return;
                }
            }
            _snake.unshift(_newHead);
            if (this.target.length === 2 && _newHead.join('-') === this.target.join('-')) {
                this.score++;
                if (this.snake.length === this.count * this.count) {
                    this.end = true;
                    clearInterval(this.interval);
                    this.endMsg = 'You Win';
                } else {
                    this.createOneTarget();
                }
            } else {
                _tail = _snake.pop();
            }
            this.draw(_newHead, _tail);
        },
        changeSate: function () {
            if (!this.end) {
                if (this.interval === -1) {
                    this.interval = setInterval(this.move, this.time);
                } else {
                    clearInterval(this.interval);
                    this.interval = -1;
                }
            }
        }
    },
    created: function () {
        this.initMap();
        this.initSnake();
        window.addEventListener('keydown', this.keydown);
    },
    mounted: function () {
        this.snake.forEach(e => {
            Vue.set(this.mapData[e[1]], e[0], 1);
        });
        this.createOneTarget();
        this.interval = setInterval(this.move, this.time);
    },
    beforeDestroy: function () {
        window.removeEventListener('keydown', this.keydown);
    }
});