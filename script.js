class Product {
	constructor() {
		this.datta = []; // массив объектов, обект содержит наименование, цену и количество

		this._table = document.querySelector('.table'); // элемент - таблица
		this._cena = document.querySelector('#cena'); // элемент - поле цена
		this._add = document.querySelector('#add'); // элемент - кнопка Добавить

		// навешиваем обработчик событий на ввод цены в поле, чтобы вводились тоько цифры
		this._cena.addEventListener('input', () => { this._cena.value = this._cena.value.replace(/[^\d]/g, '') });

		// навешиваем обработчик событий на добавление цены по кнопке
		this._add.addEventListener('click', this.add.bind(this));

		// навешиваем обработчик событий на добавление цены с клавиатуры (enter)
		document.addEventListener('keypress', ({ charCode }) => { if (charCode == 13) this.add() });
	}

	// Метод добавления товара
	add() {
		let flag = 0, // флаг добавить товар
			flagforeach = 0, // флаг окончания перебора свойства экземпляра 

			name = document.querySelector('#name').value, // берем наименование 
			cena = document.querySelector('#cena').value; // берем цену

		if (!(!name || !cena)) { // если наименование или цена не указана, то ничего не делаем
			const kolichestvo = 1; // при добавлении нового товара в еденичном экземпляре

			if (!this.datta.length) { // если товаров нет
				flag = 1;
			} else {
				this.datta.forEach(key => { // проверка на повтор товара
					if (!flagforeach) {
						if (key['name'] == name) {
							alert("Такой продукт уже есть!");
							flag = 0;
							flagforeach = 1;
						} else {
							flag = 1;
						}
					}
				})

			};

			if (flag) { // если свойтсво экземпляра пусто или повторяющегося товара нет
				var item = { name, cena, kolichestvo }; // объект со свойствами товара
				this.datta.push(item); // записываем данные в свойство экземпляра класса
				
				const listItem = this.createListItem(item); // вернется новый элемент таблицы с навешанными обработчиками
				this._table.appendChild(listItem); // добавляется элемент таблицы на страницу

				this.summ(this.datta); // считается общая цена товара
			};
		};
	}


	// подсчет общей цены товаров, из свойства экземпляра берется цена и количество
	summ(data) {
		let summa = 0;

		Object.keys(data).forEach(key => {
			summa += data[key]['cena'] * data[key]['kolichestvo'];
		});
		// добавление новой цены на страницу
		const cena = document.querySelector('.cena');
		cena.textContent = summa;
	}

	// метод создание елемента, добавления ему свойств(тип, класс, (текст или число)) и дочених элементов
	createElement(tag, props, ...children) { 
		const element = document.createElement(tag); // создание элемента

		Object.keys(props).forEach(key => { // добавление свойств
			element[key] = props[key];
		});

		children.forEach(child => { // добавление текста или числа
			if (typeof child === 'string' || typeof child === 'number') {
				child = document.createTextNode(child);
			};

			element.appendChild(child);
		});

		return element;

	}

	// метод для создания элемента таблицы, аргумент todo - объект со свойствами товара
	// создаюется элемент, в котором: кнопка плюс 1, минус 1, кнопка удалить, наименование, цена, количество
	createListItem(todo) {
		const buttonUp = this.createElement('button', { type: 'button', className: 'plusStyle up' }, '+');
		const buttonDown = this.createElement('button', { type: 'button', className: 'minusStyle down' }, '-');
		const buttonDetete = this.createElement('button', { type: 'button', className: 'removeStyle delet' }, 'del');
		const tdName = this.createElement('td', {}, todo.name);
		const tdCena = this.createElement('td', {}, todo.cena);
		const tdKolichestvo = this.createElement('td', {}, todo.kolichestvo);
		const tdBtnUp = this.createElement('td', {}, buttonUp);
		const tdBtnDown = this.createElement('td', {}, buttonDown);
		const tdBtnDelete = this.createElement('td', {}, buttonDetete);
		// объединение в единый элемент
		const item = this.createElement('tr', {}, tdName, tdCena, tdKolichestvo, tdBtnUp, tdBtnDown, tdBtnDelete);

		return this.addEventListeners(item); // навешивание событий на кнопки элемента таблицы

	}

	// навешивание событий на кнопки плюс 1, минус 1, удалить
	addEventListeners(listItem) {
		const delet = listItem.querySelector('.delet');
		const down = listItem.querySelector('.down');
		const up = listItem.querySelector('.up');

		delet.addEventListener('click', this.delet.bind(this));
		down.addEventListener('click', this.down.bind(this));
		up.addEventListener('click', this.up.bind(this));

		return listItem;
	}

	// метод прибавления количества для товара (+1)
	up({ target }) { // target - нажатая кнопка
		let elements = target.parentNode.parentNode.querySelectorAll('*'),// все элементы относящиеся к товару, у которого нажата кнопка
			name = elements[0].textContent,// наименование товара, у которого нажата кнопка
			position; // номер нужного объекта в свойтсва (массиве) экземпляра класса

		this.datta.forEach( (key, index) => { 
			if (key['name'] == name) {
				position = index;
			}
		});


		this.datta[position]['kolichestvo'] = this.datta[position]['kolichestvo'] + 1; // изменение цены в свойсве экземпляра
		this.summ(this.datta); // пересчет новой цены

		elements[2].textContent = this.datta[position]['kolichestvo']; // добавление на страницу
	}

	// метод уменьшения количества для товара (-1)
	down({ target }) { // target - нажатая кнопка
		let elements = target.parentNode.parentNode.querySelectorAll('*'),// все элементы относящиеся к товару, у которого нажата кнопка
			name = elements[0].textContent,// наименование товара, у которого нажата кнопка
			position; // номер нужного объекта в свойтсва (массиве) экземпляра класса

		this.datta.forEach( (key, index) => { 
			if (key['name'] == name) {
				position = index;
			}
		});

		if (this.datta[position]['kolichestvo'] > 1) { // проверка, чтобы не уйти в минус по количеству данного товара
			this.datta[position]['kolichestvo'] = this.datta[position]['kolichestvo'] - 1;// изменение цены в свойсве экземпляра
			this.summ(this.datta);// пересчет новой цены

			elements[2].textContent = this.datta[position]['kolichestvo']; // добавление на страницу
		};
	}

	// метод удаления товара из корзины
	delet({ target }) { // target - нажатая кнопка
		let parentNode = target.parentNode.parentNode, // весь элемент таблицы (товар) // для удаления со страницы
		 	elements = parentNode.querySelectorAll('*'), // внутрение элементы товара // для удаления из свойства экземпляра
			name = elements[0].textContent,// наименование товара, у которого нажата кнопка
			position;  // номер нужного объекта в свойтсва (массиве) экземпляра класса
		
			this.datta.forEach( (key, index) => { 
				if (key['name'] == name) {

					position = index;
				}
			});

		this.datta.splice(position, 1); // удаление объекта (товар) из свойства экземпляра
		parentNode.remove(); // удаление товара со страницы
		this.summ(this.datta); // пересчет общей суммы
	}


}


const product = new Product();