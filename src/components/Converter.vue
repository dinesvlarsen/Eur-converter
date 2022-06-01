<template>
	<!-- Displays loading while we wait for api calls-->
	<div v-if="loading">Loading...</div>

	<!-- When the loading is not true anymore, this element gets displayed -->
	<div v-else class="converter">
		<h1 class="converter__heading">EUR Converter</h1>
		<p class="converter__selected-currency">
			{{ convertFrom.userInput }} {{ convertFrom.fullname }} equals
		</p>

		<div class="converter__calculated-output">{{ calculateValue() }} EUR</div>

		<div class="converter__controls">
			<input
				class="controls__amount"
				type="number"
				name="Currency Amount"
				id=""
				v-model="convertFrom.userInput"
				aria-label="Currency Amount"
			/>

			<select
				class="controls__dropdown"
				name="convert-from"
				id="convert-from"
				v-model="convertFrom.fullname"
				:value="convertFrom.fullname"
				aria-label="Currency Type"
			>
				<option v-for="value in fullNamesObject" :value="value">
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
				fullname: '',
				currencyInitials: '',
				userInput: 1, //The value the user inputs
			},
			fullNamesObject: {}, //Object containing currency full-names accessed through their currency code e.g 'nok' : 'Norwegian Krone'
			allRates: {},
			currencyRate: 0,
		};
	},

	async created() {
		console.log(process.env.THIS_IS_TEST);

		//Gets the euro conversion rates, and names
		await this.getData();
		await this.setUserData();
	},

	methods: {
		async setUserData() {
			try {
				const userCity = await this.getUserCity();
				const [initials, fullname] = await this.getUserCurrency(userCity);
				this.convertFrom.currencyInitials = initials;
				this.convertFrom.fullname = fullname;
			} catch (e) {
				console.error(e);
				console.error(
					"Couldn't load local currency, probably caused by something blocking use from getting your ip (Ad block?"
				);
				this.convertFrom.currencyInitials = 'nok';
				this.convertFrom.fullname = 'Norwegian krone';
			}

			this.loading = false;
		},

		async getUserCity() {
			const ipinfo_key = process.env.IP_INFO_KEY;
			const response = await fetch(
				`https://ipinfo.io/json?token=${ipinfo_key}`
			);
			const { city } = await response.json();

			return city;
		},
		//Uses the users capital (retrieved from getUserIp) and requests the currency data from the restcountries api.
		async getUserCurrency(capital) {
			const response = await fetch(
				`https://restcountries.com/v3.1/capital/${capital}?fields=currencies`
			).catch((error) =>
				console.error('failed to fetch capital: ', error.text)
			);
			const data = await response.json();

			const list = [];
			const initials = Object.keys(data[0].currencies)[0].toLowerCase();
			const fullname = data[0].currencies[initials.toUpperCase()].name;
			list.push(initials, fullname);

			return list;
		},

		//Initial method that runs to query for the currency initials, full names euro conversion rates.
		async getData() {
			//api link to query for the current rates
			const currencyRatesURL =
				'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json';

			//	api link to query for the full name of the currency.
			const fullNamesURL =
				'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.min.json';

			// returns the currency rates from querying the URL
			// we pass inn 'eur' as an argument so we get the currency rates.
			// we use 'eur' because the response from the currencyrates request is different than full names. So we use the string 'eur' as a key to access what we want.
			this.allRates = await this.getDataFromURL(currencyRatesURL, 'eur');

			//we store the object containing the currency initials and full names in key value pairs: {}
			this.fullNamesObject = await this.getDataFromURL(fullNamesURL);
		},

		//Gets either currency data (if 'eur' is specified) or currency full names.
		async getDataFromURL(url, eur) {
			try {
				const response = await fetch(url);
				const data = await response.json();

				if (eur) {
					return data[eur];
				}

				return data;
			} catch (error) {
				console.error(`Error: ${error}`);
				this.$router.push('error');
			}
		},

		//Function to get a key based on a value in an object, taken from https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
		getCurrencyInitials(fullNamesObject, fullname) {
			const allCurrencyInitials = Object.keys(fullNamesObject);
			const currencyInitials = allCurrencyInitials.find(
				(currencyInitials) => fullNamesObject[currencyInitials] === fullname
			);

			return currencyInitials;
		},

		calculateValue() {
			this.currencyRate = this.allRates[this.convertFrom.currencyInitials];
			const sum =
				this.convertFrom.userInput /
				this.allRates[this.convertFrom.currencyInitials];
			return sum.toFixed(2);
		},
	},

	watch: {
		//Controls the entire conversion operation, and sets all the values for the output.
		'convertFrom.fullname'() {
			const fullname = this.convertFrom.fullname;

			//Gets the currency initials from the object containing all the currency initials and full names, by iterating over the object with .find and checking its values against the name we've passed in as an argument. Returning the key of the matching value.
			//E.g 'Norwegian krone' === 'Norwegian krone' and norwegian krone has 'nok as a key, so we get NOK
			this.convertFrom.currencyInitials = this.getCurrencyInitials(
				this.fullNamesObject,
				fullname
			);
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
	background-image: url(images/dropdown-arrow.svg);
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
