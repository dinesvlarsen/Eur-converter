<template>
	<!-- Displays loading while we wait for api calls-->
	<div v-if="loading">Loading...</div>

	<!-- When the loading is not true anymore, this element gets displayed -->
	<div v-else class="converter">
		<h1 class="converter__heading">EUR Converter</h1>
		<p class="converter__selected-currency">
			{{ convertFrom.amount }} {{ usersCountryCurrency }} equals
		</p>

		<div class="converter__calculated-output">{{ calculateValue() }} EUR</div>

		<div class="converter__controls">
			<input
				class="controls__amount"
				type="number"
				name="Currency Amount"
				id=""
				v-model="convertFrom.amount"
				aria-label="Currency Amount"
			/>

			<select
				class="controls__dropdown"
				name="convert-from"
				id="convert-from"
				v-model="convertFrom.currencyFullName"
				aria-label="Currency Type"
			>
				<option
					v-for="(value, key) in currencyFullNames"
					:key="key"
					:value="value"
				>
					{{ value }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			data: [],
			convertFrom: {
				currencyFullName: '',
				currencyInitials: '',
				amount: 1,
			},
			currencyFullNames: {},
			currencyRatesData: [],
			usersCountryCurrency: '',
			currencyRate: 0,
		};
	},

	async created() {
		await this.getData();
		await this.ipLookUp();
		this.convertFrom.currencyFullName = this.usersCountryCurrency;
	},

	methods: {
		async ipLookUp() {
			try {
				const ipUrl = 'http://ip-api.com/json';
				const location = await this.getDataFromUrl(ipUrl, 'country');

				const restCountriesUrl = `https://restcountries.com/v2/name/${location.toLowerCase()}`;

				const countryData = await this.getDataFromUrl(restCountriesUrl);
				const countryCurrencyCode =
					countryData[0].currencies[0].code.toLowerCase();

				const objectCopy = Object.assign({}, this.currencyFullNames);

				this.usersCountryCurrency = objectCopy[countryCurrencyCode];
			} catch (error) {
				//If any of the location apis fail to get location of the user on startup, it will just set the default value to be Euro.
				console.error('hello there was an error: ' + error);
				this.usersCountryCurrency = 'Euro';
			}
		},

		async getData() {
			const urlCurrencyRates =
				'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json';

			const urlcurrencyFullNames =
				'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json';

			this.currencyRatesData = await this.getDataFromUrl(
				urlCurrencyRates,
				'eur'
			);
			this.currencyFullNames = await this.getDataFromUrl(urlcurrencyFullNames);

			this.loading = false;
		},

		async getDataFromUrl(url, key) {
			try {
				const response = await fetch(url);
				const data = await response.json();

				if (key) {
					return data[key];
				}

				return data;
			} catch (error) {
				console.error(`Error: ${error}`);
				this.$router.push('error');
			}
		},

		//Function to get a key based on a value in an object, taken from https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
		getKeyByValue(object, value) {
			return Object.keys(object).find((key) => object[key] === value);
		},

		calculateValue() {
			this.currencyRate =
				this.currencyRatesData[this.convertFrom.currencyInitials];
			const sum =
				this.convertFrom.amount /
				this.currencyRatesData[this.convertFrom.currencyInitials];
			return sum.toFixed(2);
		},
	},

	watch: {
		'convertFrom.currencyFullName'() {
			const targetCopy = Object.assign({}, this.currencyFullNames);
			const key = this.convertFrom.currencyFullName;
			this.convertFrom.currencyInitials = this.getKeyByValue(targetCopy, key);
			this.usersCountryCurrency = this.convertFrom.currencyFullName;
		},
	},
};
</script>

<style>
.converter {
	padding: 80px 32px;
}

.converter__heading {
	margin-bottom: 24px;
	font-size: 32px;
}

.converter__selected-currency {
	margin-bottom: 8px;
	font-size: 14px;
}

.converter__calculated-output {
	margin-bottom: 24px;
	font-weight: bold;
	font-size: 32px;
}

.converter__controls {
	display: flex;
	gap: 16px;
}

.controls__amount {
	width: 120px;
	padding: 5px 12px;
	border-radius: 5px;
	color: #676a74;
	border: 1px solid #cccccc;
}

.controls__amount:focus {
	color: #202124;
}

.controls__dropdown {
	width: 120px;
	border-radius: 5px;
	color: #202124;
	background: inherit;
	font-size: 11px;
	padding: 5px 10px;
	border: 1px solid #cccccc;

	/* Styles taken from https://stackoverflow.com/questions/1895476/how-do-i-style-a-select-dropdown-with-only-css */

	/* All of these remove the default arrow */
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	/* Adds your own arrow */
	background-image: url(./images/dropdown-arrow.svg);
	/* Stops it from being 90000 arrows */
	background-repeat: no-repeat;
	/* Positions arrow within the select element */
	background-position: 94% 60%;
}

@media screen and (min-width: 1000px) {
	.converter__heading {
		margin-bottom: 32px;

		font-size: 64px;
	}

	.converter__selected-currency {
		margin-bottom: 16px;
		font-size: inherit;
	}

	.converter__calculated-output {
		margin-bottom: 32px;
	}

	.controls__amount,
	.controls__dropdown {
		width: 149px;
	}

	.controls__dropdown {
		font-size: 14px;
	}
}
</style>
