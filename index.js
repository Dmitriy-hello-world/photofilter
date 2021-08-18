'use strict';

window.addEventListener('DOMContentLoaded', () => {

    class Canvas {
        constructor(canvas) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d");
          this.img = new Image();
          this.img.setAttribute("crossOrigin", "anonymous");
          this.img.onload = () => {
            this.canvas.width = this.img.width;
            this.canvas.height = this.img.height;
            this.ctx.drawImage(this.img, 0, 0);
          };
        }
      
        loadImage(src) {
          this.img.src = src;
        }
      
        applyFilters(filters) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          let sumFilters = "";
          for (const key in filters) {
            sumFilters += `${key}(${filters[key]})`;
          }
          this.ctx.filter = sumFilters;
          this.ctx.drawImage(this.img, 0, 0);
        }
      
        downloadImage() {
          const link = document.createElement("a");
          link.download = "image.png";
          link.href = this.canvas.toDataURL();
          link.click();
          link.delete;
        }
    }

    const inputs = document.querySelectorAll('.filter__input'),
          presets = document.querySelectorAll('.filter__preset-link'),
          images = document.querySelectorAll('[data-img]'),
          mainImg = document.querySelector('.fiter__main-img'),
          reset = document.querySelector('#reset'),
          next = document.querySelector('#next'),
          load = document.querySelector('#load'),
          save = document.querySelector('#save'),
          cssStyle = document.documentElement.style,
          defaultFilters = {
            "blur": "0px",
            "invert": "0%",
            "sepia": "0%",
            "saturate": "100%",
            "hue-rotate": "0deg",
            "contrast": "100%",
            "brightness": "100%",
            "grayscale": "0%",
          },
          canvas = new Canvas(document.querySelector("canvas"));
          canvas.loadImage(document.querySelector('.fiter__main-img').src);
          

    let count = 1;

    function updateOutputs() {
        inputs.forEach( item => {
            item.nextElementSibling.textContent = item.value;
        });
    }

    function updateFilter(input) {
        const sufix = input.dataset.sizing;
        document.documentElement.style.setProperty(`--${input.name}`,`${input.value + sufix}`);
    }

    function setFilter(input,name,value) {
        document.documentElement.style.setProperty(`--${name}`, value);
        input.value = parseInt(value);
    }

    function saveImage() {
        const filters = {};
        for (const key in defaultFilters) {
          let filterValue =
          cssStyle.getPropertyValue(`--${key}`) || defaultFilters[key];
          if (key === "blur") {
            const coefficient = document.querySelector('.fiter__main-img').naturalHeight / document.querySelector('.fiter__main-img').height;
            filterValue = filterValue.match(/\d+/) * coefficient + "px";
          }
          filters[key] = filterValue;
        }
        canvas.applyFilters(filters);
        canvas.downloadImage();
      } 

    updateOutputs();

    inputs.forEach( input => {
        input.addEventListener('input', () => {
            updateOutputs();
            updateFilter(input);
        });
    });

    presets.forEach( item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            let styleArr = item.firstElementChild.dataset.filter.match(/\d+/g);
            setFilter(inputs[0],'blur',styleArr[0] + 'px');
            setFilter(inputs[1],'invert',styleArr[1] + '%');
            setFilter(inputs[2],'sepia',styleArr[2] + '%');
            setFilter(inputs[3],'saturate',styleArr[3] + '%');
            setFilter(inputs[4],'hue-rotate',styleArr[4] + 'deg');
            setFilter(inputs[5],'contrast',styleArr[5] + '%');
            setFilter(inputs[6],'brightness',styleArr[6] + '%');
            setFilter(inputs[7],'grayscale',styleArr[7] + '%');
            updateOutputs();
        });
    });

    reset.addEventListener('click', () => {
        presets[0].click();
    });


    next.addEventListener('click', () => { 
        ++count;
        if (count >= 6) {
            count = 1;
        }
        images.forEach( img => {
            img.src = `./img/${count}.jpg`;
        });
        presets[0].click();
        canvas.loadImage(document.querySelector('.fiter__main-img').src);
    });

    load.addEventListener('change', () => {
        const file = load.files[0];
        if (!file) {
            return;
        }    
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function() {
            images.forEach( img => {
                img.src = reader.result;
            });
            presets[0].click();
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
        canvas.loadImage(document.querySelector('.fiter__main-img').src);
    });

    save.addEventListener('click', saveImage);

    console.log(`
    1) Разобраться в коде чужого проекта, понять его, воспроизвести исходное приложение - 10 баллов.
    2) Дополнить исходный проект обязательным дополнительным функционалом, указанным в описании задания - 10 баллов
    3) Дополнить исходный проект дополнительным функционалом на выбор:
      - перелистывание фото - 10 баллов 
      - загрузка в приложение фото с компьютера - 10 баллов 
      - сохранение фото на компьютер вместе с наложенными фильтрами - 10 баллов
      - сброс фильтров кликом на кнопку - 10 баллов
    ----------------------------------------------------------------------------------------------------------------
    Общий балл - максимальный (30 / 30)
    `);
});