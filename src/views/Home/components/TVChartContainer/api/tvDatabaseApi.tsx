
import historyProvider from './historyProvider';
import { subscribeBars, unsubscribeBars} from './stream';

const supportedResolutions = ['1', '5', '15', '30', '60', '240', 'D', 'W'];
const config = {
    supported_resolutions: supportedResolutions
};

const getDataFeed = (selectedCurrency, bnbPriceUSD, jwtToken, onDataLoaded) => {
    return {
        onReady: cb => {
            setTimeout(() => cb(config), 0);
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        searchSymbols: () => {},
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
			try {
				const tSymbolName = selectedCurrency ? selectedCurrency.symbol : 'BNB'
				const brokerName = selectedCurrency ? selectedCurrency.symbol : 'BNB'
				const symbolStub = {
					// base_name: tSymbolName,
					name: 'brokerName', 
                    full_name: selectedCurrency && selectedCurrency.symbol === 'WBNB' ? 'BNB' : `${tSymbolName}/BNB`,
					pro_name: selectedCurrency && selectedCurrency.symbol === 'WBNB' ? 'BNB' : `${tSymbolName}/BNB`,
					description: '',
					timezone: 'Etc/UTC',
					// ticker: tSymbolName,
					exchange: brokerName, 
                    // brokerName,
					minmov: 1,
                    pricescale: 10000000,
					has_intraday: true,
					intraday_multipliers: supportedResolutions,
					supported_resolution: supportedResolutions,
					volume_precision: 8,
					data_status: 'streaming',
					legs: '',
                    type: '',
                    session: '24x7',
                    listed_exchange: '',
                    format: 'price'
				};
				setTimeout(() => {
					try {
						onSymbolResolvedCallback(symbolStub);
					} catch (error) {
						onResolveErrorCallback(error);
					}	
				}, 0);
			} catch (error) {	
				onResolveErrorCallback(error);
			}
        },

        getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
            // if (mainStrategy !== undefined) {
				// if (selectedSymbol) {
                setTimeout(() => {
                	historyProvider.getBars(selectedCurrency, symbolInfo, resolution, periodParams.from, periodParams.to, bnbPriceUSD, jwtToken)
                    .then(bars => {
                        if (bars.length) {
                            onHistoryCallback(bars, { noData: false });
                            onDataLoaded();
                        } else {
                            onHistoryCallback(bars, { noData: true });
                        }
                    })
                    .catch(error => {
                        onErrorCallback(error);
					});
                }, 100);
				// }
            // }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID) => {
            subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID);
        },
        unsubscribeBars: subscriberUID => {
            unsubscribeBars(subscriberUID);
        },
        // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        //     // if (resolution !== selectedInterval) {
        //     //     store.dispatch({type: SET_TIME_FRAME, payload: resolution});
        //     // }
		// 	// return resolution;
		// 	return selectedInterval;
        // },
        // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => { return [] },
        // getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => { return [] },
        // getServerTime: () => { return (new Date()).getTime() }
    };
};

export default getDataFeed;