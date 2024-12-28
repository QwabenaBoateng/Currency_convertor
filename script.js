document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "5cfc17aa6cb22da15673ac29"; // Replace with your ExchangeRate-API key
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const amountInput = document.getElementById("amount");
    const convertButton = document.getElementById("convert-button");
    const convertedValueEl = document.getElementById("converted-value");
    const timestampEl = document.getElementById("timestamp");

    // Populate dropdowns with currency codes
    fetch(apiUrl,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.result === "success") {
                const currencyCodes = Object.keys(data.conversion_rates);

                // Populate the dropdowns
                currencyCodes.forEach((code) => {
                    const optionFrom = document.createElement("option");
                    optionFrom.value = code;
                    optionFrom.textContent = code;

                    const optionTo = document.createElement("option");
                    optionTo.value = code;
                    optionTo.textContent = code;

                    fromCurrencySelect.appendChild(optionFrom);
                    toCurrencySelect.appendChild(optionTo);
                });

                // Set default selections
                fromCurrencySelect.value = "USD";
                toCurrencySelect.value = "GHS";
            } else {
                convertedValueEl.textContent = "Error fetching currency data";
            }
        })
        .catch((error) => {
            console.error("Error fetching currencies:", error);
            convertedValueEl.textContent = "Error fetching currency data. Please try again later.";
        });

    // Perform conversion on button click
    convertButton.addEventListener("click", () => {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = parseFloat(amountInput.value);

        if (!amount || amount <= 0) {
            convertedValueEl.textContent = "Please enter a valid amount.";
            return;
        }

        const conversionApiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;

        fetch(conversionApiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.result === "success") {
                    const convertedAmount = data.conversion_result;
                    const timestamp = new Date(data.time_last_update_utc).toUTCString();

                    // Update UI with conversion result
                    convertedValueEl.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
                    timestampEl.textContent = `Last updated: ${timestamp}`;
                } else {
                    convertedValueEl.textContent = "Error performing conversion";
                }
            })
            .catch((error) => {
                console.error("Error fetching conversion data:", error);
                convertedValueEl.textContent = "Error performing conversion. Please try again.";
            });
    });
});
