'use strict';

const inputName = document.querySelector('.input-name');
const inputPhone = document.querySelector('.input-phone');
const inputAddress = document.querySelector('#input-address');
const inputCaptcha = document.querySelector('.input-captcha');
const form = document.querySelector('[name="form"]');

let regInputs = {
	name: /^[-.|a-zA-Zа-яёА-ЯЁ-]+$/,
	phone: /^[-+()\. ;":'0-9]+$/,
	address: /^[-/., a-zA-Zа-яёА-ЯЁ0-9]+$/,
	captcha: /^[0-9]+$/
}

inputName.addEventListener('keypress', (event) => {
	inputReg(event.key, regInputs.name, 'Имя может содержать только буквы и дефис. Не более 25 символов.', inputName);
});
inputPhone.addEventListener('keypress', (event) => {
	inputReg(event.key, regInputs.phone, 'Телефон может содержать цифры, скобки, пробелы и дефис. Не более 25 символов. Обязательное поле.', inputPhone);
});
inputAddress.addEventListener('keypress', (event) => {
	inputReg(event.key, regInputs.address, 'Поле не должно содержать спецсимволов. Обязательное поле.', inputAddress);
});
inputCaptcha.addEventListener('keypress', (event) => {
	inputReg(event.key, regInputs.captcha, 'Поле может содержать только цифры. Обязательное поле.', inputCaptcha, 4);
});

// get phone format
let phoneMask;
let mask;
let maskComplete = false;

intlTelInput(inputPhone, {
	initialCountry: "auto",
	allowDropdown: false,
	customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
		let placeholder; 
		
		if(selectedCountryData.iso2 == 'ru') {
			placeholder = '+' + selectedCountryData.dialCode + '' + selectedCountryPlaceholder.slice(1);
			phoneMask = '{+' + selectedCountryData.dialCode + '}' + selectedCountryPlaceholder.replace(new RegExp('[0-9]', 'g'), '0').slice(1)
		}else{
			placeholder = '+' + selectedCountryData.dialCode + ' ' + selectedCountryPlaceholder;
			phoneMask = '{+' + selectedCountryData.dialCode + '} ' + selectedCountryPlaceholder.replace(new RegExp('[0-9]', 'g'), '0')
		}
		
		if(!mask)
			mask = IMask(
				inputPhone, {
				mask: phoneMask
			})
		else
			mask.updateValue();

		mask.on('accept', function(){
			maskComplete = false;
		});
		mask.on('complete', function(){
			maskComplete = true;
		});

		return 'Телефон'
	},
	geoIpLookup: function(callback) {
		fetch('https://ipinfo.io/?token=b2072b6cafd734')
		.then(response => {return response.ok ? response.json() : false})
		.then(result => {
			result ? callback(result.country) : '';
		})
	},
	utilsScript: "./utils.js?1585994360633"
});

form.addEventListener('submit', formSubmit);

// map
ymaps.ready(init);
function init() {
	fetch('https://ipinfo.io/?token=b2072b6cafd734')
	.then(response => {return response.ok ? response.json() : false})
	.then(result => {
		if(result) {
			let loc = result.loc.split(',');
			let myMap = new ymaps.Map('map', {
		        center: loc,
		        zoom: 12,
		        controls: []
		    });

			let myPlacemark;

			// entering address
		    let suggestView1 = new ymaps.SuggestView('input-address');
		    suggestView1.events.add('select', function(event) {
		    	let address = event.originalEvent.item.value;

		    	ymaps.geocode(address, {
			        results: 1
			    }).then(function (res) {
		            let firstGeoObject = res.geoObjects.get(0);
		            let coords = firstGeoObject.geometry.getCoordinates();

		            createPlacemark(coords);
		        });
		    });

		    // map click
		    myMap.events.add('click', function (e) {
			    let coords = e.get('coords');
			    createPlacemark(coords, 'click');
			});

		    // createPlacemark
			function createPlacemark(coords, type) {
			    if(myPlacemark) {
			        myPlacemark.geometry.setCoordinates(coords);
			    }else{
			        myPlacemark = new ymaps.Placemark(coords, {
				        iconCaption: 'Поиск...'
				    }, {
				        preset: 'islands#darkBlueDotIconWithCaption',
				        draggable: true
				    });;
			        myMap.geoObjects.add(myPlacemark);
			        myPlacemark.events.add('dragend', function () {
			            getAddressMap(myPlacemark.geometry.getCoordinates());
			        });
			    }
			    myMap.setCenter(coords, 12);
			    getAddressMap(coords, type);
			}

		    function getAddressMap(coords, type) {
		        myPlacemark.properties.set('iconCaption', 'поиск...');
		        ymaps.geocode(coords).then(function (res) {
		            let firstGeoObject = res.geoObjects.get(0);

		            myPlacemark.properties.set({
		                iconCaption: [
		                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
		                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
		                ].filter(Boolean).join(', '),
		                balloonContent: firstGeoObject.getAddressLine()
		            });
		            type == 'click' ? inputAddress.value = firstGeoObject.getAddressLine() : '';
		            popopverInfo(inputAddress, '', true);
		        });
		    }
		}
	})
}

// inputReg
function inputReg(key, reg, textMes, input, maxLength = 25) {
	if((!reg.test(key) && input.value.length < maxLength) && key != 'Enter') {
		popopverInfo(input, textMes);
		event.preventDefault();
	}else{
		popopverInfo(input, false, true);
	}

	input.value.length == maxLength ? event.preventDefault() : '';
}

// popopverInfo
function popopverInfo(elem, text, close) {
	if(elem && text) {
		let popover = document.createElement('div');
		let arrow = document.createElement('div');
		let popoverBody = document.createElement('div');

		popover.classList.add('popover', 'bs-popover-right');
		arrow.classList.add('arrow');
		popoverBody.classList.add('popover-body');
		popoverBody.innerHTML = text;

		popover.append(arrow);
		popover.append(popoverBody);

		let popoverExisting = elem.nextSibling;
		
		if(popoverExisting && popoverExisting.classList) {
			popoverExisting.classList.forEach((item) => {
				item == 'popover' ? popoverExisting.remove() : '';
			})
		}

		popover.addEventListener('click', (event) => {
			popover.remove();
		})

		elem.after(popover)

	}else if(elem && close) {
		elem.nextSibling ? elem.nextSibling.remove() : '';
	}
}

// formSubmit
function formSubmit(event) {
	const inputs = document.querySelectorAll('.form-control');
	const button = document.querySelector('[type="submit"]');
	const imgCap = document.querySelector('.form-group img');
	let error = 0;

	inputs.forEach((item) => {
		let inputName = item.getAttribute('name');
		switch(inputName) {
			case 'name':
				if(item.value != '' && !regInputs.name.test(item.value) || item.value.length > 25) {
					popopverInfo(item, 'Имя может содержать только буквы и дефис. Не более 25 символов.');
					error++;
				}
				break;
			case 'phone':
				if(!maskComplete || !regInputs.phone.test(item.value)) {
					popopverInfo(item, 'Телефон может содержать цифры, скобки, пробелы и дефис. Не более 25 символов. Обязательное поле.');
					error++;
				};
				break;
			case 'address':
				if(item.value == '' || !regInputs.address.test(item.value)) {
					popopverInfo(item, 'Поле не должно содержать спецсимволов. Обязательное поле.');
					error++;
				}
				break;
			case 'captcha':
				if(item.value.length < 4 || !regInputs.captcha.test(item.value)) {
					popopverInfo(item, 'Поле может содержать только цифры. Обязательное поле.');
					error++;
				}
				break;
		}
	})
	
	if(!error) {
		button.innerHTML = 'Идет отправка';
		button.setAttribute('disabled', 'disabled');
		const popovers = document.querySelectorAll('.popover');

		fetch('/send.php', {
			method: 'POST',
			body: new FormData(form)
		})
		.then(response => {
			// console.log(response)
			if(response.ok) {
				imgCap.setAttribute('src', 'images/c.gif?'+Math.random());

				form.reset();
				maskComplete = false;

				toast('Успешно отправлено');

				popovers.forEach((item) => {
					item.remove();
				})

				button.innerHTML = 'Отправить';
				button.removeAttribute('disabled');

				// return response.json();
				// return response.text();
			}else{
				toast('Произошла ошибка');

				button.innerHTML = 'Отправить';
				button.removeAttribute('disabled');
			}
		})
	}

	event.preventDefault();
}

function toast(message = ''){
	const toast = document.createElement('div');
	const toastHeader = document.createElement('div');
	const toastTitle = document.createElement('strong');
	const toastButton = document.createElement('button');
	const toastButtonSpan = document.createElement('span');
	const toastBody = document.createElement('div');
	
	toast.classList.add('toast');
	toastHeader.classList.add('toast-header');
	toastTitle.classList.add('mr-auto');
	toastTitle.innerHTML = 'Сообщение';
	toastButton.classList.add('ml-2', 'mb-1', 'close');
	toastButtonSpan.innerHTML = '×';
	toastBody.classList.add('toast-body');

	toast.append(toastHeader);
	toastHeader.append(toastTitle);
	toastHeader.append(toastButton);
	toastButton.append(toastButtonSpan);
	toast.append(toastBody);
	toastBody.innerHTML = message;

	toastButton.addEventListener('click', (event) => {
		toast.remove();
	});

	setTimeout(() => {
		toast.remove();
	}, 2000)

	document.body.append(toast);
}