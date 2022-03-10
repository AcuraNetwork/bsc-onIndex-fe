/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Button } from '@onidex-libs/uikit';
import styled from 'styled-components';

import './index.css';
import {
	widget as Widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
    IBasicDataFeed,
	// IChartingLibraryWidget,	
	ResolutionString,
} from './charting_library';
import getDataFeed from './api/tvDatabaseApi';
import { usePriceBnbBusd } from 'state/hooks';
import useTheme from 'hooks/useTheme';

export interface ChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol'];
	interval: ChartingLibraryWidgetOptions['interval'];

	// BEWARE: no trailing slash is expected in feed URL
	datafeedUrl: string;
	libraryPath: ChartingLibraryWidgetOptions['library_path'];
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
	clientId: ChartingLibraryWidgetOptions['client_id'];
	userId: ChartingLibraryWidgetOptions['user_id'];
	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
	autosize: ChartingLibraryWidgetOptions['autosize'];
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
	containerId: ChartingLibraryWidgetOptions['container_id'];
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

const TVChartContainer = ({ selectedCurrency, jwtToken, containerId }) => {
    const { isDark, toggleTheme } = useTheme()
	const [defaultProps] = useState<ChartContainerProps>({
		symbol: 'AAPL',
		interval: '15' as ResolutionString,
		containerId: containerId || 'tv_chart_container',
		datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	});
    const bnbPriceUSD = usePriceBnbBusd();
    const isBnbPrice = parseFloat(bnbPriceUSD.toString()) > 0;

	const [tvWidget, setTvWidget] = useState(null);
    const [chartData, setChartData] = useState();
    
	useEffect(() => {
        const configureWidget = () => {
            const widgetOptions:ChartingLibraryWidgetOptions = {
                symbol: defaultProps.symbol as string,
                // BEWARE: no trailing slash is expected in feed URL
                // tslint:disable-next-line:no-any
                datafeed: getDataFeed(selectedCurrency, parseFloat(bnbPriceUSD.toString()), jwtToken, () => { console.log('ant: data loaded')}),
                // datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
                interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
                container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
                library_path: defaultProps.libraryPath as string,
    
                locale: getLanguageFromURL() || 'en',
                disabled_features: ['use_localstorage_for_settings', 'header_symbol_search'],
                enabled_features: ['study_templates'],
                charts_storage_url: defaultProps.chartsStorageUrl,
                charts_storage_api_version: defaultProps.chartsStorageApiVersion,
                client_id: defaultProps.clientId,
                user_id: defaultProps.userId,
                fullscreen: defaultProps.fullscreen,
                autosize: defaultProps.autosize,
                studies_overrides: defaultProps.studiesOverrides,
                container: '',
                theme: isDark ? 'Dark' : 'Light'
            };
    
            const newTvWidget = new Widget(widgetOptions);
            setTvWidget(newTvWidget);
    
            newTvWidget.onChartReady(() => {
                newTvWidget.headerReady().then(() => {
                    const button = newTvWidget.createButton();
                    button.setAttribute('title', 'Click to show a notification popup');
                    button.classList.add('apply-common-tooltip');
                    button.addEventListener('click', () => newTvWidget.showNoticeDialog({
                        title: 'Notification',
                        body: 'TradingView Charting Library API works correctly',
                        callback: () => {
                            // console.log('Noticed!');
                        },
                    }));
                    button.innerHTML = 'Check API';
                });
            });
        }

        if (isBnbPrice && jwtToken) {
            configureWidget();
        }
        
		return function cleanup() {
			if (tvWidget !== null) {
				tvWidget.remove();
				setTvWidget(null);
				// tvWidget = null;
			}
		}
		// eslint-disable-next-line
	}, [isBnbPrice, isDark, selectedCurrency.address, jwtToken]);

	return (
        <>
            <ChartContainer
                id={defaultProps.containerId}
            />
        </>
	);
}

const ChartContainer = styled.div`
    height: calc(100vh - 270px);

    iframe {
        border-radius: 16px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
        height: calc(100vh - 210px);
    }
`;

export default TVChartContainer